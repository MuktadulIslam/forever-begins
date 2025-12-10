'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, Image as ImageIcon, Sparkles } from 'lucide-react';

interface Album {
    id: number;
    title: string;
    description: string;
    coverImage: string;
    googlePhotosLink: string;
}

// Link for "Explore More Albums" button
const exploreMoreAlbumsLink = 'https://photos.google.com/your-all-albums';

// Album data - replace with your actual Google Photos links
const albums: Album[] = [
    {
        id: 1,
        title: 'Engagement Ceremony',
        description: 'The beautiful beginning of our journey',
        coverImage: '/images/albums/album2.jpg',
        googlePhotosLink: 'https://photos.google.com/your-engagement-album',
    },
    {
        id: 2,
        title: 'Pre-Wedding Shoot',
        description: 'Captured moments of love and laughter',
        coverImage: '/images/albums/album4.jpg',
        googlePhotosLink: 'https://photos.google.com/your-prewedding-album',
    },
    {
        id: 3,
        title: 'Haldi & Mehendi',
        description: 'Colors of tradition and celebration',
        coverImage: '/images/albums/album3.jpg',
        googlePhotosLink: 'https://photos.google.com/your-haldi-album',
    },
    {
        id: 4,
        title: 'Wedding Reception',
        description: 'An evening of love and blessings',
        coverImage: '/images/albums/album1.jpg',
        googlePhotosLink: 'https://photos.google.com/your-reception-album',
    }
];

function FolderCard({ album, index }: { album: Album; index: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [isHovered, setIsHovered] = useState(false);

    // Color schemes for different albums
    const colorSchemes = [
        { primary: '#9caf88', secondary: '#7a9070', light: '#c5d4b8' },
        { primary: '#d4a5a5', secondary: '#b88989', light: '#e5c5c5' },
        { primary: '#d4af37', secondary: '#b89730', light: '#e5cf87' },
        { primary: '#c4a5b5', secondary: '#a88999', light: '#d5c5d0' }
    ];

    const colors = colorSchemes[index % colorSchemes.length];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
            transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="group relative"
        >
            <motion.a
                href={album.googlePhotosLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block relative cursor-pointer"
            >
                {/* Folder Container */}
                <div className="relative perspective-1000">
                    {/* Folder SVG with enhanced styling */}
                    <div className="relative">
                        <svg viewBox="0 0 200 200" className="w-full h-auto drop-shadow-2xl">
                            <defs>
                                {/* Main gradient */}
                                <linearGradient id={`folderGradient${album.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: colors.primary, stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: colors.secondary, stopOpacity: 1 }} />
                                </linearGradient>

                                {/* Glossy highlight */}
                                <linearGradient id={`folderHighlight${album.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.5 }} />
                                    <stop offset="50%" style={{ stopColor: '#ffffff', stopOpacity: 0.15 }} />
                                    <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 0.08 }} />
                                </linearGradient>

                                {/* Tab gradient */}
                                <linearGradient id={`tabGradient${album.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" style={{ stopColor: colors.primary, stopOpacity: 0.9 }} />
                                    <stop offset="100%" style={{ stopColor: colors.light, stopOpacity: 0.95 }} />
                                </linearGradient>

                                {/* Shadow filter */}
                                <filter id={`shadow${album.id}`} x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                                    <feOffset dx="0" dy="4" result="offsetblur" />
                                    <feComponentTransfer>
                                        <feFuncA type="linear" slope="0.3" />
                                    </feComponentTransfer>
                                    <feMerge>
                                        <feMergeNode />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Folder tab (macOS style) */}
                            <path
                                d="M 18 38 L 18 32 Q 18 28 22 28 L 75 28 Q 78 28 80 31 L 88 42 L 18 42 Z"
                                fill={`url(#tabGradient${album.id})`}
                                filter={`url(#shadow${album.id})`}
                                className="transition-all duration-300"
                            />

                            {/* Tab highlight */}
                            <path
                                d="M 20 38 L 20 32 Q 20 30 22 30 L 75 30 Q 77 30 78.5 32 L 86 42 L 20 42 Z"
                                fill="url(#folderHighlight${album.id})"
                                opacity="0.4"
                            />

                            {/* Main folder body */}
                            <path
                                d="M 8 42 Q 8 38 12 38 L 188 38 Q 192 38 192 42 L 192 182 Q 192 186 188 186 L 12 186 Q 8 186 8 182 Z"
                                fill={`url(#folderGradient${album.id})`}
                                filter={`url(#shadow${album.id})`}
                                className="transition-all duration-300 group-hover:opacity-95"
                            />

                            {/* Glossy overlay on folder */}
                            <path
                                d="M 8 42 Q 8 38 12 38 L 188 38 Q 192 38 192 42 L 192 182 Q 192 186 188 186 L 12 186 Q 8 186 8 182 Z"
                                fill="url(#folderHighlight${album.id})"
                                opacity="0.7"
                            />

                            {/* Inner shadow for depth */}
                            <path
                                d="M 12 44 L 188 44 L 188 182 Q 188 184 186 184 L 14 184 Q 12 184 12 182 Z"
                                fill="none"
                                stroke="rgba(0,0,0,0.12)"
                                strokeWidth="1.5"
                            />

                            {/* Edge highlight */}
                            <path
                                d="M 12 38 Q 8 38 8 42 L 8 182 Q 8 186 12 186 L 188 186 Q 192 186 192 182 L 192 42 Q 192 38 188 38"
                                fill="none"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="1"
                            />
                        </svg>

                        {/* Content inside folder */}
                        <div className="absolute" style={{ top: '24%', bottom: '10%', left: '10%', right: '10%' }}>
                            {/* Photo preview container with enhanced styling */}
                            <div className="relative h-full rounded-lg overflow-hidden bg-white shadow-lg ring-1 ring-black/5">
                                {/* Photo */}
                                <img
                                    src={album.coverImage}
                                    alt={album.title}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                />

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />


                                {/* Hover content */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center p-3"
                                >
                                    {/* Open button */}
                                    <div className="bg-white/98 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 shadow-xl border border-gray-200/50">
                                        <ExternalLink className="h-4 w-4" style={{ color: colors.primary }} />
                                        <span className="font-cormorant text-sm font-bold text-gray-800">
                                            Open Album
                                        </span>
                                    </div>

                                    {/* Sparkles decoration */}
                                    <motion.div
                                        animate={{
                                            rotate: [0, 10, -10, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute top-4 left-4"
                                    >
                                        <Sparkles className="h-4 w-4 text-white/80" />
                                    </motion.div>
                                    <motion.div
                                        animate={{
                                            rotate: [0, -10, 10, 0],
                                            scale: [1, 1.2, 1]
                                        }}
                                        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                                        className="absolute bottom-4 right-4"
                                    >
                                        <Sparkles className="h-3 w-3 text-white/70" />
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Album info below folder */}
                <div className="text-center text-sm sm:text-base lg:text-lg">
                    <h3 className="font-playfair font-bold text-[#3a3a3a] transition-colors duration-300"
                        style={{ color: isHovered ? colors.primary : undefined }}>
                        {album.title}
                    </h3>
                    <p className="font-script text-[#3a3a3a]/60 leading-snug">
                        {album.description}
                    </p>
                </div>
            </motion.a>
        </motion.div>
    );
}

export default function PhotoAlbums() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <section className="relative w-full overflow-hidden bg-linear-to-br from-[#f8f5f0] via-[#fef9f3] to-[#f5ebe0] px-4 pt-10 md:pt-16 lg:pt-20 pb-5 md:pb-8">
            <div ref={ref} className="relative mx-auto max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                    className="md:mb-2 lg:mb-4 text-center"
                >
                    <h2 className="font-playfair mb-1 lg:mb-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#3a3a3a]">
                        Photo Albums
                    </h2>

                    <div className="mx-auto h-0.5 lg:h-1 w-40 sm:w-48 lg:w-60 bg-linear-to-r from-transparent via-[#d4a5a5] to-transparent mb-1 lg:mb-2 rounded-full" />

                    <p className="font-script text-xl sm:text-2xl lg:text-3xl text-[#3a3a3a]/70 max-w-2xl mx-auto">
                        Explore our beautiful moments, one album at a time
                    </p>
                </motion.div>

                {/* Albums Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-5">
                    {albums.map((album, index) => (
                        <FolderCard key={index} album={album} index={index} />
                    ))}
                </div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-6 md:mt-8 lg:mt-10 text-center"
                >
                    <motion.a
                        href={exploreMoreAlbumsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative inline-flex items-center gap-3 bg-linear-to-r from-[#9caf88] via-[#a8ba95] to-[#d4a5a5] rounded-full px-8 py-2 lg:px-10 lg:py-3 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    >
                        {/* Animated background shimmer */}
                        <motion.div
                            className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                            animate={{
                                x: ['-200%', '200%'],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                        
                        {/* Icon with animation */}
                        <motion.div
                            animate={{
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <ImageIcon className="h-5 w-5 lg:h-6 lg:w-6 text-white drop-shadow-md relative z-10" />
                        </motion.div>
                        
                        {/* Text */}
                        <span className="font-cormorant text-base lg:text-lg font-bold text-white drop-shadow-md relative z-10">
                            Explore More Albums
                        </span>
                        
                        {/* Sparkle effect on hover */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            className="absolute -top-1 -right-1"
                        >
                            <Sparkles className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-300 drop-shadow-lg" />
                        </motion.div>
                        
                        {/* Border glow effect */}
                        <div className="absolute inset-0 rounded-full bg-linear-to-r from-[#9caf88] to-[#d4a5a5] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
                    </motion.a>
                    
                    {/* Decorative text below button */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-3 lg:mt-4 font-script text-sm lg:text-base text-[#3a3a3a]/50"
                    >
                        Click to view all our cherished memories
                    </motion.p>
                </motion.div>
            </div>

            {/* Enhanced Decorative Elements */}
            <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-[#9caf88]/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-32 bottom-20 h-64 w-64 rounded-full bg-[#d4a5a5]/10 blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#d4af37]/5 blur-3xl" />
        </section>
    );
}