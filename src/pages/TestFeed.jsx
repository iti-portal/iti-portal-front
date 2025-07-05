/**
 * Test page for the achievements feed functionality
 */

import React from 'react';
import AchievementsFeed from '../features/achievements/pages/AchievementsFeed';

const TestFeed = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Achievements Feed Test</h1>
        <AchievementsFeed />
      </div>
    </div>
  );
};

export default TestFeed;
