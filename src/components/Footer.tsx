'use client';

import { motion } from 'framer-motion';
import { Heart, Instagram, Facebook, Mail, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [showShareModal, setShowShareModal] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('https://your-wedding-site.com');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setWebsiteUrl(window.location.href);
    setIsMounted(true);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hridoy & Roksana Wedding Reception',
          text: 'Join us for our wedding celebration on December 14, 2025',
          url: websiteUrl,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      setShowShareModal(true);
    }
  };

  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-br from-[#3a3a3a] to-[#2a2a2a] px-4 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Left Column - Couple Info */}
          <div className="text-center md:text-left">
            <h3 className="font-playfair mb-4 text-3xl font-bold">
              Hridoy <span className="font-script text-[#d4a5a5]">&</span> Roksana
            </h3>
            <p className="font-cormorant mb-6 text-lg text-white/80">
              December 14, 2025
            </p>
            <p className="font-cormorant text-base leading-relaxed text-white/70">
              Thank you for being part of our special day. Your presence and blessings mean everything to us.
            </p>
          </div>

          {/* Center Column - QR Code */}
          <div className="flex flex-col items-center justify-center">
            <p className="font-cormorant mb-4 text-sm uppercase tracking-wider text-white/80">
              Share Our Story
            </p>
            <div className="rounded-lg bg-white p-4">
              {isMounted ? (
                <QRCodeSVG
                  value={websiteUrl}
                  size={120}
                  level="H"
                  includeMargin={false}
                />
              ) : (
                <div className="h-[120px] w-[120px]" />
              )}
            </div>
            <button
              onClick={handleShare}
              className="mt-4 flex items-center gap-2 font-cormorant text-sm text-white/80 transition-colors hover:text-white"
            >
              <Share2 className="h-4 w-4" />
              Share with friends
            </button>
          </div>

          {/* Right Column - Contact & Social */}
          <div className="text-center md:text-right">
            <p className="font-cormorant mb-4 text-sm uppercase tracking-wider text-white/80">
              Connect With Us
            </p>

            {/* Social Links - Optional */}
            <div className="mb-6 flex justify-center gap-4 md:justify-end">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="mailto:contact@example.com"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </motion.a>
            </div>

            <div className="font-cormorant text-sm text-white/60">
              <p className="mb-2">For any queries, please contact:</p>
              <p>+880 1234-567890</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Bottom Section */}
        <div className="text-center">
          <p className="font-cormorant mb-3 text-sm text-white/60">
            © 2025 Hridoy & Roksana. All rights reserved.
          </p>
          <p className="font-script flex items-center justify-center gap-2 text-lg text-white/80">
            Made with <Heart className="h-4 w-4 fill-red-400 text-red-400" /> for a beautiful beginning
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[#9caf88]/10 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[#d4a5a5]/10 blur-3xl" />

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setShowShareModal(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-lg bg-white p-6 text-[#3a3a3a]"
          >
            <h3 className="font-playfair mb-4 text-xl font-bold">Share Our Wedding</h3>
            <p className="font-cormorant mb-4 text-sm">Copy the link below to share with friends:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={websiteUrl}
                readOnly
                className="font-cormorant flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(websiteUrl);
                  alert('Link copied!');
                }}
                className="rounded bg-[#9caf88] px-4 py-2 font-cormorant text-sm font-semibold text-white hover:bg-[#7a9070]"
              >
                Copy
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </footer>
  );
}
