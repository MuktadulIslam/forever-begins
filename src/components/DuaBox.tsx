'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';

export default function DuaBox() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission - Replace with actual backend
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-[#d4a5a5]/10 to-[#9caf88]/10 px-4 py-24">
      <div ref={ref} className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="font-playfair mb-4 text-4xl font-bold text-[#3a3a3a] sm:text-5xl md:text-6xl">
            Send Your Blessings
          </h2>
          <p className="font-cormorant text-xl text-[#3a3a3a]/70 sm:text-2xl">
            Your prayers and good wishes mean the world to us
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-2xl bg-white p-8 shadow-2xl sm:p-12"
        >
          {isSubmitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12 text-center"
            >
              <CheckCircle2 className="mx-auto mb-6 h-20 w-20 text-green-500" />
              <h3 className="font-playfair mb-3 text-2xl font-semibold text-[#3a3a3a]">
                Thank You!
              </h3>
              <p className="font-cormorant text-lg text-[#3a3a3a]/70">
                Your blessings have been received. We appreciate your love and support!
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="font-cormorant mb-2 block text-sm font-semibold text-[#3a3a3a]">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="font-cormorant w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-colors focus:border-[#9caf88] focus:outline-none"
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="font-cormorant mb-2 block text-sm font-semibold text-[#3a3a3a]">
                  Your Email <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="font-cormorant w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition-colors focus:border-[#9caf88] focus:outline-none"
                />
              </div>

              {/* Message Input */}
              <div>
                <label className="font-cormorant mb-2 block text-sm font-semibold text-[#3a3a3a]">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share your blessings and prayers for the couple..."
                  rows={6}
                  required
                  className="font-cormorant w-full rounded-lg border-2 border-gray-200 px-4 py-3 resize-none transition-colors focus:border-[#9caf88] focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="font-cormorant flex w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#9caf88] to-[#7a9070] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Blessings
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Decorative Element */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="font-script text-2xl text-[#3a3a3a]/60">
            May your prayers light our path
          </p>
        </motion.div>
      </div>
    </section>
  );
}
