import HeroSection from '@/components/HeroSection';
import BlessQuote from '@/components/BlessQuote';
import EventDetails from '@/components/EventDetails';
import LoveStoryTimeline from '@/components/LoveStoryTimeline';
import PhotoGallery from '@/components/PhotoGallery';
import DigitalMemoryCard from '@/components/DigitalMemoryCard';
import Footer from '@/components/Footer';
import PhotoAlbums from '@/components/PhotoAlbums';

export default function HomePage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-linear-to-br from-[#f8f5f0] via-[#fef9f3] to-[#f5ebe0]">
      <HeroSection />
      <BlessQuote />
      <EventDetails />
      <LoveStoryTimeline />
      <PhotoGallery />
      <DigitalMemoryCard />
      <PhotoAlbums />
      <Footer />
    </main>
  );
}