'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart } from 'lucide-react';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    date: "First Met",
    title: "Where It All Began",
    description: "Our paths crossed for the first time, and little did we know, it was the beginning of forever."
  },
  {
    date: "First Date",
    title: "A Magical Evening",
    description: "Coffee, conversation, and countless smiles. We knew there was something special between us."
  },
  {
    date: "The Proposal",
    title: "Forever Starts Now",
    description: "Under the stars, with hearts full of love, we decided to spend our lives together."
  },
  {
    date: "December 14, 2025",
    title: "Wedding Reception",
    description: "Celebrating our love with family and friends. Join us as we begin this beautiful journey together."
  }
];

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative">
      <div className={`grid gap-8 md:grid-cols-2 md:gap-16 ${isLeft ? '' : 'md:grid-flow-dense'}`}>
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -50 : 50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`${isLeft ? 'md:text-right' : 'md:col-start-2'}`}
        >
          <div className={`inline-block rounded-lg bg-white p-6 shadow-lg ${isLeft ? 'md:mr-0' : 'md:ml-0'}`}>
            <p className="font-script mb-2 text-lg text-[#d4a5a5]">{event.date}</p>
            <h3 className="font-playfair mb-3 text-2xl font-bold text-[#3a3a3a]">{event.title}</h3>
            <p className="font-cormorant text-base leading-relaxed text-[#3a3a3a]/70">
              {event.description}
            </p>
          </div>
        </motion.div>

        {/* Center Dot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className={`absolute left-1/2 top-6 hidden -translate-x-1/2 md:block ${isLeft ? 'md:col-start-2' : ''}`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#9caf88] to-[#d4a5a5] shadow-lg">
            <Heart className="h-6 w-6 fill-white text-white" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoveStoryTimeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative min-h-screen w-full bg-gradient-to-b from-[#faf8f3] to-[#f5f1e8] px-4 py-24">
      <div ref={ref} className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <h2 className="font-playfair mb-4 text-4xl font-bold text-[#3a3a3a] sm:text-5xl md:text-6xl">
            Our Love Story
          </h2>
          <p className="font-cormorant text-xl text-[#3a3a3a]/70 sm:text-2xl">
            Every love story is beautiful, but ours is our favorite
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line (Desktop) */}
          <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#9caf88] via-[#d4a5a5] to-[#9caf88] md:block" />

          {/* Timeline Items */}
          <div className="space-y-16 md:space-y-24">
            {timelineEvents.map((event, index) => (
              <TimelineItem key={index} event={event} index={index} />
            ))}
          </div>
        </div>

        {/* Decorative End */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="mx-auto h-px w-64 bg-gradient-to-r from-transparent via-[#d4a5a5] to-transparent" />
          <p className="font-script mt-6 text-2xl text-[#3a3a3a]/60">To be continued...</p>
        </motion.div>
      </div>
    </section>
  );
}
