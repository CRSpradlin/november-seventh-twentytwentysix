import { Calendar01Icon, Clock01Icon } from "@hugeicons/core-free-icons"
import { WeddingSection } from "./WeddingSection"
import { WeddingInfoCard } from "./WeddingInfoCard"
import { getInvitationByCode } from "@/app/backend/db"

type WeddingCelebrationDetailsProps = {

    invitationCode?: string

    // celebrationDate: string
    // celebrationTime: string
    // celebrationLocation: string
    // celebrationAddress: string

    // receptionTime: string
    // receptionLocation: string
    // receptionAddress: string
}

export async function WeddingCelebrationDetails({
    invitationCode,
} : WeddingCelebrationDetailsProps) {

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

return (
 
    <WeddingSection
        title="Celebration Details"
        subtitle="Join us to celebrate our recent marriage"
        className="bg-background"
    >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <WeddingInfoCard
            icon={Calendar01Icon}
            title="Celebration Date"
            description={celebrationDate}
        >
            <p>Save the date and celebrate with us</p>
        </WeddingInfoCard>

        <WeddingInfoCard
            icon={Clock01Icon}
            title="Celebration Time & Location"
            description={celebrationTime}
        >
            <p>{celebrationLocation}</p>
            <p className="mt-1 text-xs">{celebrationAddress}</p>
        </WeddingInfoCard>

        {/* <WeddingInfoCard
            icon={Restaurant01Icon}
            title="Reception"
            description={receptionTime}
        >
            <p>{receptionLocation}</p>
            <p className="mt-1 text-xs">{receptionAddress}</p>
        </WeddingInfoCard> */}

        {/* <WeddingInfoCard
            icon={MusicNote01Icon}
            title="Celebration"
            description="Dinner & Dancing"
        >
            <p>Enjoy an evening of joy and memories</p>
        </WeddingInfoCard> */}
        </div>
    </WeddingSection>
    );
}