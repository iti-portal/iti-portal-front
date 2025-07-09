/**
 * ViewAchievements Page
 * Professional achievements listing for community members with Twitter-like feed
 */

import React from 'react';
import Navbar from '../../../components/Layout/Navbar';
import AchievementsFeed from './AchievementsFeed';
import { motion } from 'framer-motion';

const ViewAchievements = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#fbeee6] flex flex-col">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex-1 flex flex-col"
      >
        <section className="relative flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-[#fff7f0] via-[#fbeee6] to-[#f7faff]">
          <h1 className="text-4xl font-bold bg-gradient-to-br from-[#203947] via-[#901b20] to-[#203947] bg-clip-text text-transparent py-6">Achievements</h1>
          <p className="text-lg md:text-xl text-gray-500 text-center max-w-2xl mb-10">Discover and celebrate the professional milestones of our community members.</p>
        </section>
        <main className="flex-1 w-full max-w-6xl mx-auto px-2 md:px-0 pb-16">
          <div className="rounded-xl bg-white/90 shadow-md border border-gray-100 p-0 md:p-0 mt-[-60px] relative z-10">
            <AchievementsFeed />
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default ViewAchievements;
