"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { WeddingHero } from "./WeddingHero"
import { WeddingSection } from "./WeddingSection"
import { WeddingInfoCard } from "./WeddingInfoCard"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Calendar01Icon,
  Clock01Icon,
  Gif01Icon,
  Restaurant01Icon,
  MusicNote01Icon,
  FavouriteIcon,
  MailIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface WeddingWebsiteProps {
  // Hero section
  heroImageSrc: string
  heroImageAlt?: string
  coupleNames: string
  weddingDate: string
  
  // Event details
  ceremonyTime?: string
  ceremonyLocation?: string
  ceremonyAddress?: string
  
  receptionTime?: string
  receptionLocation?: string
  receptionAddress?: string
  
  // Optional sections
  showRsvp?: boolean
  showRegistry?: boolean
  showStory?: boolean
  
  // Story content
  storyTitle?: string
  storyContent?: string
  
  className?: string
}

export function WeddingWebsite({
  heroImageSrc,
  heroImageAlt = "Wedding rings",
  coupleNames,
  weddingDate,
  ceremonyTime = "3:00 PM",
  ceremonyLocation = "St. Mary's Chapel",
  ceremonyAddress = "123 Wedding Lane, Love City",
  receptionTime = "5:00 PM",
  receptionLocation = "Grand Ballroom",
  receptionAddress = "456 Celebration Ave, Love City",
  showRsvp = true,
  showRegistry = true,
  showStory = true,
  storyTitle = "Our Story",
  storyContent = "We met on a beautiful summer day and knew from that moment that we were meant to be together. After years of adventure, laughter, and love, we're excited to begin the next chapter of our lives together.",
  className,
}: WeddingWebsiteProps) {
  return (
    <div className={cn("min-h-screen w-full", className)}>
      {/* Hero Section */}
      <WeddingHero
        imageSrc={heroImageSrc}
        imageAlt={heroImageAlt}
        title={coupleNames}
        subtitle="Together with their families"
        date={weddingDate}
        overlayOpacity="darker"
      />

      {/* Event Details Section */}
      <WeddingSection
        title="Celebration Details"
        subtitle="Join us on our special day"
        className="bg-background"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <WeddingInfoCard
            icon={Calendar01Icon}
            title="The Date"
            description={weddingDate}
          >
            <p>Save the date and celebrate with us</p>
          </WeddingInfoCard>

          <WeddingInfoCard
            icon={Clock01Icon}
            title="Ceremony"
            description={ceremonyTime}
          >
            <p>{ceremonyLocation}</p>
            <p className="mt-1 text-xs">{ceremonyAddress}</p>
          </WeddingInfoCard>

          <WeddingInfoCard
            icon={Restaurant01Icon}
            title="Reception"
            description={receptionTime}
          >
            <p>{receptionLocation}</p>
            <p className="mt-1 text-xs">{receptionAddress}</p>
          </WeddingInfoCard>

          <WeddingInfoCard
            icon={MusicNote01Icon}
            title="Celebration"
            description="Dinner & Dancing"
          >
            <p>Enjoy an evening of joy and memories</p>
          </WeddingInfoCard>
        </div>
      </WeddingSection>

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

      {/* Registry Section */}
      {showRegistry && (
        <WeddingSection
          title="Gift Registry"
          subtitle="Your presence is our present"
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
                  Registry Information
                </CardTitle>
                <CardDescription>
                  Your love and support mean everything to us. If you wish to
                  honor us with a gift, we&apos;ve registered at the following
                  places.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button variant="outline">View Registry 1</Button>
                  <Button variant="outline">View Registry 2</Button>
                </div>
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
            <p className="font-serif text-2xl font-light tracking-wide">
              {coupleNames}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{weddingDate}</p>
            <p className="mt-4 text-xs text-muted-foreground">
              Made with love 💕
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
