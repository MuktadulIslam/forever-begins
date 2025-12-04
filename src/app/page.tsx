import HeroSection from '@/components/HeroSection';
import BlessQuote from '@/components/BlessQuote';
import EventDetails from '@/components/EventDetails';
import LoveStoryTimeline from '@/components/LoveStoryTimeline';
import LiveLens from '@/components/LiveLens';
import DigitalMemoryCard from '@/components/DigitalMemoryCard';
import DuaBox from '@/components/DuaBox';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <HeroSection />
      <BlessQuote />
      <EventDetails />
      <LoveStoryTimeline />
      <LiveLens />
      <DigitalMemoryCard />
      <DuaBox />
      <Footer />
    </main>
  );
}