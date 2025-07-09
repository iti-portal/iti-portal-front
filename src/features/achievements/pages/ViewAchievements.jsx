/**
 * ViewAchievements Page
 * Professional achievements listing for community members with Twitter-like feed
 */

import React from 'react';
import Navbar from '../../../components/Layout/Navbar';
import AchievementsFeed from './AchievementsFeed';

const ViewAchievements = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#fbeee6]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center tracking-tight">Achievements</h1>
        <p className="text-gray-500 text-center mb-10">Discover and celebrate the professional milestones of our community members.</p>
        <div className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-md p-4 md:p-8 border border-gray-100">
          <AchievementsFeed />
        </div>
      </div>
    </div>
  );
};

export default ViewAchievements;
