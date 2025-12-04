'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Heart, Download, Upload, X, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';

interface GuestCard {
  id: string;
  name: string;
  message: string;
  photo: string;
  timestamp: Date;
}

// Mock data
const mockCards: GuestCard[] = [
  {
    id: '1',
    name: 'Sarah & John',
    message: 'Wishing you a lifetime of love and happiness! Congratulations on your special day.',
    photo: '/images/wedding-couple5.png',
    timestamp: new Date(),
  },
];

export default function DigitalMemoryCard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showModal, setShowModal] = useState(false);
  const [cards, setCards] = useState<GuestCard[]>(mockCards);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [guestPhoto, setGuestPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
    if (!guestName || !guestMessage || !photoPreview) return;

    setIsSubmitting(true);

    // Simulate submission - Replace with actual backend
    setTimeout(() => {
      const newCard: GuestCard = {
        id: Date.now().toString(),
        name: guestName,
        message: guestMessage,
        photo: photoPreview,
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
  };

  const downloadCard = async (card: GuestCard) => {
    const cardElement = document.getElementById(`memory-card-${card.id}`);
    if (!cardElement) return;

    const canvas = await html2canvas(cardElement, {
      scale: 2,
      backgroundColor: null,
    });

    const link = document.createElement('a');
    link.download = `wedding-memory-${card.name.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-[#f5f1e8] to-[#faf8f3] px-4 py-24">
      <div ref={ref} className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="font-playfair mb-4 text-4xl font-bold text-[#3a3a3a] sm:text-5xl md:text-6xl">
            Wall of Love
          </h2>
          <p className="font-cormorant mb-8 text-xl text-[#3a3a3a]/70 sm:text-2xl">
            Leave your wishes and create a digital memory card
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#d4a5a5] to-[#b88989] px-8 py-4 font-cormorant text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl"
          >
            <Heart className="h-5 w-5 fill-white" />
            Leave a Wish
          </motion.button>
        </motion.div>

        {/* Memory Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cards.map((card, index) => (
            <MemoryCardDisplay key={card.id} card={card} index={index} onDownload={downloadCard} />
          ))}
        </motion.div>
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
                {/* Photo Upload */}
                <div>
                  <label className="font-cormorant mb-2 block text-sm font-semibold text-[#3a3a3a]">
                    Your Photo
                  </label>
                  {!photoPreview ? (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-[#d4a5a5]">
                      <Upload className="mb-2 h-8 w-8 text-gray-400" />
                      <p className="font-cormorant text-sm text-gray-600">Upload your photo</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        className="hidden"
                        required
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !guestName || !guestMessage || !photoPreview}
                  className="font-cormorant flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#d4a5a5] to-[#b88989] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
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
    </section>
  );
}

function MemoryCardDisplay({
  card,
  index,
  onDownload,
}: {
  card: GuestCard;
  index: number;
  onDownload: (card: GuestCard) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Downloadable Card (Hidden, used for export) */}
      <div
        id={`memory-card-${card.id}`}
        className="absolute -left-[9999px] flex h-[1920px] w-[1080px] flex-col items-center justify-center bg-gradient-to-br from-[#9caf88] to-[#d4a5a5] p-16"
      >
        <img src={card.photo} alt={card.name} className="mb-12 h-48 w-48 rounded-full object-cover border-8 border-white shadow-2xl" />
        <p className="font-script mb-8 text-center text-5xl text-white px-12 leading-relaxed">{card.message}</p>
        <p className="font-cormorant mb-4 text-3xl font-semibold text-white">— {card.name}</p>
        <p className="font-cormorant mb-12 text-2xl text-white/90">Guest of Hridoy & Roksana</p>
        <p className="font-playfair mb-16 text-2xl text-white/80">14 Dec 2025</p>
        <QRCodeSVG value="https://your-wedding-site.com" size={200} level="H" />
      </div>

      {/* Display Card */}
      <div className="overflow-hidden rounded-lg bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
        <div className="mb-4 flex items-center gap-4">
          <img src={card.photo} alt={card.name} className="h-16 w-16 rounded-full object-cover" />
          <div>
            <p className="font-playfair font-semibold text-[#3a3a3a]">{card.name}</p>
            <p className="font-cormorant text-sm text-[#3a3a3a]/60">
              {card.timestamp.toLocaleDateString()}
            </p>
          </div>
        </div>

        <p className="font-cormorant mb-4 text-base leading-relaxed text-[#3a3a3a]/80">
          {card.message}
        </p>

        <button
          onClick={() => onDownload(card)}
          className="font-cormorant flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#d4a5a5] px-4 py-2 font-semibold text-[#d4a5a5] transition-colors hover:bg-[#d4a5a5] hover:text-white"
        >
          <Download className="h-4 w-4" />
          Download Card
        </button>
      </div>
    </motion.div>
  );
}
