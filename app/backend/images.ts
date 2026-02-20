"use server"

import fs from "fs/promises"
import path from "path"
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import crypto from "crypto"

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
  ".svg",
  ".bmp",
  ".ico",
])

/*
 * ── Server-side in-memory cache for S3 bucket listing ──
 *
 * NOTE: In serverless environments (e.g. Vercel) each invocation may run in
 * an isolated process, so this module-level cache only helps within a single
 * warm instance. It still reduces redundant S3 calls during bursts of
 * requests to the same instance but should not be relied upon as a durable
 * cache layer.
 */
interface S3ListingCache {
  version: string      // hash of all keys — acts as a change fingerprint
  keys: string[]       // sorted list of S3 object keys
  timestamp: number    // when this cache entry was created
}

let s3ListingCache: S3ListingCache | null = null
const S3_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function computeVersionHash(keys: string[]): string {
  return crypto.createHash("sha256").update(keys.join("\n")).digest("hex").slice(0, 16)
}

function getS3Config():
  | { error: string }
  | { endpoint: string; bucket: string; accessKeyId: string; secretAccessKey: string } {
  const s3Uri = process.env.S3_URI
  const accessKeyId = process.env.S3_ACCOUNT_ID
  const secretAccessKey = process.env.S3_ACCOUNT_SECRET

  if (!s3Uri || !accessKeyId || !secretAccessKey) {
    return { error: "Missing S3 environment variables (S3_URI, S3_ACCOUNT_ID, S3_ACCOUNT_SECRET)" }
  }

  try {
    const url = new URL(s3Uri)
    const endpoint = `${url.protocol}//${url.host}`
    const pathSegments = url.pathname.split("/").filter(Boolean)
    if (pathSegments.length === 0) {
      return { error: "S3_URI must include a bucket name in the path (e.g. https://endpoint/bucket-name)" }
    }
    return { endpoint, bucket: pathSegments[0], accessKeyId, secretAccessKey }
  } catch {
    return { error: "S3_URI is not a valid URL" }
  }
}

/** Fetches the full S3 listing and updates the server-side cache. */
async function refreshS3ListingCache(): Promise<S3ListingCache | { error: string }> {
  const config = getS3Config()
  if ("error" in config) return config

  const client = new S3Client({
    region: "auto",
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })

  const allKeys: string[] = []
  let continuationToken: string | undefined

  do {
    const command = new ListObjectsV2Command({
      Bucket: config.bucket,
      ContinuationToken: continuationToken,
    })
    const response = await client.send(command)

    if (response.Contents) {
      for (const obj of response.Contents) {
        if (obj.Key) {
          const ext = path.extname(obj.Key).toLowerCase()
          if (IMAGE_EXTENSIONS.has(ext)) {
            allKeys.push(obj.Key)
          }
        }
      }
    }

    continuationToken = response.IsTruncated
      ? response.NextContinuationToken
      : undefined
  } while (continuationToken)

  allKeys.sort()

  const cache: S3ListingCache = {
    version: computeVersionHash(allKeys),
    keys: allKeys,
    timestamp: Date.now(),
  }
  s3ListingCache = cache
  return cache
}

/** Returns the cached listing if still fresh, otherwise refreshes it. */
async function getS3Listing(): Promise<S3ListingCache | { error: string }> {
  if (s3ListingCache && Date.now() - s3ListingCache.timestamp < S3_CACHE_TTL) {
    return s3ListingCache
  }
  return refreshS3ListingCache()
}

export async function getImagesFromDirectory(
  directory: string
): Promise<{ images?: string[]; error?: string }> {
  if (!directory) {
    return { error: "Missing directory" }
  }

  const sanitized = path.normalize(directory).replace(/^(\.\.[/\\])+/, "")
  const absolutePath = path.join(process.cwd(), "public", sanitized)

  if (!absolutePath.startsWith(path.join(process.cwd(), "public"))) {
    return { error: "Invalid directory path" }
  }

  try {
    const stat = await fs.stat(absolutePath)
    if (!stat.isDirectory()) {
      return { error: "Directory not found" }
    }
  } catch {
    return { error: "Directory not found" }
  }

  const files = await fs.readdir(absolutePath)
  const images = files
    .filter((file) => {
      const ext = path.extname(file).toLowerCase()
      return IMAGE_EXTENSIONS.has(ext)
    })
    .sort()
    .map((file) => `/${sanitized}/${file}`.replace(/\/+/g, "/"))

  return { images }
}

/**
 * Lightweight check: returns only the version hash of the current S3 bucket
 * contents. The client compares this against its localStorage cache to decide
 * whether a full image fetch is needed.
 *
 * Uses the server-side in-memory cache, so most calls cost 0 S3 operations.
 */
export async function checkS3BucketVersion(): Promise<{
  version?: string
  error?: string
}> {
  try {
    const listing = await getS3Listing()
    if ("error" in listing) return { error: listing.error }
    return { version: listing.version }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to check S3 bucket version" }
  }
}

/**
 * Returns presigned URLs for all images in the S3 bucket, plus a version
 * hash the client can use for localStorage cache invalidation.
 */
export async function getImagesFromS3(): Promise<{
  images?: string[]
  version?: string
  error?: string
}> {
  try {
    const listing = await getS3Listing()
    if ("error" in listing) return { error: listing.error }

    const config = getS3Config()
    if ("error" in config) return { error: config.error }

    const client = new S3Client({
      region: "auto",
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    })

    // Generate presigned URLs (valid for 1 hour) in batches to avoid
    // overwhelming the S3 endpoint when the bucket contains many objects.
    const BATCH_SIZE = 50
    const images: string[] = []
    for (let i = 0; i < listing.keys.length; i += BATCH_SIZE) {
      const batch = listing.keys.slice(i, i + BATCH_SIZE)
      const urls = await Promise.all(
        batch.map((key) =>
          getSignedUrl(
            client,
            new GetObjectCommand({ Bucket: config.bucket, Key: key }),
            { expiresIn: 3600 }
          )
        )
      )
      images.push(...urls)
    }

    return { images, version: listing.version }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to list S3 images",
    }
  }
}
