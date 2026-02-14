import { Calendar01Icon, Clock01Icon } from "@hugeicons/core-free-icons"
import { WeddingSection } from "./WeddingSection"
import { WeddingInfoCard } from "./WeddingInfoCard"
import { getInvitationByCode } from "@/app/backend/db"
import { cn } from "@/lib/utils"
import { getInvitationCodeCookie } from "@/app/backend/cookies"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"

import { WeddingInvitationCodeForm } from "./WeddingInvitationCodeForm"
import { WeddingRSVPButton } from "./WeddingRSVPButton"

export async function WeddingCelebrationDetails() {
    // Retrieve invitation code from cookies
    const invitationCode = await getInvitationCodeCookie(); // Placeholder for cookie retrieval logic

    let invitation = null;

    if (invitationCode) {
        invitation = await getInvitationByCode(invitationCode);
    }

    const celebrationDate = invitation ? process.env.NEXT_PUBLIC_CELEBRATION_DATE : "November -1 2026";
    const celebrationTime = invitation ? process.env.NEXT_PUBLIC_CELEBRATION_TIME : "1:00 AM";
    const celebrationLocation = invitation ? process.env.NEXT_PUBLIC_CELEBRATION_LOCATION_NAME : "Definitly A Real Place";
    const celebrationAddress = invitation ? process.env.NEXT_PUBLIC_CELEBRATION_LOCATION_ADDRESS : "1234 You Thought You Could Find Out Rd.";

    const isBlurred = !invitation;

return (<>
    <WeddingSection
        title="Celebration Details"
        subtitle="Join us to celebrate our recent marriage"
        className="bg-background"
    >
        <div className="relative">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                <div className={cn("h-full", isBlurred && "blur-md select-none pointer-events-none")}>
                    <WeddingInfoCard
                        icon={Calendar01Icon}
                        title="Celebration Date"
                        description={celebrationDate}
                        className="h-full"
                    >
                        <p>Save the Date!</p>
                    </WeddingInfoCard>
                </div>

                <div className={cn("h-full", isBlurred && "blur-md select-none pointer-events-none")}>
                    <WeddingInfoCard
                        icon={Clock01Icon}
                        title="Celebration Time & Location"
                        description={celebrationTime}
                        className="h-full"
                    >
                        <p>{celebrationLocation}</p>
                        <p className="mt-1 text-xs">{celebrationAddress}</p>
                    </WeddingInfoCard>
                </div>
            </div>
            
            {isBlurred && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-background/95 border rounded-lg p-6 max-w-md text-center shadow-lg">
                        <h3 className="text-lg font-semibold mb-2">Invitation Required</h3>
                        <p className="text-muted-foreground">
                            Please use the invitation code sent to you in the mail to view celebration details.
                        </p>
                        <WeddingInvitationCodeForm />
                    </div>
                </div>
            )}
        </div>
    </WeddingSection>

    <WeddingSection
        title="RSVP"
        subtitle="We hope you can make it"
        className={`bg-background ${isBlurred ? 'blur-md select-none pointer-events-none' : ''}`}
    >
        <div className="mx-auto max-w-md text-center">
        <Card>
            <CardHeader className="text-lg sm:text-xl">
            <CardTitle className="font-serif text-lg sm:text-xl font-normal">
                Kindly Respond
            </CardTitle>
            <CardDescription className="text-sm">
                Please let us know if you&apos;ll be joining us by clicking
                the button below
            </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 text-md">
            <WeddingRSVPButton />
            <p className="text-muted-foreground">
                Please respond by November 1st, 2026
            </p>
            </CardContent>
        </Card>
        </div>
    </WeddingSection>
    </>);
}