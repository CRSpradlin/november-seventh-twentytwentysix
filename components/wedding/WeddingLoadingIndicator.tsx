"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface WeddingLoadingIndicatorProps {
  size?: "sm" | "md" | "lg"
  className?: string
  message?: string
}

export function WeddingLoadingIndicator({
  size = "md",
  className,
  message = "Loading...",
}: WeddingLoadingIndicatorProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
  }

  const ringSize = {
    sm: 20,
    md: 32,
    lg: 52,
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      <div className={cn("relative", sizeClasses[size])}>
        {/* Left ring */}
        <svg
          className="absolute left-0 top-1/2 -translate-y-1/2 animate-pulse"
          width={ringSize[size]}
          height={ringSize[size]}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="url(#goldGradientLeft)"
            strokeWidth="4"
            className="animate-[spin_3s_linear_infinite]"
            style={{ transformOrigin: "center" }}
          />
          <circle
            cx="20"
            cy="20"
            r="12"
            stroke="url(#goldGradientLeft)"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <defs>
            <linearGradient
              id="goldGradientLeft"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#F5E6A3" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
          </defs>
        </svg>

        {/* Right ring (interlocked) */}
        <svg
          className="absolute right-0 top-1/2 -translate-y-1/2 animate-pulse"
          style={{ animationDelay: "150ms" }}
          width={ringSize[size]}
          height={ringSize[size]}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="url(#goldGradientRight)"
            strokeWidth="4"
            className="animate-[spin_3s_linear_infinite_reverse]"
            style={{ transformOrigin: "center" }}
          />
          <circle
            cx="20"
            cy="20"
            r="12"
            stroke="url(#goldGradientRight)"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <defs>
            <linearGradient
              id="goldGradientRight"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#C0C0C0" />
              <stop offset="50%" stopColor="#E8E8E8" />
              <stop offset="100%" stopColor="#A9A9A9" />
            </linearGradient>
          </defs>
        </svg>

        {/* Sparkle effects */}
        <div className="absolute inset-0">
          <div
            className="absolute left-1/4 top-0 h-1 w-1 animate-ping rounded-full bg-amber-300"
            style={{ animationDuration: "1.5s" }}
          />
          <div
            className="absolute right-1/4 bottom-0 h-1 w-1 animate-ping rounded-full bg-gray-300"
            style={{ animationDuration: "2s", animationDelay: "0.5s" }}
          />
          <div
            className="absolute left-0 top-1/2 h-1 w-1 animate-ping rounded-full bg-amber-200"
            style={{ animationDuration: "1.8s", animationDelay: "0.3s" }}
          />
        </div>
      </div>

      {message && (
        <p className="animate-pulse text-sm font-light tracking-widest text-muted-foreground uppercase">
          {message}
        </p>
      )}
    </div>
  )
}
