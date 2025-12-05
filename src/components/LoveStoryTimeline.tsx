'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface TimelineEvent {
	date: string;
	title: string;
	description: string;
	icon?: 'heart' | 'sparkles';
}

const timelineEvents: TimelineEvent[] = [
	{
		date: "First Met",
		title: "Where It All Began",
		description: "Our paths crossed for the first time, and little did we know, it was the beginning of forever.",
		icon: 'sparkles'
	},
	{
		date: "First Date",
		title: "A Magical Evening",
		description: "Coffee, conversation, and countless smiles. We knew there was something special between us.",
		icon: 'heart'
	},
	{
		date: "The Proposal",
		title: "Forever Starts Now",
		description: "Under the stars, with hearts full of love, we decided to spend our lives together.",
		icon: 'heart'
	},
	{
		date: "December 14, 2025",
		title: "Wedding Reception",
		description: "Celebrating our love with family and friends. Join us as we begin this beautiful journey together.",
		icon: 'sparkles'
	}
];

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-20px" });
	const isEven = index % 2 === 0;

	const cardVariants = {
		hidden: { opacity: 0, y: 50, scale: 0.95 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.6,
				ease: [0.25, 0.46, 0.45, 0.94] as const,
				delay: index * 0.15
			}
		}
	};

	const iconVariants = {
		hidden: { scale: 0, rotate: -180 },
		visible: {
			scale: 1,
			rotate: 0,
			transition: {
				type: "spring" as const,
				stiffness: 200,
				damping: 15,
				delay: index * 0.15 + 0.3
			}
		}
	};

	const Icon = event.icon === 'sparkles' ? Sparkles : Heart;

	return (
		<div ref={ref} className="relative">
			{/* Mobile & Tablet Layout */}
			<div className="lg:hidden">
				<div className="flex gap-3 sm:gap-4">
					{/* Left Timeline */}
					<div className="flex flex-col items-center">
						{/* Icon Circle */}
						<div className="relative z-10 flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#9caf88] via-[#b5a491] to-[#d4a5a5] shadow-2xl ring-8 ring-[#faf8f3]">
							<Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="currentColor" />

							{/* Pulsing effect */}
							<motion.div
								animate={{
									scale: [1, 1.2, 1],
									opacity: [0.5, 0, 0.5]
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: "easeInOut"
								}}
								className="absolute inset-0 rounded-full bg-[#d4a5a5]"
							/>
						</div>

						{/* Connecting Line */}
						{index < timelineEvents.length - 1 && (
							<motion.div
								initial={{ scaleY: 0 }}
								animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
								transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
								className="h-full w-0.5 flex-1 origin-top bg-linear-to-b from-[#d4a5a5] via-[#b5a491] to-[#9caf88] mt-2"
								style={{ minHeight: '60px' }}
							/>
						)}
					</div>

					{/* Content Card */}
					<motion.div
						variants={cardVariants}
						initial="hidden"
						animate={isInView ? "visible" : "hidden"}
						whileHover={{ scale: 1.02, y: -4 }}
						whileTap={{ scale: 0.98 }}
						className="group flex-1 mb-4 sm:mb-6 md::mb-10"
					>
						<div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-white to-[#faf8f3] p-4 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-[#d4a5a5]/20">
							{/* Decorative gradient overlay */}
							<div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#d4a5a5]/10 to-transparent rounded-full blur-2xl -mr-16 -mt-16" />

							{/* Date Badge */}
							<div className="relative mb-1 inline-block">
								<div className="rounded-full bg-linear-to-r from-[#9caf88]/20 to-[#d4a5a5]/20 px-4 py-0.5 backdrop-blur-sm">
									<p className="font-script text-sm sm:text-base text-[#3a3a3a] font-medium">
										{event.date}
									</p>
								</div>
							</div>

							{/* Title */}
							<h3 className="font-playfair relative text-xl sm:text-2xl font-bold text-[#3a3a3a] leading-tight">
								{event.title}
							</h3>

							{/* Description */}
							<p className="font-cormorant relative text-base sm:text-lg leading-relaxed text-[#3a3a3a]/70">
								{event.description}
							</p>

							{/* Decorative bottom accent */}
							<div className="mt-4 h-1 w-24 rounded-full bg-linear-to-r from-[#9caf88] to-[#d4a5a5]" />

							{/* Corner decorations */}
							<div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 h-5 w-5 md:h-8 md:w-8 border-b-2 border-r-2 border-[#9caf88]/30" />
						</div>
					</motion.div>
				</div>
			</div>

			{/* Desktop Layout */}
			<div className="hidden lg:block">
				<div className={`grid grid-cols-2 gap-20 items-center ${!isEven ? 'direction-rtl' : ''}`}>
					{/* Content */}
					<motion.div
						variants={cardVariants}
						initial="hidden"
						animate={isInView ? "visible" : "hidden"}
						whileHover={{ scale: 1.03, y: -8 }}
						className={`${isEven ? 'text-right' : 'col-start-2 text-left'} group`}
					>
						<div className={`inline-block w-full max-w-lg ${isEven ? 'ml-auto' : 'mr-auto'}`}>
							<div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-white to-[#faf8f3] p-5 shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#d4a5a5]/20">
								{/* Date Badge */}
								<div className={`relative mb-1 ${isEven ? 'text-right' : 'text-left'}`}>
									<div className="inline-block rounded-full bg-linear-to-r from-[#9caf88]/20 to-[#d4a5a5]/20 px-5 py-1 backdrop-blur-sm">
										<p className="font-script text-lg text-[#3a3a3a] font-medium">
											{event.date}
										</p>
									</div>
								</div>

								{/* Title */}
								<h3 className="font-playfair relative text-3xl font-bold text-[#3a3a3a] leading-tight">
									{event.title}
								</h3>

								{/* Description */}
								<p className="font-cormorant relative text-lg leading-6 text-[#3a3a3a]/70 mb-4">
									{event.description}
								</p>

								{/* Decorative bottom accent */}
								<div className={`h-1.5 w-28 rounded-full bg-linear-to-r from-[#9caf88] to-[#d4a5a5] ${isEven ? 'ml-auto' : 'mr-auto'}`} />
							</div>
						</div>
					</motion.div>

					{/* Center Icon (Desktop) */}
					<motion.div
						variants={iconVariants}
						initial="hidden"
						animate={isInView ? "visible" : "hidden"}
						className={`absolute left-1/2 -translate-x-1/2 z-20 ${isEven ? 'col-start-2' : 'col-start-1'}`}
					>
						<div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-[#9caf88] via-[#b5a491] to-[#d4a5a5] shadow-2xl ring-8 ring-[#faf8f3]">
							<Icon className="h-7 w-7 text-white" fill="currentColor" />

							{/* Pulsing effect */}
							<motion.div
								animate={{
									scale: [1, 1.2, 1],
									opacity: [0.5, 0, 0.5]
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: "easeInOut"
								}}
								className="absolute inset-0 rounded-full bg-[#d4a5a5]"
							/>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

export default function LoveStoryTimeline() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-50px" });

	return (
		<section className="relative min-h-screen w-full overflow-hidden px-4 py-6 lg:py-16">

			<div ref={ref} className="relative mx-auto max-w-6xl">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.8 }}
					className="mb-6 md:mb-8 lg:mb-16 text-center px-4"
				>
					<h2 className="font-playfair mb-1 lg:mb-2 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#3a3a3a]">
                        Our Love Story
                    </h2>

					<div className="mx-auto h-0.5 lg:h-1 w-40 sm:w-48 lg:w-60 bg-linear-to-r from-transparent via-[#d4a5a5] to-transparent sm:mb-1 lg:mb-2 rounded-full" />

					<p className="font-cormorant text-lg sm:text-xl lg:text-2xl text-[#3a3a3a]/70 max-w-2xl mx-auto leading-5">
						Every love story is beautiful, but ours is our favorite
					</p>
				</motion.div>

				{/* Timeline */}
				<div className="relative">
					{/* Vertical Line (Desktop Only) */}
					<div className="absolute left-1/2 top-0 hidden lg:block h-full w-1 -translate-x-1/2 bg-linear-to-b from-transparent via-[#d4a5a5] to-transparent rounded-full">
						<div className="absolute inset-0 bg-linear-to-b from-[#9caf88] via-[#d4a5a5] to-[#9caf88] opacity-50 rounded-full" />
					</div>

					{/* Timeline Items */}
					<div className="space-y-0 lg:space-y-4">
						{timelineEvents.map((event, index) => (
							<TimelineItem key={index} event={event} index={index} />
						))}
					</div>
				</div>

				{/* Decorative End */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
					transition={{ duration: 0.6, delay: 0.8 }}
					className="mt-6 sm:mt-8 lg:mt-12 text-center"
				>
					<div className="mx-auto h-px sm:h-0.5 w-48 sm:w-64 lg:w-80 bg-linear-to-r from-transparent via-[#d4a5a5] to-transparent mb-2" />

					<motion.div
						animate={{
							scale: [1, 1.05, 1],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "easeInOut"
						}}
					>
						<p className="font-script text-xl sm:text-2xl lg:text-3xl text-[#3a3a3a]/60">
							To be continued...
						</p>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
