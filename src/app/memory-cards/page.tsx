'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowLeft, Heart, X } from 'lucide-react';
import Link from 'next/link';

interface GuestCard {
  id: string;
  serialNumber: number;
  name: string;
  message: string;
  photo?: string; // Made optional
  timestamp: Date;
}

// Mock data - In production, this would come from your backend/database
const mockCards: GuestCard[] = [
  {
    id: '1',
    serialNumber: 1,
    name: 'Sarah & John',
    message: 'Wishing you a lifetime of love and happiness! Congratulations on your special day.',
    photo: '/images/wedding-couple5.png',
    timestamp: new Date(),
  },
  {
    id: '2',
    serialNumber: 2,
    name: 'Emily Rodriguez',
    message: 'May your love story be filled with beautiful moments and endless joy. Congratulations!',
    timestamp: new Date(),
  },
  {
    id: '3',
    serialNumber: 3,
    name: 'Michael Chen',
    message: 'Here\'s to love, laughter, and happily ever after! So happy for you both.',
    photo: '/images/wedding-couple5.png',
    timestamp: new Date(),
  },
  {
    id: '4',
    serialNumber: 4,
    name: 'David & Lisa',
    message: 'Wishing you endless love and cherished memories together. Congratulations on your wedding!',
    timestamp: new Date(),
  },
  // Add more mock cards here for testing
];

export default function AllMemoryCardsPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [cards] = useState<GuestCard[]>(mockCards);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-linear-to-br from-[#f8f5f0] via-[#fef9f3] to-[#f5ebe0]">
      <section className="min-h-screen w-full bg-linear-to-br from-[#f5f1e8] to-[#faf8f3] px-4 py-4">
        <div ref={ref} className="mx-auto max-w-7xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-1.5 font-cormorant text-base font-semibold text-[#3a3a3a] shadow-lg transition-all hover:shadow-xl"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Home
              </motion.button>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="mb-8 sm:mb-12 text-center"
          >
            <h1 className="font-playfair mb-2 sm:mb-3 lg:mb-4 text-4xl font-bold text-[#3a3a3a] sm:text-5xl md:text-6xl lg:text-7xl">
              All Memory Cards
            </h1>
            <div className="mx-auto h-0.5 lg:h-1 w-40 sm:w-48 lg:w-60 bg-linear-to-r from-transparent via-[#d4a5a5] to-transparent mb-1 rounded-full" />
            <p className="font-script text-xl text-[#3a3a3a]/70 sm:text-2xl lg:text-3xl max-w-2xl mx-auto">
              All the beautiful wishes from our loved ones
            </p>
          </motion.div>

          {/* Memory Cards Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid gap-4 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {cards.map((card, index) => (
              <MemoryCardDisplay
                key={card.id}
                card={card}
                index={index}
                onPhotoClick={setLightboxImage}
              />
            ))}
          </motion.div>

          {/* Empty State */}
          {cards.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <Heart className="h-16 w-16 mx-auto mb-4 text-[#d4a5a5]/30" />
              <p className="font-cormorant text-2xl text-[#3a3a3a]/60">
                No memory cards yet. Be the first to leave a wish!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Image Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage}
              alt="Full size"
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            />
          </motion.div>
        </div>
      )}
    </main>
  );
}

function MemoryCardDisplay({
  card,
  index,
  onPhotoClick,
}: {
  card: GuestCard;
  index: number;
  onPhotoClick: (photo: string) => void;
}) {
  // Extract initials from name for cards without photos
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative"
    >
      <div className="overflow-hidden rounded-lg bg-white shadow-lg transition-shadow hover:shadow-xl">
        {card.photo ? (
          // Card with Photo - Image at Top
          <>
            <div
              className="relative h-48 w-full overflow-hidden bg-linear-to-br from-[#9caf88]/10 to-[#d4a5a5]/10 cursor-pointer"
              onClick={() => onPhotoClick(card.photo!)}
            >
              <img
                src={card.photo}
                alt={card.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              {/* Overlay hint on hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20">
                <div className="scale-0 rounded-full bg-white/90 p-3 transition-transform group-hover:scale-100">
                  <svg
                    className="h-6 w-6 text-[#3a3a3a]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-3">
                <p className="font-playfair text-lg font-semibold text-[#3a3a3a]">{card.name}</p>
                <p className="font-cormorant text-sm text-[#3a3a3a]/60">
                  {card.timestamp.toLocaleDateString()}
                </p>
              </div>
              <p className="font-cormorant text-base leading-relaxed text-[#3a3a3a]/80">
                {card.message}
              </p>
            </div>
          </>
        ) : (
          // Card without Photo - Elegant Design with Initials
          <div className="p-6">
            {/* Header with Initials Avatar */}
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#d4a5a5] to-[#b88989] shadow-md">
                <span className="font-playfair text-2xl font-bold text-white">
                  {getInitials(card.name)}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-playfair text-lg font-semibold text-[#3a3a3a]">{card.name}</p>
                <p className="font-cormorant text-sm text-[#3a3a3a]/60">
                  {card.timestamp.toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="mb-4 h-px bg-linear-to-r from-transparent via-[#d4a5a5]/30 to-transparent" />

            {/* Message with Quote Styling */}
            <div className="relative">
              <Heart className="absolute -left-1 -top-1 h-6 w-6 text-[#d4a5a5]/20" />
              <p className="font-cormorant pl-6 text-base leading-relaxed text-[#3a3a3a]/80 italic">
                "{card.message}"
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}