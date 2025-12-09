'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/wedding-couple17.jpg"
          alt="Wedding couple"
          fill
          priority
          className="object-cover object-top"
          quality={100}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Couple Names */}
          <h1 className="font-playfair text-5xl font-bold tracking-wide sm:text-6xl md:text-7xl lg:text-8xl">
            Hridoy & Roksana
          </h1>

          {/* Date */}
          <p className="font-cormorant text-3xl font-light tracking-[0.3em] sm:text-4xl md:text-5xl">
            14.12.25
          </p>

          {/* Romantic Poem */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mx-auto max-w-2xl pt-8"
          >
            <p className="font-script text-2xl leading-relaxed sm:text-3xl md:text-4xl">
              Two hearts, one soul
              <br />
              Forever begins where our love story unfolds
            </p>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="font-cormorant pt-4 text-xl font-light tracking-wider sm:text-2xl"
          >
            Join us for an evening of love and celebration
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex flex-col items-center gap-1"
          >
            <span className="font-cormorant text-sm">Scroll to Celebrate</span>
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
