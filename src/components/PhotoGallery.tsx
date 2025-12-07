'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Photo {
	id: number;
	src: string;
	alt: string;
}

// Sample photo data - replace with actual photo paths
const photos: Photo[] = [
	// { id: 1, src: '/x.jpg', alt: 'Couple photo 1'},
	// { id: 2, src: '/y.jpeg', alt: 'Couple photo 2' },
	{ id: 1, src: '/images/wedding-couple1.png', alt: 'Couple photo 1'},
	{ id: 2, src: '/images/wedding-couple2.png', alt: 'Couple photo 2' },
	{ id: 3, src: '/images/wedding-couple3.png', alt: 'Family photo 1' },
	{ id: 4, src: '/images/wedding-couple4.png', alt: 'Family photo 2' },
	{ id: 5, src: '/images/wedding-couple5.png', alt: 'Couple photo 3' },
	{ id: 6, src: '/images/wedding-couple6.png', alt: 'Family photo 3' },
	{ id: 7, src: '/images/wedding-couple7.png', alt: 'Couple photo 4' },
	{ id: 8, src: '/images/wedding-couple8.png', alt: 'Family photo 4' },
	{ id: 9, src: '/images/wedding-couple9.png', alt: 'Couple photo 5' },
	{ id: 10, src: '/images/wedding-couple10.png', alt: 'Family photo 5' },
	{ id: 11, src: '/images/wedding-couple11.png', alt: 'Couple photo 6' },
	{ id: 12, src: '/images/wedding-couple12.png', alt: 'Family photo 6' },
];

function PhotoCard({ photo, onClick, index }: { photo: Photo; onClick: () => void; index: number }) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-50px" });

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 30, scale: 0.95 }}
			animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
			transition={{
				duration: 0.5,
				delay: index * 0.05,
				ease: [0.25, 0.46, 0.45, 0.94]
			}}
			whileHover={{ y: -8, scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			className="group relative overflow-hidden rounded-xl cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
			onClick={onClick}
		>
			{/* Image Container */}
			<div className="relative aspect-4/3 overflow-hidden bg-[#f5ebe0]">
				<Image
					src={photo.src}
					alt={photo.alt}
					fill
					className="object-cover transition-transform duration-500 group-hover:scale-110"
					sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
				/>

				{/* Overlay on hover */}
				<div className="absolute inset-0 bg-linear-to-t from-[#3a3a3a]/60 via-[#3a3a3a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			</div>

			{/* Decorative border */}
			<div className="absolute inset-0 border-2 border-[#d4a5a5]/30 rounded-2xl pointer-events-none" />
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
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
			onClick={onClose}
		>
			{/* Close button */}
			<motion.button
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: 0.1 }}
				onClick={onClose}
				className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors duration-300"
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
					className="absolute left-4 z-50 p-1.5 rounded-full bg-black/30 hover:bg-black/40 backdrop-blur-sm transition-colors duration-300"
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
					className="absolute right-4 z-50 p-1.5 rounded-full bg-black/30 hover:bg-black/40 backdrop-blur-sm transition-colors duration-300"
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
						// Swiped right - go to previous
						onPrev();
					} else if (swipe < -10000 || offset.x < -100) {
						// Swiped left - go to next
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
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-black/30 backdrop-blur-sm pointer-events-none">
					<p className="font-cormorant text-white text-sm">
						{currentIndex + 1} / {totalPhotos}
					</p>
				</div>

				{/* Swipe indicator hint (shows on first photo) */}
				{currentIndex === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: [0, 0.6, 0] }}
						transition={{ duration: 2, delay: 0.5 }}
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm pointer-events-none"
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
		<section className="relative min-h-screen w-full overflow-hidden px-3 md:px-6 py-10 lg:py-20">
			<div ref={ref} className="relative mx-auto max-w-7xl">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.8 }}
					className="mb-6 md:mb-8 lg:mb-10 text-center px-4"
				>
					<h2 className="font-playfair mb-1 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#3a3a3a]">
						Sweet Memories
					</h2>

					<div className="mx-auto h-0.5 lg:h-1 w-40 sm:w-48 lg:w-60 bg-linear-to-r from-transparent via-[#d4a5a5] to-transparent mb-2 rounded-full" />
				</motion.div>

				{/* Photo Grid */}
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
					{photos.map((photo, index) => (
						<PhotoCard
							key={photo.id}
							photo={photo}
							onClick={() => setSelectedPhoto(index)}
							index={index}
						/>
					))}
				</div>
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
