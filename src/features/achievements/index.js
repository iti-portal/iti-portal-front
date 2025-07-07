/**
 * Achievements Feature Index
 * Central export point for the achievements feature
 */

// Pages
export { default as CreateAchievement } from './pages/CreateAchievement';
export { default as ViewAchievements } from './pages/ViewAchievements';
export { default as MyAchievements } from './pages/MyAchievements';


// Components
export { default as AchievementCard } from './components/common/AchievementCard';
export { default as AchievementTypeSelector } from './components/common/AchievementTypeSelector';
export { default as BaseAchievementForm } from './components/forms/BaseAchievementForm';

// Hooks
export { useAchievements } from './hooks/useAchievements';
export { useAchievementForm } from './hooks/useAchievementForm';

// Types and Constants
export * from './types/achievementTypes';
export * from './utils/achievementConstants';
export * from './utils/achievementHelpers';

// Services (when implemented)
export { achievementAPI } from './services/achievementAPI';
