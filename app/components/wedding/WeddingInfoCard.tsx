
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"

interface WeddingInfoCardProps {
  icon?: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function WeddingInfoCard({
  icon,
  title,
  description,
  children,
  className,
}: WeddingInfoCardProps) {
  return (
    <Card
      className={cn(
        "group transition-all duration-300 hover:shadow-lg",
        className
      )}
    >
      <CardHeader className="items-center text-center text-lg sm:text-xl">
        {icon && (
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
            <HugeiconsIcon icon={icon} strokeWidth={1.5} className="h-6 w-6" />
          </div>
        )}
        <CardTitle className="font-serif font-normal tracking-wide text-lg sm:text-xl">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-center text-lg sm:text-xl">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      {children && (
        <CardContent className="text-center text-muted-foreground text-lg sm:text-xl">
          {children}
        </CardContent>
      )}
    </Card>
  )
}
