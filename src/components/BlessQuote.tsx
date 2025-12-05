'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart } from 'lucide-react';

export default function BlessQuote() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section className="relative w-full bg-transparent px-2 py-6">
			<div ref={ref} className="relative z-10 mx-auto max-w-5xl">
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
					transition={{ duration: 0.8 }}
				>

					{/* Main blessing card */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="relative mx-auto max-w-3xl rounded-2xl border border-[#9caf88]/20 bg-white/60 p-6 md:p-10 shadow-xl backdrop-blur-sm"
					>
						{/* Corner decorations */}
						<div className="absolute left-3 top-3 md:left-4 md:top-4 h-5 w-5 md:h-8 md:w-8 border-l-2 border-t-2 border-[#9caf88]/30" />
						<div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 h-5 w-5 md:h-8 md:w-8 border-b-2 border-r-2 border-[#9caf88]/30" />

						<div className="space-y-2 md:space-y-4 text-center">
							<motion.p
								className="font-script leading-6 sm:leading-8 text-[#2f2f2f] text-xl sm:text-2xl md:text-3xl"
								initial={{ opacity: 0 }}
								animate={isInView ? { opacity: 1 } : { opacity: 0 }}
								transition={{ duration: 1, delay: 0.6 }}
							>
								May your love be modern enough to survive the times,
								<br />
								yet timeless enough to last forever.
								<br />
								<br />
								May your home be filled with laughter and joy,
								<br />
								your hearts with understanding and patience,
								<br />
								and your lives with endless blessings.
								<br />
								<br />
								May Allah bless your union with happiness,
								<br />
								guide you with wisdom, and surround you with love
								<br />
								throughout all the years to come.
							</motion.p>

							{/* Decorative bottom element */}
							<div className="flex items-center justify-center gap-3">
								<div className="h-px w-12 bg-linear-to-r from-transparent via-[#d4a5a5] to-transparent" />
								<Heart className="h-4 w-4 fill-[#d4a5a5] text-[#d4a5a5]" />
								<div className="h-px w-12 bg-linear-to-r from-transparent via-[#d4a5a5] to-transparent" />
							</div>

							{/* Attribution */}
							<motion.p
								className="font-script mt-3 mr-3 md:mr-6 text-right text-xs md:text-sm italic text-[#2f2f2f]"
								initial={{ opacity: 0 }}
								animate={isInView ? { opacity: 1 } : { opacity: 0 }}
								transition={{ duration: 1, delay: 1 }}
							>
								— From Your Beloved
							</motion.p>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
