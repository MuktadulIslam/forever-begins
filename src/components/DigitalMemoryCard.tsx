'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Heart, Upload, X, Loader2, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface GuestCard {
  id: string;
  serialNumber: number;
  name: string;
  message: string;
  photo?: string; // Made optional
  timestamp: Date;
}

// Mock data with mixed cards (some with photos, some without)
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
  }
];

const CORRECT_PASSWORD = '123';
const MAX_CARDS_ON_HOME = 12;

export default function DigitalMemoryCard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showModal, setShowModal] = useState(false);
  const [cards, setCards] = useState<GuestCard[]>(mockCards);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lightbox state
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Form state
  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [guestPhoto, setGuestPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGuestPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestMessage || !password) return;

    // Validate password
    if (password !== CORRECT_PASSWORD) {
      setPasswordError('Incorrect password. Please try again.');
      return;
    }

    setPasswordError('');
    setIsSubmitting(true);

    // Simulate submission - Replace with actual backend
    setTimeout(() => {
      const newSerialNumber = cards.length + 1;
      const newCard: GuestCard = {
        id: Date.now().toString(),
        serialNumber: newSerialNumber,
        name: guestName,
        message: guestMessage,
        photo: photoPreview || undefined,
        timestamp: new Date(),
      };

      setCards([newCard, ...cards]);
      setIsSubmitting(false);
      setShowModal(false);
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setGuestName('');
    setGuestMessage('');
    setGuestPhoto(null);
    setPhotoPreview(null);
    setPassword('');
    setPasswordError('');
  };

  // Display only first 12 cards on home page
  const displayedCards = cards.slice(0, MAX_CARDS_ON_HOME);
  const hasMoreCards = cards.length > MAX_CARDS_ON_HOME;

  return (
    <section className="min-h-screen w-full bg-linear-to-br from-[#f5f1e8] to-[#faf8f3] px-4 py-4 sm:py-6 md:py-10 lg:py-16">
      <div ref={ref} className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-6 sm:mb-8 md:mb-12 lg:mb-16 text-center"
        >
          <h2 className="font-playfair text-4xl font-bold text-[#3a3a3a] sm:text-5xl md:text-6xl">
            Wall of Love
          </h2>
          <p className="font-script mb-4 text-xl sm:text-2xl lg:text-3xl text-[#3a3a3a]/70">
            Leave your wishes and create a digital memory card
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-3 rounded-full bg-linear-to-r from-[#d4a5a5] to-[#b88989] px-8 py-1.5 font-cormorant text-lg lg:text-xl font-semibold text-white shadow-lg transition-all hover:shadow-xl"
          >
            <Heart className="h-5 w-5 lg:h-6 lg:w-6 fill-white" />
            Leave a Wish
          </motion.button>
        </motion.div>

        {/* Memory Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid gap-4 xl:gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {displayedCards.map((card, index) => (
            <MemoryCardDisplay 
              key={card.id} 
              card={card} 
              index={index}
              onPhotoClick={setLightboxImage}
            />
          ))}
        </motion.div>

        {/* See More Button */}
        {hasMoreCards && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 text-center"
          >
            <Link href="/memory-cards">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 rounded-full bg-linear-to-r from-[#9caf88] to-[#7a9070] px-8 py-2 font-cormorant text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl"
              >
                See All Memory Cards
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Wish Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-2xl"
          >
            <button
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="absolute right-4 top-4 z-10 rounded-full p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6">
              <h3 className="font-playfair mb-6 text-2xl font-bold text-[#3a3a3a]">
                Create Your Memory Card
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo Upload - Optional */}
                <div>
                  <label className="font-cormorant mb-2 block text-sm font-semibold text-[#3a3a3a]">
                    Your Photo <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  {!photoPreview ? (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-[#d4a5a5]">
                      <Upload className="mb-2 h-8 w-8 text-gray-400" />
                      <p className="font-cormorant text-sm text-gray-600">Upload your photo</p>
                      <p className="font-cormorant text-xs text-gray-400 mt-1">Optional</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative">
                      <img src={photoPreview} alt="Preview" className="h-32 w-32 rounded-full object-cover mx-auto" />
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview(null);
                          setGuestPhoto(null);
                        }}
                        className="absolute top-0 right-1/2 translate-x-16 rounded-full bg-red-500 p-1 text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Name Input */}
                <div>
                  <label className="font-cormorant mb-2 block text-sm font-semibold text-[#3a3a3a]">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="font-cormorant w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#d4a5a5] focus:outline-none"
                  />
                </div>

                {/* Message Input */}
                <div>
                  <label className="font-cormorant mb-2 block text-sm font-semibold text-[#3a3a3a]">
                    Your Wishes (100-200 characters)
                  </label>
                  <textarea
                    value={guestMessage}
                    onChange={(e) => setGuestMessage(e.target.value)}
                    placeholder="Share your wishes for the couple..."
                    rows={4}
                    maxLength={200}
                    required
                    className="font-cormorant w-full rounded-lg border border-gray-300 px-4 py-3 resize-none focus:border-[#d4a5a5] focus:outline-none"
                  />
                  <p className="font-cormorant mt-1 text-right text-xs text-gray-500">
                    {guestMessage.length}/200
                  </p>
                </div>

                {/* Password Input */}
                <div>
                  <label className="font-cormorant mb-2 block text-sm font-semibold text-[#3a3a3a]">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError('');
                      }}
                      placeholder="Enter password"
                      required
                      className="font-cormorant w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:border-[#d4a5a5] focus:outline-none"
                    />
                  </div>
                  {passwordError && (
                    <p className="font-cormorant mt-1 text-sm text-red-500">
                      {passwordError}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !guestName || !guestMessage || !password}
                  className="font-cormorant flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#d4a5a5] to-[#b88989] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Memory Card'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}

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
    </section>
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
      transition={{ duration: 0.5, delay: index * 0.1 }}
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
            <div className="p-3 md:p-6">
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
          <div className="p-3 md:p-6">
            {/* Header with Initials Avatar */}
            <div className="mb-2 md:mb-4 flex items-center gap-4">
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
            <div className="mb-2 md:mb-4 h-px bg-linear-to-r from-transparent via-[#d4a5a5]/30 to-transparent" />

            {/* Message with Quote Styling */}
            <div className="relative">
              <Heart className="absolute -left-1 -top-1 h-6 w-6 text-[#d4a5a5]/30" />
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