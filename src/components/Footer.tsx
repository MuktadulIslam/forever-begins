'use client';

import { motion } from 'framer-motion';
import { RiFacebookCircleLine } from "react-icons/ri";
import { Heart, Mail, Share2, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';

export default function Footer() {
	const [showShareModal, setShowShareModal] = useState(false);
	const [websiteUrl, setWebsiteUrl] = useState('https://your-wedding-site.com');
	const [isMounted, setIsMounted] = useState(false);
	const [copied, setCopied] = useState(false);

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

	const copyToClipboard = () => {
		navigator.clipboard.writeText(websiteUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<footer className="relative w-full overflow-hidden bg-linear-to-br from-slate-800 via-slate-700 to-slate-800 px-4 pt-8 pb-2 text-white">
			<div className="relative mx-auto max-w-6xl">
				{/* Main Content Grid */}
				<div className="grid gap-10 md:grid-cols-3">
					{/* Left Column - Couple Info */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="text-center md:text-left"
					>
						<div className="mb-6">
							<h3 className="font-playfair mb-2 text-4xl font-bold tracking-wide">
								Hridoy <span className="font-script text-rose-300">&</span> Roksana
							</h3>
							<div className="mx-auto mt-3 h-px w-24 bg-linear-to-r from-transparent via-rose-300 to-transparent md:mx-0" />
						</div>
						<p className="font-cormorant mb-6 text-xl font-semibold text-rose-200">
							December 14, 2025
						</p>
						<p className="font-cormorant text-base leading-relaxed text-slate-300">
							Thank you for being part of our special day. Your presence and blessings mean everything to us as we begin this beautiful journey together.
						</p>
					</motion.div>

					{/* Center Column - Branding & Credits */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
						className="flex flex-col items-center justify-center text-center"
					>
						{/* Decorative Elements */}
						<div className="mb-3 flex items-center gap-3">
							<div className="h-px w-16 bg-linear-to-r from-transparent to-rose-300/50" />
							<motion.div
								animate={{ scale: [1, 1.2, 1] }}
								transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
								className="h-2 w-2 rounded-full bg-rose-300/70"
							/>
							<div className="h-px w-16 bg-linear-to-l from-transparent to-rose-300/50" />
						</div>

						{/* Made with Love */}
						<p className="font-script mb-4 flex items-center justify-center gap-2 text-xl text-slate-200">
							Made with{' '}
							<motion.span
								animate={{ scale: [1, 1.3, 1] }}
								transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
							>
								<Heart className="h-5 w-5 fill-rose-400 text-rose-400" />
							</motion.span>
							{' '}for a beautiful beginning
						</p>

						{/* Divider */}
						<div className="mb-6 h-px w-full max-w-xs bg-linear-to-r from-transparent via-slate-600 to-transparent" />

						{/* Creator Info */}
						<div className="space-y-3">
							<p className="font-cormorant text-sm uppercase tracking-widest text-slate-400">
								Created by
							</p>
							<p className="font-playfair text-2xl font-semibold text-white">
								Folify
							</p>
							<div className="flex items-center justify-center gap-6 pt-2">
								<motion.a
									href="mailto:folify@gmail.com"
									whileHover={{ scale: 1.1, y: -2 }}
									className="group flex items-center gap-2 transition-colors"
								>
									<div className="rounded-full bg-slate-700/50 p-2 transition-colors group-hover:bg-rose-400/20">
										<Mail className="h-4 w-4 text-slate-300 group-hover:text-rose-300" />
									</div>
									<span className="font-cormorant text-sm text-slate-300 group-hover:text-white">folify@example.com</span>
								</motion.a>
								<div className="h-6 w-px bg-slate-600" />
								<motion.a
									href="https://facebook.com/folify"
									target="_blank"
									rel="noopener noreferrer"
									whileHover={{ scale: 1.1, y: -2 }}
									className="group flex items-center gap-2 transition-colors"
								>
									<div className="rounded-full bg-slate-700/50 p-2 transition-colors group-hover:bg-rose-400/20">
										<RiFacebookCircleLine className="h-5 w-5 text-slate-300 group-hover:text-rose-300" />
									</div>
									<span className="font-cormorant text-sm text-slate-300 group-hover:text-white">Facebook</span>
								</motion.a>
							</div>
						</div>
					</motion.div>

					{/* Right Column - QR Code */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						viewport={{ once: true }}
						className="flex flex-col items-center justify-center"
					>
						<p className="font-cormorant mb-6 text-sm uppercase tracking-widest text-slate-300">
							Share Our Story
						</p>
						<motion.div
							whileHover={{ scale: 1.05 }}
							className="relative"
						>
							<div className="absolute -inset-1 rounded-xl bg-linear-to-r from-rose-300 to-pink-300 opacity-40 blur"></div>
							<div className="relative rounded-xl bg-white p-5 shadow-2xl">
								{isMounted ? (
									<QRCodeSVG
										value={websiteUrl}
										size={140}
										level="H"
										includeMargin={false}
									/>
								) : (
									<div className="h-[140px] w-[140px]" />
								)}
							</div>
						</motion.div>
						<motion.button
							onClick={handleShare}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="mt-6 flex items-center gap-2 rounded-full bg-linear-to-r from-rose-400 to-pink-400 px-6 py-3 font-cormorant text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
						>
							<Share2 className="h-4 w-4" />
							Share with friends
						</motion.button>
					</motion.div>
				</div>

				{/* Bottom Divider */}
				<motion.div
					initial={{ scaleX: 0 }}
					whileInView={{ scaleX: 1 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					viewport={{ once: true }}
					className="my-2 h-px w-full bg-linear-to-r from-transparent via-slate-600 to-transparent"
				/>

				{/* Copyright */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.8 }}
					viewport={{ once: true }}
					className="text-center"
				>
					<p className="font-cormorant text-sm text-slate-400">
						© 2025 Hridoy & Roksana. All rights reserved.
					</p>
				</motion.div>
			</div>

			{/* Decorative Blobs */}
			<div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-rose-400/10 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-pink-400/10 blur-3xl" />
			<div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/5 blur-3xl" />

			{/* Share Modal */}
			{showShareModal && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
					onClick={() => setShowShareModal(false)}
				>
					<motion.div
						initial={{ scale: 0.9, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.9, opacity: 0, y: 20 }}
						onClick={(e) => e.stopPropagation()}
						className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
					>
						{/* Gradient Header */}
						<div className="bg-linear-to-r from-rose-400 to-pink-400 px-6 py-8">
							<h3 className="font-playfair text-center text-2xl font-bold text-white">Share Our Wedding</h3>
							<p className="font-cormorant mt-2 text-center text-sm text-white/90">
								Spread the joy with friends and family
							</p>
						</div>

						{/* Content */}
						<div className="p-6">
							<p className="font-cormorant mb-4 text-sm text-slate-600">
								Copy the link below to share:
							</p>
							<div className="flex gap-2">
								<input
									type="text"
									value={websiteUrl}
									readOnly
									className="font-cormorant flex-1 rounded-lg border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-rose-300 focus:outline-none"
								/>
								<motion.button
									onClick={copyToClipboard}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="flex items-center gap-2 rounded-lg bg-linear-to-r from-rose-400 to-pink-400 px-6 py-3 font-cormorant text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
								>
									{copied ? (
										<>
											<Check className="h-4 w-4" />
											Copied!
										</>
									) : (
										<>
											<Copy className="h-4 w-4" />
											Copy
										</>
									)}
								</motion.button>
							</div>
						</div>

						{/* Close Button */}
						<button
							onClick={() => setShowShareModal(false)}
							className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white transition-all hover:bg-white/30"
						>
							<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</motion.div>
				</motion.div>
			)}
		</footer>
	);
}