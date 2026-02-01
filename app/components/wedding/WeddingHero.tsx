"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { WeddingLoadingIndicator } from "./WeddingLoadingIndicator"

interface WeddingHeroProps {
  imageSrc: string
  imageAlt?: string
  title: string
  subtitle?: string
  className?: string
  overlayOpacity?: "light" | "medium" | "dark" | "darker"
}

export function WeddingHero({
  imageSrc,
  imageAlt = "Wedding rings",
  title,
  subtitle,
  className,
  overlayOpacity = "medium",
}: WeddingHeroProps) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)

  const overlayClasses = {
    light: "from-black/20 via-black/10 to-black/40",
    medium: "from-black/30 via-black/20 to-black/60",
    dark: "from-black/40 via-black/30 to-black/70",
    darker: "from-black/50 via-black/40 to-black/80",
  }

  return (
    <section
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden",
        className
      )}
    >
      {/* Background image container */}
      <div className="absolute inset-0 z-0">
        {/* Loading state */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-linear-to-b from-stone-100 to-stone-200 dark:from-stone-900 dark:to-stone-800">
            <WeddingLoadingIndicator
              size="lg"
              message="Preparing something beautiful..."
            />
          </div>
        )}

        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-linear-to-b from-stone-100 to-stone-200 dark:from-stone-900 dark:to-stone-800">
            <div className="text-center">
              <p className="text-muted-foreground">Unable to load image</p>
            </div>
          </div>
        )}

        {/* Background image */}
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          loading="eager"
          priority={false}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
          className={cn(
            "object-cover transition-opacity duration-1000",
            isLoading || hasError ? "opacity-0" : "opacity-100"
          )}
        />

        {/* Overlay gradient */}
        <div
          className={cn(
            "absolute inset-0 bg-linear-to-b",
            overlayClasses[overlayOpacity]
          )}
        />
      </div>

      {/* Content */}
      <div
        className={cn(
          "relative z-10 flex flex-col items-center justify-center gap-4 px-4 text-center text-white transition-opacity duration-1000 sm:gap-6",
          isLoading ? "opacity-0" : "opacity-100"
        )}
      >
        {subtitle && (
          <p className="font-bold tracking-[0.3em] text-white/80 text-xs sm:text-sm uppercase">
            {subtitle}
          </p>
        )}

        <h1 className="font-serif text-4xl font-light tracking-wide sm:text-5xl md:text-6xl lg:text-7xl">
          {title}
        </h1>
      </div>

      {/* Scroll indicator */}
      <div
        className={cn(
          "absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-1000",
          isLoading ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-light tracking-widest text-white/70 uppercase">
            Scroll
          </span>
          <div className="h-10 w-6 rounded-full border-2 border-white/50 p-1">
            <div className="mx-auto h-2 w-1 animate-bounce rounded-full bg-white/80" />
          </div>
        </div>
      </div>
    </section>
  )
}
