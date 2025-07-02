/**
 * ViewAchievements Page
 * Professional achievements listing for community members with Twitter-like feed
 */

import React from 'react';
import Navbar from '../../../components/Layout/Navbar';
import AchievementsFeed from './AchievementsFeed';

const ViewAchievements = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <AchievementsFeed />
    </div>
  );
};

export default ViewAchievements;
