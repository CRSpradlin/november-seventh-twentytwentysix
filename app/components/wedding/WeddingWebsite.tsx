
import { cn } from "@/lib/utils"
import { WeddingHero } from "./WeddingHero"
import { WeddingSection } from "./WeddingSection"
import { WeddingInfoCard } from "./WeddingInfoCard"
import { Button } from "@/app/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Separator } from "@/app/components/ui/separator"
import {
  Gif01Icon,
  FavouriteIcon,
  MailIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { WeddingCelebrationDetails } from "./WeddingCelebrationDetails"

interface WeddingWebsiteProps {
  // Hero section
  heroImageSrc: string
  heroImageAlt?: string
  coupleNames: string
  // celebrationDate: string
  
  // // Event details
  // celebrationTime: string
  // celebrationLocation: string
  // celebrationAddress: string
  
  // receptionTime: string
  // receptionLocation: string
  // receptionAddress: string
  
  // Optional sections
  showCelebration: boolean
  showRsvp: boolean
  showRegistry: boolean
  showStory: boolean
  showWhereIsTheWedding: boolean

  // Story content
  storyTitle: string
  storyContent: string

  // Where's the Wedding content
  whereIsTheWeddingTitle: string
  whereIsTheWeddingContent: string
  
  className?: string
}

export function WeddingWebsite({
  heroImageSrc,
  heroImageAlt = "Wedding Celebration Banner",
  coupleNames = "Mr & Mrs",
  // celebrationDate,
  // celebrationTime = "UPDATE CELEBRATION TIME",
  // celebrationLocation = "UPDATE CELEBRATION LOCATION",
  // celebrationAddress = "UPDATE CELEBRATION ADDRESS",
  // receptionTime = "5:00 PM",
  // receptionLocation = "Grand Ballroom",
  // receptionAddress = "456 Celebration Ave, Love City",
  showRsvp = true,

  showRegistry = true,
  whereIsTheWeddingTitle = "UPDATE WHERE IS THE WEDDING TITLE",
  whereIsTheWeddingContent = "UPDATE WHERE IS THEWEDDING CONTENT",
  showWhereIsTheWedding = true,

  showStory = true,

  storyTitle = "UPDATE STORY TITLE",
  storyContent = "UPDATE STORY CONTENT",
  className,
}: WeddingWebsiteProps) {
  return (
    <div className={cn("min-h-screen w-full", className)}>
      {/* Hero Section */}
      <WeddingHero
        imageSrc={heroImageSrc}
        imageAlt={heroImageAlt}
        title={coupleNames}
        subtitle="Celebrate With Us"
        overlayOpacity="darker"
      />

      {/* Our Story Section */}
      {showStory && (
        <WeddingSection
          title={storyTitle}
          subtitle="How it all began"
          className="bg-muted/30"
        >
          <div className="mx-auto max-w-3xl">
            <Card className="border-none bg-transparent shadow-none">
              <CardContent className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <HugeiconsIcon
                      icon={FavouriteIcon}
                      strokeWidth={1.5}
                      className="h-8 w-8 text-primary"
                    />
                  </div>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  {storyContent}
                </p>
              </CardContent>
            </Card>
          </div>
        </WeddingSection>
      )}

      {/* Registry Section */}
      {showRegistry && (
        <WeddingSection
          title="Gift Registry"
          subtitle="What about the dogs?"
          className="bg-muted/30"
        >
          <div className="mx-auto max-w-2xl text-center">
            <Card>
              <CardHeader>
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <HugeiconsIcon
                    icon={Gif01Icon}
                    strokeWidth={1.5}
                    className="h-6 w-6 text-primary"
                  />
                </div>
                <CardTitle className="font-serif text-xl font-normal">
                  Winnie & Ari Fund
                </CardTitle>
                <CardDescription>
                  Accoring to Chris&apos;s mother, we already have too much stuff. Instead of a normal registry we are asking
                  for contributions to our Winnie & Ari Fund so that they can help celebrate with us through
                  treats, toys and adventures!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button variant="outline">Submit a Contribution!</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </WeddingSection>
      )}

      {/* Where's the Wedding Section */}
      {showWhereIsTheWedding && (
        <WeddingSection
          title={whereIsTheWeddingTitle}
          subtitle="A Celebration Party"
          className="bg-muted/30"
        >
          <div className="mx-auto max-w-3xl">
            <Card className="border-none bg-transparent shadow-none">
              <CardContent className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <HugeiconsIcon
                      icon={FavouriteIcon}
                      strokeWidth={1.5}
                      className="h-8 w-8 text-primary"
                    />
                  </div>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  {whereIsTheWeddingContent}
                </p>
              </CardContent>
            </Card>
          </div>
        </WeddingSection>
      )}

      <WeddingCelebrationDetails/>



      {/* RSVP Section */}
      {showRsvp && (
        <WeddingSection
          title="RSVP"
          subtitle="We hope you can make it"
          className="bg-background"
        >
          <div className="mx-auto max-w-md text-center">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl font-normal">
                  Kindly Respond
                </CardTitle>
                <CardDescription>
                  Please let us know if you&apos;ll be joining us by clicking
                  the button below
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <Button size="lg" className="w-full sm:w-auto">
                  <HugeiconsIcon
                    icon={MailIcon}
                    strokeWidth={2}
                    data-icon="inline-start"
                  />
                  RSVP Now
                </Button>
                <p className="text-xs text-muted-foreground">
                  Please respond by November 1st, 2026
                </p>
              </CardContent>
            </Card>
          </div>
        </WeddingSection>
      )}

      {/* Footer */}
      <footer className="bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Separator className="mb-8" />
          <div className="text-center">
            <p className="mt-4 text-xs text-muted-foreground">
              Made with love for my wife 💕 - Chris
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
