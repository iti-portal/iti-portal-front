/**
 * ViewAchievements Page
 * Professional achievements listing for community members with Twitter-like feed
 */

import React from 'react';
import Navbar from '../../../components/Layout/Navbar';
import AchievementsFeed from './AchievementsFeed';

const ViewAchievements = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50">
      <Navbar />
      <AchievementsFeed />
    </div>
  );
};

export default ViewAchievements;
