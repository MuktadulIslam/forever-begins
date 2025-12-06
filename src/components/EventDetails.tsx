'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, Clock, Navigation, Sparkles } from 'lucide-react';

export default function EventDetails() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const handleGetDirections = () => {
        // SKS Convention Hall exact coordinates
        const lat = 23.778553254822263;
        const lng = 90.39630632023989;
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(googleMapsUrl, '_blank');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    return (
        <section className="relative w-full px-4 py-6 smLpy-10 md:py-16">

            <div ref={ref} className="relative mx-auto max-w-7xl">
                {/* Elegant Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-4 lg:mb-10 text-center"
                >
                    <h2 className="font-playfair md:mb-2 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#3a3a3a]">
                        Celebration Details {/* When & Where */}
                    </h2>
                    <div className="mx-auto h-0.5 lg:h-1 w-40 sm:w-48 lg:w-60 bg-linear-to-r from-transparent via-[#d4a5a5] to-transparent rounded-full" />
                    <p className="font-script mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-xl sm:text-2xl lg:text-3xl text-[#3a3a3a]/70">
                        We can't wait to celebrate this special day with you
                    </p>
                </motion.div>

                {/* Enhanced Main Card */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="relative rounded-2xl bg-white shadow-xl shadow-black/10"
                >
                    {/* Decorative corner accents */}
                    <div className="pointer-events-none absolute left-0 top-0 h-32 w-32 bg-linear-to-br rounded-tl-2xl from-[#9caf88]/10 to-transparent" />
                    <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 bg-linear-to-tl rounded-br-2xl from-[#d4a5a5]/10 to-transparent" />

                    <div className="grid gap-0 lg:grid-cols-5">
                        {/* Left Side - Event Info (3 columns) */}
                        <div className="relative space-y-8 p-5 sm:p-8 lg:p-12 lg:col-span-3">
                            {/* Couple Names with decorative elements */}
                            <div className="relative border-b border-[#9caf88]/20 py-2 lg:pb-4 mb-10">
                                <div className="absolute -left-3 top-0 h-full w-1 bg-linear-to-b from-[#9caf88] via-[#d4a5a5] to-[#d4af37]" />
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-[#d4af37]" />
                                    <p className="font-cormorant text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-[#9caf88]">
                                        The Wedding Reception Of
                                    </p>
                                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-[#d4af37]" />
                                </div>
                                <h3 className="font-playfair text-xl sm:text-3xl lg:text-4xl font-bold leading-6 sm:leading-8 lg:leading-10 text-[#3a3a3a]">
                                    Syed Didarul Alim Hridoy
                                    <br />
                                    <span className="font-script mr-2 sm:text-mr-3 lg:mr-4 text-[#d4a5a5]">&</span>
                                    Mst Roksana Khatun
                                </h3>
                            </div>

                            {/* Event Details with enhanced styling */}
                            <div className="space-y-4 lg:space-y-6">
                                {/* Date */}
                                <div className="group flex items-start gap-3 rounded-xl transition-all">
                                    <div className="flex h-12 w-12 sm:w-16 sm:h-16 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#9caf88]/20 to-[#9caf88]/10 shadow-md transition-transform group-hover:scale-110">
                                        <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-[#9caf88]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-cormorant text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-[#3a3a3a]/50">
                                            Date
                                        </p>
                                        <p className="font-playfair text-base sm:text-lg lg:text-xl font-semibold text-[#3a3a3a] leading-5">
                                            Sunday, December 14, 2025
                                        </p>
                                        <p className="font-cormorant text-sm lg:text-base sm:mt-1 text-[#3a3a3a]/60">
                                            Mark your calendars
                                        </p>
                                    </div>
                                </div>

                                {/* Time */}
                                <div className="group flex items-start gap-3 rounded-xl transition-all">
                                    <div className="flex h-12 w-12 sm:w-16 sm:h-16 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#d4a5a5]/20 to-[#d4a5a5]/10 shadow-md transition-transform group-hover:scale-110">
                                        <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-[#d4a5a5]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-cormorant text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-[#3a3a3a]/50">
                                            Time
                                        </p>
                                        <p className="font-playfair text-base sm:text-lg lg:text-xl font-semibold text-[#3a3a3a] leading-5">
                                            6:00 PM Onwards
                                        </p>
                                        <p className="font-cormorant text-sm lg:text-base sm:mt-1 text-[#3a3a3a]/60">
                                            Evening celebration
                                        </p>
                                    </div>
                                </div>

                                {/* Venue */}
                                <div className="group flex items-start gap-3 rounded-xl transition-all">
                                    <div className="flex h-12 w-12 sm:w-16 sm:h-16 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#d4af37]/20 to-[#d4af37]/10 shadow-md transition-transform group-hover:scale-110">
                                        <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-[#d4af37]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-cormorant text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-[#3a3a3a]/50">
                                            Venue
                                        </p>
                                        <p className="font-playfair text-base sm:text-lg lg:text-xl font-semibold text-[#3a3a3a] leading-5">
                                            SKS Convention Hall
                                        </p>
                                        <p className="font-cormorant text-sm lg:text-base sm:mt-1 text-[#3a3a3a]/60">
                                            Lift-09, Mohakhali, Dhaka
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Get Directions Button */}
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGetDirections}
                                className="group relative w-full overflow-hidden rounded-xl lg:rounded-2xl bg-linear-to-r from-[#9caf88] via-[#8ba57d] to-[#7a9070] shadow-lg transition-all hover:shadow-2xl"
                            >
                                <div className="relative flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 rounded-lg bg-linear-to-r from-[#9caf88] to-[#7a9070] px-8 py-1 lg:py-2 transition-all">
                                    <Navigation className="h-4 w-4 text-white transition-transform group-hover:rotate-12" />
                                    <span className="font-cormorant text-lg font-bold text-white">
                                        Get Directions
                                    </span>
                                </div>
                                <motion.div
                                    className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: '100%' }}
                                    transition={{ duration: 0.6 }}
                                />
                            </motion.button>
                        </div>

                        {/* Right Side - Enhanced Map (2 columns) */}
                        <div className="relative h-[450px] p-2 lg:col-span-2 lg:h-auto">
                            <div className="w-full h-full border-2 border-gray-500/50 overflow-hidden max-lg:rounded-lg lg:rounded-r-2xl">
                                <iframe
                                    src={`https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3650.7536834!2d90.39630632023989!3d23.778553254822263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjPCsDQ2JzQyLjgiTiA5MMKwMjMnNDYuNyJF!5e0!3m2!1sen!2sbd!4v1234567890`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="grayscale-[0.2] transition-all hover:grayscale-0"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
