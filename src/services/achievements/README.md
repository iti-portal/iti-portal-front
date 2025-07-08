# Achievements Service Module

The achievements service has been refactored into a modular structure for better maintainability and organization.

## Structure

```
src/services/achievements/
├── index.js                      # Main entry point - exports all functions
├── achievements-api.js           # Core CRUD operations
├── achievements-interactions.js  # Likes and comments functionality
├── achievements-utils.js         # Utility functions and data transformation
└── README.md                    # This documentation
```

## Files Overview

### `achievements-api.js`
Contains all core CRUD operations for achievements:
- `getAchievements()` - Get all achievements (public feed)
- `getMyAchievements()` - Get user's own achievements
- `getAllAchievements()` - Alias for getAchievements (compatibility)
- `getConnectionsAchievements()` - Get achievements from user's network
- `getPopularAchievements()` - Get popular achievements
- `getAchievementDetails()` - Get single achievement details
- `createAchievement()` - Create new achievement
- `updateAchievement()` - Update existing achievement
- `deleteAchievement()` - Delete achievement

### `achievements-interactions.js`
Handles user interactions with achievements:
- `likeAchievement()` - Like an achievement
- `unlikeAchievement()` - Unlike an achievement (same API, toggles state)
- `addComment()` - Add comment to achievement
- `getComments()` - Get comments for achievement
- `deleteComment()` - Delete a comment

### `achievements-utils.js`
Utility functions for data handling:
- `mapFrontendTypeToBackend()` - Map frontend types to backend types
- `mapBackendTypeToFrontend()` - Map backend types to frontend types
- `transformAchievementData()` - Transform data for API submission
- `buildQueryParams()` - Build URL query parameters
- `validateAchievementData()` - Validate achievement data

### `index.js`
Main entry point that exports all functions from the other modules. Use this for imports to get all functionality.

## Usage

### For New Development
Import directly from the modular structure:

```javascript
// For all functions
import { getAchievements, createAchievement, likeAchievement } from './services/achievements/index.js';

// For specific functionality
import { getAchievements, createAchievement } from './services/achievements/achievements-api.js';
import { likeAchievement, addComment } from './services/achievements/achievements-interactions.js';
import { validateAchievementData } from './services/achievements/achievements-utils.js';
```

### For Existing Code (Backward Compatibility)
The original `achievementsService.js` file still works and re-exports all functions:

```javascript
// This still works - no changes needed
import { getAchievements, createAchievement, likeAchievement } from './services/achievementsService.js';
```

## Migration Guide

1. **No immediate changes required** - All existing imports will continue to work
2. **For new development** - Consider importing from the specific modules or from `./achievements/index.js`
3. **Gradual migration** - Update imports as you work on different parts of the codebase

## Benefits

- **Better Organization**: Related functions are grouped together
- **Easier Maintenance**: Smaller, focused files are easier to understand and modify
- **Improved Testability**: Each module can be tested independently
- **Better Tree Shaking**: Bundlers can better optimize unused code
- **Clear Separation of Concerns**: API operations, interactions, and utilities are clearly separated

## Backward Compatibility

The original `achievementsService.js` file has been maintained as a compatibility layer that re-exports all functions from the new modular structure. This ensures that existing code continues to work without any changes.
