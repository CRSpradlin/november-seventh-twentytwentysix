
import { cn } from "@/lib/utils"

interface WeddingSectionProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  containerClassName?: string
}

export function WeddingSection({
  title,
  subtitle,
  children,
  className,
  containerClassName,
}: WeddingSectionProps) {
  return (
    <section className={cn("w-full py-16 sm:py-20 md:py-24", className)}>
      <div
        className={cn(
          "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          containerClassName
        )}
      >
        {(title || subtitle) && (
          <div className="mb-12 text-center sm:mb-16">
            {subtitle && (
              <p className="mb-2 text-xs font-light tracking-[0.3em] text-muted-foreground uppercase sm:text-sm">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="font-serif text-3xl font-light tracking-wide sm:text-4xl md:text-5xl">
                {title}
              </h2>
            )}
            <div className="mx-auto mt-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-border sm:w-12" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="h-px w-8 bg-border sm:w-12" />
            </div>
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
