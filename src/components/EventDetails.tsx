'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, Clock, MapPin, Navigation } from 'lucide-react';

export default function EventDetails() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleGetDirections = () => {
    // SKS Convention Hall coordinates (approximate)
    const destination = "SKS Convention Hall, Mohakhali, Dhaka";
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <section className="min-h-screen w-full bg-[#faf8f3] px-4 py-24">
      <div ref={ref} className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="font-playfair mb-4 text-4xl font-bold text-[#3a3a3a] sm:text-5xl md:text-6xl">
            Celebration Details
          </h2>
          <p className="font-cormorant text-xl text-[#3a3a3a]/70 sm:text-2xl">
            Join us for an evening of love and celebration
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="overflow-hidden rounded-lg bg-white shadow-2xl"
        >
          <div className="grid gap-0 md:grid-cols-2">
            {/* Left Side - Event Info */}
            <div className="space-y-8 p-8 sm:p-12">
              {/* Couple Names */}
              <div className="border-b border-[#9caf88]/30 pb-6">
                <p className="font-cormorant mb-2 text-sm uppercase tracking-widest text-[#9caf88]">
                  The Wedding Reception Of
                </p>
                <h3 className="font-playfair text-2xl font-semibold text-[#3a3a3a] sm:text-3xl">
                  Md Didarul Alim Hridoy
                  <span className="font-script mx-3 text-[#d4a5a5]">&</span>
                  Mst Roksana Khatun
                </h3>
              </div>

              {/* Event Details */}
              <div className="space-y-6">
                {/* Date */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9caf88]/10">
                    <Calendar className="h-6 w-6 text-[#9caf88]" />
                  </div>
                  <div>
                    <p className="font-cormorant text-sm font-medium uppercase tracking-wider text-[#3a3a3a]/60">
                      Date
                    </p>
                    <p className="font-playfair text-xl font-semibold text-[#3a3a3a]">
                      Sunday, December 14, 2025
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4a5a5]/10">
                    <Clock className="h-6 w-6 text-[#d4a5a5]" />
                  </div>
                  <div>
                    <p className="font-cormorant text-sm font-medium uppercase tracking-wider text-[#3a3a3a]/60">
                      Time
                    </p>
                    <p className="font-playfair text-xl font-semibold text-[#3a3a3a]">
                      6:00 PM Onwards
                    </p>
                  </div>
                </div>

                {/* Venue */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4af37]/10">
                    <MapPin className="h-6 w-6 text-[#d4af37]" />
                  </div>
                  <div>
                    <p className="font-cormorant text-sm font-medium uppercase tracking-wider text-[#3a3a3a]/60">
                      Venue
                    </p>
                    <p className="font-playfair text-xl font-semibold text-[#3a3a3a]">
                      SKS Convention Hall
                    </p>
                    <p className="font-cormorant text-base text-[#3a3a3a]/70">
                      Lift-09, Mohakhali, Dhaka
                    </p>
                  </div>
                </div>
              </div>

              {/* Get Directions Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetDirections}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#9caf88] to-[#7a9070] px-8 py-4 font-cormorant text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl"
              >
                <Navigation className="h-5 w-5" />
                Get Directions
              </motion.button>
            </div>

            {/* Right Side - Map */}
            <div className="relative h-[400px] md:h-auto">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.8969786421157!2d90.39238631543467!3d23.780932784576787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a1d6c0c0c5%3A0x1!2sMohakhali%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
          </div>
        </motion.div>

        {/* Decorative Element */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="mx-auto h-px w-64 bg-gradient-to-r from-transparent via-[#9caf88] to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
