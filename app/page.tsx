
import { WeddingWebsite } from "@/app/components/wedding";

export default function Page() {
return <WeddingWebsite
  heroImageSrc="/BothRings.png"
  coupleNames="Brittany & Christopher"
  heroImageAlt="Wedding Celebration Banner"
  showRegistry={true}
  whereIsTheWeddingTitle="Where's the Wedding?"
  whereIsTheWeddingContent="Brittany and Chris have decided to hold a small, intimate, family only wedding ceremony on November 7th, 2026. We would love for everyone else to come and join us for a celebration party the following day!"
  showWhereIsTheWedding={true}
  showStory={true}
  storyTitle="Our Story"
  storyContent="We met through a mutual friend at a Halloween Party, started dating shortly after. We both quicly realized we held the same values and life goals. The rest is history!"
  />;
}