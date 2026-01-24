import { WeddingWebsite } from "@/components/wedding";

export default function Page() {
return <WeddingWebsite
  heroImageSrc="/BothRings.png"
  coupleNames="Brittany & Christopher"

  celebrationDate="November 8th, 2026"
  celebrationTime="4:00 PM"
  celebrationLocation="St. Mary's Chapel"
  celebrationAddress="123 Wedding Lane"

  heroImageAlt="Wedding Celebration Banner"

  // receptionTime = "5:00 PM",
  // receptionLocation = "Grand Ballroom",
  // receptionAddress = "456 Celebration Ave, Love City",
  showRsvp={true}
  showCelebration={true}
  showRegistry={true}
  whereIsTheWeddingTitle="Where's the Wedding?"
  whereIsTheWeddingContent="Brittany and Chris have decided to hold a small, intimate, family only wedding ceremony on November 7th, 2026. We would love for everyone else to come and join us for a celebration party the following day!"
  showWhereIsTheWedding={true}
  showStory={true}

  storyTitle="Our Story"
  storyContent="We met through a mutual friend at a Halloween Party, started dating shortly after. We both quicly realized we held the same values and life goals. The rest is history!"
  
  className=""     />;
}