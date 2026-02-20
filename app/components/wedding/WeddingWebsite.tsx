
import { cn } from "@/lib/utils"
import { WeddingHero } from "./WeddingHero"
import { WeddingSection } from "./WeddingSection"
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
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog"
import {
  FavouriteIcon,
  PumpkinIcon,
  GiftIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { WeddingCelebrationDetails } from "./WeddingCelebrationDetails"
import { getInvitationByCode } from "@/app/backend/db"
import { getInvitationCodeCookie } from "@/app/backend/cookies"
import { ImageCarousel } from "../ui/image-carousel"

interface WeddingWebsiteProps {
  // Hero section
  heroImageSrc: string
  heroImageAlt?: string
  coupleNames: string

  // Optional sections
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

export async function WeddingWebsite({
  heroImageSrc,
  heroImageAlt = "Wedding Celebration Banner",
  coupleNames = "Mr & Mrs",

  showRegistry = true,
  whereIsTheWeddingTitle = "UPDATE WHERE IS THE WEDDING TITLE",
  whereIsTheWeddingContent = "UPDATE WHERE IS THE WEDDING CONTENT",
  showWhereIsTheWedding = true,

  showStory = true,

  storyTitle = "UPDATE STORY TITLE",
  storyContent = "UPDATE STORY CONTENT",
  className,
}: WeddingWebsiteProps) {

  const invitationCode = await getInvitationCodeCookie(); // Placeholder for cookie retrieval logic

  let invitation = null;

  if (invitationCode) {
      invitation = await getInvitationByCode(invitationCode);
  }

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

      {invitation && <WeddingCelebrationDetails />}

      {/* Our Story Section */}
      {showStory && (
        <WeddingSection
          title={storyTitle}
          subtitle="How it all began"
          className="bg-muted/30"
        >
          <div className="mx-auto max-w-4xl">
            <Card className="border-none bg-transparent shadow-none">
              <CardContent className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <HugeiconsIcon
                      icon={PumpkinIcon}
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
          <ImageCarousel s3 autoPlay autoPlayInterval={5000} className="mx-auto mt-6"/>
        </WeddingSection>
      )}

      {/* Registry Section */}
      {showRegistry && (
        <WeddingSection
          title="Gift Registry"
          subtitle="What about the dogs?"
          className="bg-muted/30"
        >
          <div className="mx-auto max-w-4xl text-center">
            <Card className="border-none bg-transparent shadow-none">
              <CardHeader>
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <HugeiconsIcon
                    icon={GiftIcon}
                    strokeWidth={1.5}
                    className="h-6 w-6 text-primary"
                  />
                </div>
                <CardTitle className="font-serif text-xl font-normal">
                  Winnie & Ari Fund
                </CardTitle>
                <CardDescription className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  Accoring to Chris&apos;s mother, we already have too much stuff. Instead of a normal registry we are asking
                  for contributions to our Winnie & Ari Fund so that they can help celebrate with us through
                  treats, toys and adventures!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="default">Submit a Contribution!</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Winnie & Ari Fund</AlertDialogTitle>
                        <AlertDialogDescription>
                          Choose your preferred way to contribute to the Winnie & Ari Fund.
                          Every contribution goes towards treats, toys, and adventures for our pups!
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="flex flex-col gap-3">
                        <Button asChild variant="ghost" className="w-full border-none bg-[#008CFF]! text-white! hover:bg-[#0074D4]! hover:text-white!">
                          <a href={process.env.NEXT_PUBLIC_VENMO_URL} target="_blank" rel="noopener noreferrer">
                            <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5 fill-current" aria-hidden="true">
                              <path d="M19.107 0c.96 1.584 1.393 3.216 1.393 5.28 0 6.576-5.617 15.12-10.177 21.12H3.22L0 1.536 6.577.96l1.824 14.64C10.233 12.48 12.41 7.824 12.41 4.8c0-1.968-.336-3.312-.912-4.368L19.107 0Z" />
                            </svg>
                            Venmo
                          </a>
                        </Button>
                        <Button asChild variant="ghost" className="w-full border-none bg-[#0070BA] text-white hover:bg-[#005C99] hover:text-white">
                          <a href={process.env.NEXT_PUBLIC_PAYPAL_URL} target="_blank" rel="noopener noreferrer">
                            <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5 fill-current" aria-hidden="true">
                              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
                            </svg>
                            PayPal
                          </a>
                        </Button>
                        <Button variant="outline" className="w-full" disabled>
                          More options coming soon!
                        </Button>
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
          <div className="mx-auto max-w-4xl">
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

      {!invitation && <WeddingCelebrationDetails />}

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
