"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { getImagesFromDirectory, getImagesFromS3, checkS3BucketVersion } from "@/app/backend/images"
import { Button } from "./button"

const S3_CACHE_KEY = "s3-image-carousel-cache"
const S3_CLIENT_CACHE_TTL = 50 * 60 * 1000 // 50 minutes (presigned URLs expire after 60)

interface S3ClientCache {
  version: string
  images: string[]
  timestamp: number
}

function getS3ClientCache(): S3ClientCache | null {
  try {
    const raw = localStorage.getItem(S3_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.version && Array.isArray(parsed?.images) && parsed?.timestamp) {
      // Expire the client cache before presigned URLs become invalid
      if (Date.now() - parsed.timestamp > S3_CLIENT_CACHE_TTL) return null
      return parsed
    }
    return null
  } catch {
    return null
  }
}

function setS3ClientCache(cache: S3ClientCache) {
  try {
    localStorage.setItem(S3_CACHE_KEY, JSON.stringify(cache))
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

interface ImageCarouselProps extends React.ComponentProps<"div"> {
  /** Path to a directory inside /public (e.g. "photos" for /public/photos) */
  directory?: string
  /** Whether to pull images from S3 instead of a local directory (default: false) */
  s3?: boolean
  /** Alt text prefix for each image (index is appended) */
  altPrefix?: string
  /** Whether to autoplay the carousel */
  autoPlay?: boolean
  /** Autoplay interval in ms (default: 5000) */
  autoPlayInterval?: number
}

function useResponsiveHeight(mobileHeight: number, desktopHeight: number): number {
  const [height, setHeight] = React.useState(desktopHeight)

  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)")
    const update = (e: MediaQueryList | MediaQueryListEvent) =>
      setHeight(e.matches ? mobileHeight : desktopHeight)
    update(mql)
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [mobileHeight, desktopHeight])

  return height
}

function ImageCarousel({
  directory,
  s3 = false,
  altPrefix = "Image",
  autoPlay = false,
  autoPlayInterval = 5000,
  className,
  ...props
}: ImageCarouselProps) {
  const height = useResponsiveHeight(600, 800)
  const [images, setImages] = React.useState<string[]>([])
  const [current, setCurrent] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [autoPlayActive, setAutoPlayActive] = React.useState(autoPlay)

  // Sync autoPlay prop -> internal state when prop changes
  React.useEffect(() => {
    setAutoPlayActive(autoPlay)
  }, [autoPlay])

  React.useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true)
        setError(null)

        if (s3) {
          // 1. Check if browser has a cached version
          const clientCache = getS3ClientCache()

          // 2. Ask the server for the current bucket version (lightweight,
          //    usually served from the server's in-memory cache — 0 S3 ops)
          const versionResult = await checkS3BucketVersion()
          if (versionResult.error) {
            throw new Error(versionResult.error)
          }

          // 3. If versions match, use the client cache (0 S3 ops total)
          if (clientCache && clientCache.version === versionResult.version) {
            setImages(clientCache.images)
            return
          }

          // 4. Versions differ or no cache — fetch the full listing
          //    (1 Class A ListObjectsV2 if server cache expired, else 0)
          const result = await getImagesFromS3()
          if (result.error) throw new Error(result.error)

          const fetched = result.images ?? []
          setImages(fetched)

          // 5. Save to client cache for next visit
          if (result.version) {
            setS3ClientCache({ version: result.version, images: fetched, timestamp: Date.now() })
          }
        } else if (directory) {
          const result = await getImagesFromDirectory(directory)
          if (result.error) throw new Error(result.error)
          setImages(result.images ?? [])
        } else {
          throw new Error("Either 'directory' or 's3' prop must be provided")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load images")
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, [directory, s3])

  React.useEffect(() => {
    if (!autoPlayActive || images.length <= 1) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, autoPlayInterval)
    return () => clearInterval(interval)
  }, [autoPlayActive, autoPlayInterval, images.length])

  const goToPrevious = React.useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const goToNext = React.useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length)
  }, [images.length])

  if (loading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl max-w-4xl bg-muted",
          className
        )}
        style={{ height }}
        {...props}
      >
        <span className="text-muted-foreground text-sm animate-pulse">
          Loading images…
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl max-w-4xl bg-muted",
          className
        )}
        style={{ height }}
        {...props}
      >
        <span className="text-destructive text-sm">{error}</span>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl max-w-4xl bg-muted",
          className
        )}
        style={{ height }}
        {...props}
      >
        <span className="text-muted-foreground text-sm">No images found</span>
      </div>
    )
  }

  return (
    <div
      data-slot="image-carousel"
      className={cn("relative group select-none max-w-4xl", className)}
       style={{ height }}
      {...props}
    >
      {/* Current Image — only render current ± 1 for lazy loading */}
      <div className="relative w-full h-full overflow-hidden rounded-xl bg-muted">
        {images.map((src, index) => {
          const distance = Math.min(
            Math.abs(index - current),
            images.length - Math.abs(index - current)
          )
          // Only mount the current image and its immediate neighbors
          if (distance > 1) return null

          return (
            <div
              key={src}
              className={cn(
                "absolute inset-0 max-w-4xl transition-all duration-2000 ease-in-out",
                index === current ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <Image
                src={src}
                alt={`${altPrefix} ${index + 1}`}
                fill
                className="object-contain brightness-75 p-5 pb-[50px]"
                priority={index === current}
                loading={index === current ? "eager" : "lazy"}
                unoptimized
              />
            </div>
          )
        })}
      </div>

      {/* Previous Button */}
      {images.length > 1 && (
        <Button
          onClick={() => {
            setAutoPlayActive(false)
            goToPrevious()
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label="Previous image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Button>
      )}

      {/* Next Button */}
      {images.length > 1 && (
        <Button
          onClick={() => {
            setAutoPlayActive(false)
            goToNext()
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label="Next image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Button>
      )}

      {/* Page Numbers */}
      {images.length > 1 && (() => {
        const total = images.length
        let pages: (number | "ellipsis-start" | "ellipsis-end")[]

        if (total <= 7) {
          pages = Array.from({ length: total }, (_, i) => i)
        } else {
          const pagesSet = new Set<number>()
          pagesSet.add(0)
          pagesSet.add(total - 1)
          for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) {
            pagesSet.add(i)
          }
          const sorted = Array.from(pagesSet).sort((a, b) => a - b)
          pages = []
          for (let i = 0; i < sorted.length; i++) {
            if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
              pages.push(i === 1 ? "ellipsis-start" : "ellipsis-end")
            }
            pages.push(sorted[i])
          }
        }

        return (
          <div className="absolute max-w-4xl bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/70 rounded-md px-1 py-1">
            {pages.map((page) =>
              page === "ellipsis-start" || page === "ellipsis-end" ? (
                <span
                  key={page}
                  className="text-muted-foreground text-xs px-1 select-none"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => {
                    setAutoPlayActive(false)
                    setCurrent(page)
                  }}
                  className={cn(
                    "min-w-[3rem] h-6 rounded text-xs font-medium transition-colors duration-150 cursor-pointer",
                    page === current
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                  aria-label={`Go to image ${page + 1}`}
                >
                  {page + 1}
                </button>
              )
            )}
          </div>
        )
      })()}
    </div>
  )
}

export { ImageCarousel }
export type { ImageCarouselProps }
