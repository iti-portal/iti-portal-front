import React from 'react';
import Navbar from '../../../components/Layout/Navbar';
import AchievementsFeed from './AchievementsFeed';
import { motion } from 'framer-motion';

const ViewAchievements = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 relative overflow-hidden">
        <Navbar />
        {/* Decorative background elements from ExploreItians design */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10 rounded-full blur-3xl opacity-50 -z-0"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-[#203947]/10 to-[#901b20]/10 rounded-full blur-3xl opacity-50 -z-0"></div>

        {/* Redesigned Hero Section */}
        <section className="text-center pt-24 pb-28 px-4">
             <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#901b20] to-[#203947]">Achievements</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Discover and celebrate the professional milestones of our community.</p>
        </section>

        {/* Main content area, overlapping the hero */}
        <main className="w-full max-w-7xl mx-auto px-4 pb-16 mt-[-80px] relative z-10">
          <AchievementsFeed />
        </main>
    </div>
  );
};

export default ViewAchievements;