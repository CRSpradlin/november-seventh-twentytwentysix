import { Calendar01Icon, Clock01Icon } from "@hugeicons/core-free-icons"
import { WeddingSection } from "./WeddingSection"
import { WeddingInfoCard } from "./WeddingInfoCard"
import { getInvitationByCode } from "@/app/backend/db"
import { cn } from "@/lib/utils"
import { getInvitationCodeCookie } from "@/app/backend/cookies"

export async function WeddingCelebrationDetails() {
    // Retrieve invitation code from cookies
    const invitationCode = await getInvitationCodeCookie(); // Placeholder for cookie retrieval logic

    const celebrationDate = "November 8th, 2026";
    const celebrationTime = "4:00 PM";
    const celebrationLocation = "St. Mary's Chapel";
    const celebrationAddress = "123 Wedding Lane";
    
    // const receptionTime = "";
    // const receptionLocation = "";
    // const receptionAddress = "";

    let invitation = null;

    if (invitationCode) {
        invitation = await getInvitationByCode(invitationCode);
    }

    const isBlurred = !invitation;

return (
 
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
                    >
                        <p>Save the date and celebrate with us</p>
                    </WeddingInfoCard>
                </div>

                <div className={cn("h-full", isBlurred && "blur-md select-none pointer-events-none")}>
                    <WeddingInfoCard
                        icon={Clock01Icon}
                        title="Celebration Time & Location"
                        description={celebrationTime}
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
                    </div>
                </div>
            )}
        </div>
    </WeddingSection>
    );
}