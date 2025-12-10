'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface Photo {
	id: number;
	src: string;
	alt: string;
}

// Sample photo data - replace with actual photo paths
const photos: Photo[] = [
	{ id: 1, src: '/images/memories/memorie1.jpg', alt: 'Couple photo 1'},
	{ id: 2, src: '/images/memories/memorie2.jpg', alt: 'Couple photo 2' },
	{ id: 3, src: '/images/memories/memorie3.jpg', alt: 'Family photo 1' },
	{ id: 4, src: '/images/memories/memorie4.jpg', alt: 'Family photo 2' },
	{ id: 5, src: '/images/memories/memorie5.jpg', alt: 'Couple photo 3' },
	{ id: 6, src: '/images/memories/memorie6.jpg', alt: 'Family photo 3' },
	{ id: 7, src: '/images/memories/memorie7.jpg', alt: 'Couple photo 4' },
	{ id: 8, src: '/images/memories/memorie8.jpg', alt: 'Family photo 4' },
	{ id: 9, src: '/images/memories/memorie9.jpg', alt: 'Couple photo 5' },
	{ id: 10, src: '/images/memories/memorie10.jpg', alt: 'Family photo 5' },
	{ id: 11, src: '/images/memories/memorie11.jpg', alt: 'Couple photo 6' },
	{ id: 12, src: '/images/memories/memorie12.jpg', alt: 'Family photo 6' },
];

function PhotoCard({ photo, onClick, index }: { photo: Photo; onClick: () => void; index: number }) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-50px" });

	// Alternating slight rotations for a more organic gallery feel
	const rotations = [1, -1, 2, -2, 1.5, -1.5];
	const rotation = rotations[index % rotations.length];

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 40, scale: 0.9 }}
			animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.9 }}
			transition={{
				duration: 0.7,
				delay: index * 0.1,
				ease: [0.25, 0.46, 0.45, 0.94]
			}}
			whileHover={{ y: -16, scale: 1.05, rotate: 0, transition: { duration: 0.3 } }}
			whileTap={{ scale: 0.95 }}
			style={{ rotate: rotation }}
			className="group relative cursor-pointer"
			onClick={onClick}
		>
			{/* Polaroid-style frame */}
			<div className="relative bg-white p-3 sm:p-4 rounded-sm shadow-2xl hover:shadow-3xl transition-all duration-500">
				{/* Photo container */}
				<div className="relative aspect-[4/3] overflow-hidden bg-gray-100 mb-3">
					<Image
						src={photo.src}
						alt={photo.alt}
						fill
						className="object-cover transition-all duration-700 group-hover:scale-110 object-top"
						sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
					/>

					{/* Subtle gradient overlay */}
					<div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

					{/* Hover icon overlay */}
					<div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-300">
						<motion.div
							initial={{ scale: 0, opacity: 0 }}
							whileHover={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.2 }}
							className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
						>
							<div className="bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-xl">
								<Sparkles className="h-5 w-5 text-[#d4a5a5]" />
							</div>
						</motion.div>
					</div>
				</div>

				{/* Photo caption/number */}
				<div className="text-center">
					<p className="font-script text-sm sm:text-base text-[#3a3a3a]/60">
						Memory {index + 1}
					</p>
				</div>

				{/* Corner tape effect - top left */}
				<div className="absolute -top-2 -left-2 w-12 h-6 bg-[#faf8f3]/80 shadow-md rotate-[-45deg] border border-[#3a3a3a]/10" />
				
				{/* Corner tape effect - top right */}
				<div className="absolute -top-2 -right-2 w-12 h-6 bg-[#faf8f3]/80 shadow-md rotate-[45deg] border border-[#3a3a3a]/10" />
			</div>

			{/* Soft shadow beneath */}
			<div className="absolute inset-0 -z-10 bg-black/20 blur-xl translate-y-4 group-hover:translate-y-6 transition-transform duration-500" />
		</motion.div>
	);
}

function Lightbox({ photo, onClose, onNext, onPrev, currentIndex, totalPhotos, direction }: {
	photo: Photo;
	onClose: () => void;
	onNext: () => void;
	onPrev: () => void;
	currentIndex: number;
	totalPhotos: number;
	direction: 'next' | 'prev';
}) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
			onClick={onClose}
		>
			{/* Close button */}
			<motion.button
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: 0.1 }}
				onClick={onClose}
				className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors duration-300"
				aria-label="Close"
			>
				<X className="h-6 w-6 text-white" />
			</motion.button>

			{/* Previous button */}
			{currentIndex > 0 && (
				<motion.button
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
					onClick={(e) => {
						e.stopPropagation();
						onPrev();
					}}
					className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors duration-300"
					aria-label="Previous photo"
				>
					<ChevronLeft className="h-6 w-6 text-white" />
				</motion.button>
			)}

			{/* Next button */}
			{currentIndex < totalPhotos - 1 && (
				<motion.button
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
					onClick={(e) => {
						e.stopPropagation();
						onNext();
					}}
					className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors duration-300"
					aria-label="Next photo"
				>
					<ChevronRight className="h-6 w-6 text-white" />
				</motion.button>
			)}

			{/* Image container with drag/swipe support */}
			<motion.div
				key={currentIndex}
				custom={direction}
				initial="enter"
				animate="center"
				exit="exit"
				variants={{
					enter: (direction: 'next' | 'prev') => ({
						x: direction === 'next' ? 1000 : -1000,
						opacity: 0,
						scale: 0.9
					}),
					center: {
						x: 0,
						opacity: 1,
						scale: 1
					},
					exit: (direction: 'next' | 'prev') => ({
						x: direction === 'next' ? -1000 : 1000,
						opacity: 0,
						scale: 0.9
					})
				}}
				transition={{
					x: { type: "spring", stiffness: 300, damping: 30 },
					opacity: { duration: 0.2 },
					scale: { duration: 0.2 }
				}}
				drag="x"
				dragConstraints={{ left: 0, right: 0 }}
				dragElastic={0.7}
				onDragEnd={(_, { offset, velocity }) => {
					const swipe = Math.abs(offset.x) * velocity.x;

					if (swipe > 10000 || offset.x > 100) {
						onPrev();
					} else if (swipe < -10000 || offset.x < -100) {
						onNext();
					}
				}}
				className="relative max-w-6xl max-h-[85vh] w-full cursor-grab active:cursor-grabbing"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="relative w-full h-full flex items-center justify-center select-none">
					<Image
						src={photo.src}
						alt={photo.alt}
						width={1200}
						height={900}
						className="max-w-full max-h-[85vh] w-full h-full object-contain rounded-lg shadow-2xl pointer-events-none"
						priority
						draggable={false}
					/>
				</div>

				{/* Photo counter */}
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 pointer-events-none">
					<p className="font-cormorant text-white text-base font-semibold">
						{currentIndex + 1} / {totalPhotos}
					</p>
				</div>

				{/* Swipe indicator hint */}
				{currentIndex === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: [0, 0.6, 0] }}
						transition={{ duration: 2, delay: 0.5 }}
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 pointer-events-none"
					>
						<ChevronLeft className="h-4 w-4 text-white animate-pulse" />
						<span className="text-white text-sm font-cormorant">Swipe to navigate</span>
						<ChevronRight className="h-4 w-4 text-white animate-pulse" />
					</motion.div>
				)}
			</motion.div>
		</motion.div>
	);
}

export default function PhotoGallery() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-50px" });
	const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
	const [direction, setDirection] = useState<'next' | 'prev'>('next');

	const handleNext = useCallback(() => {
		setDirection('next');
		setSelectedPhoto((current) => {
			if (current !== null && current < photos.length - 1) {
				return current + 1;
			}
			return current;
		});
	}, []);

	const handlePrev = useCallback(() => {
		setDirection('prev');
		setSelectedPhoto((current) => {
			if (current !== null && current > 0) {
				return current - 1;
			}
			return current;
		});
	}, []);

	// Add keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setSelectedPhoto(null);
			} else if (e.key === 'ArrowRight') {
				handleNext();
			} else if (e.key === 'ArrowLeft') {
				handlePrev();
			}
		};

		if (selectedPhoto !== null) {
			window.addEventListener('keydown', handleKeyDown);
			return () => window.removeEventListener('keydown', handleKeyDown);
		}
	}, [selectedPhoto, handleNext, handlePrev]);

	return (
		<section className="relative min-h-screen w-full overflow-hidden px-3 md:px-6 py-8 lg:py-16">
			{/* Subtle decorative elements */}
			<div className="pointer-events-none absolute top-20 left-10 w-64 h-64 bg-[#d4a5a5]/5 rounded-full blur-3xl" />
			<div className="pointer-events-none absolute bottom-20 right-10 w-64 h-64 bg-[#9caf88]/5 rounded-full blur-3xl" />

			<div ref={ref} className="relative mx-auto max-w-7xl">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.8 }}
					className="mb-10 md:mb-14 lg:mb-20 text-center px-4"
				>
					<h2 className="font-playfair mb-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#3a3a3a]">
						Sweet Memories
					</h2>

					<div className="mx-auto h-1 w-48 sm:w-56 lg:w-64 bg-linear-to-r from-transparent via-[#d4a5a5] to-transparent mb-4 rounded-full" />

					<motion.p 
						initial={{ opacity: 0 }}
						animate={isInView ? { opacity: 1 } : { opacity: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="font-script text-xl sm:text-2xl lg:text-3xl text-[#3a3a3a]/70 max-w-2xl mx-auto"
					>
						Moments of love, captured in time
					</motion.p>
				</motion.div>

				{/* Photo Grid - Masonry Style */}
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
					{photos.map((photo, index) => (
						<PhotoCard
							key={photo.id}
							photo={photo}
							onClick={() => setSelectedPhoto(index)}
							index={index}
						/>
					))}
				</div>

				{/* Bottom decorative element */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
					transition={{ duration: 0.6, delay: 1 }}
					className="mt-10 text-center"
				>
					<div className="flex items-center justify-center gap-4">
						<div className="h-px w-32 bg-linear-to-r from-transparent via-[#9caf88]/50 to-transparent" />
						<Sparkles className="h-5 w-5 text-[#d4a5a5]/50" />
						<div className="h-px w-32 bg-linear-to-l from-transparent via-[#9caf88]/50 to-transparent" />
					</div>
				</motion.div>
			</div>

			{/* Lightbox Modal */}
			<AnimatePresence initial={false} custom={direction}>
				{selectedPhoto !== null && (
					<Lightbox
						photo={photos[selectedPhoto]}
						onClose={() => setSelectedPhoto(null)}
						onNext={handleNext}
						onPrev={handlePrev}
						currentIndex={selectedPhoto}
						totalPhotos={photos.length}
						direction={direction}
					/>
				)}
			</AnimatePresence>
		</section>
	);
}