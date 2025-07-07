# Home Page Animation & Popular Articles Integration

## Overview
This update implements scroll-based animations for all Home page components and integrates popular articles from the backend API.

## New Features

### 1. Popular Articles Integration
- **ArticlesInsights Component**: Now fetches data from `http://127.0.0.1:8000/api/articles/popular`
- **Articles Service**: Created `articlesService.js` with full CRUD operations
- **Dynamic Content**: Displays real articles with proper formatting and metadata
- **Error Handling**: Comprehensive loading states and error recovery

### 2. Scroll-Based Animations
- **useScrollAnimation Hook**: Reusable hook for intersection observer animations
- **Multiple Animation Types**: fadeInUp, fadeInDown, fadeInLeft, fadeInRight, scaleIn, slideInUp
- **Staggered Animations**: Components appear progressively with customizable delays
- **Performance Optimized**: Uses IntersectionObserver API for efficient scroll detection

### 3. Enhanced Components
All Home page components now include:
- **Smooth Entrance Animations**: Components fade in when scrolled into view
- **Staggered Card Animations**: Individual cards animate with delays
- **Improved Visual Hierarchy**: Better spacing and transition effects
- **Enhanced User Experience**: Progressive disclosure of content

## Files Modified

### New Files
- `src/hooks/useScrollAnimation.js` - Reusable scroll animation hook
- `src/services/articlesService.js` - Articles API service

### Updated Files
- `src/components/Home/ArticlesInsights.jsx` - Popular articles integration + animations
- `src/components/Home/PopularAchievements.jsx` - Added scroll animations
- `src/components/Home/HeroSection.jsx` - Added entrance animations
- `src/components/Home/StatsSection.jsx` - Added staggered stat animations
- `src/components/Home/JobRecommendations.jsx` - Added card animations
- `src/components/Home/FeaturedCompanies.jsx` - Added company card animations
- `src/services/index.js` - Added articles service exports

## Animation Configuration

### Available Animation Types
```javascript
const animations = {
  fadeInUp: { hidden: 'opacity-0 translate-y-8', visible: 'opacity-100 translate-y-0' },
  fadeInDown: { hidden: 'opacity-0 -translate-y-8', visible: 'opacity-100 translate-y-0' },
  fadeInLeft: { hidden: 'opacity-0 -translate-x-8', visible: 'opacity-100 translate-x-0' },
  fadeInRight: { hidden: 'opacity-0 translate-x-8', visible: 'opacity-100 translate-x-0' },
  fadeIn: { hidden: 'opacity-0', visible: 'opacity-100' },
  scaleIn: { hidden: 'opacity-0 scale-95', visible: 'opacity-100 scale-100' },
  slideInUp: { hidden: 'translate-y-full opacity-0', visible: 'translate-y-0 opacity-100' }
};
```

### Usage Example
```javascript
const { ref, animationClasses } = useScrollAnimation({
  animationType: 'fadeInUp',
  delay: 150,
  duration: 600,
  threshold: 0.1
});
```

## API Integration

### Popular Articles Endpoint
- **URL**: `http://127.0.0.1:8000/api/articles/popular`
- **Method**: GET
- **Authentication**: Bearer token required
- **Response**: Array of article objects with author, content, metadata

### Data Structure
```javascript
{
  id: 1,
  title: "Article Title",
  content: "Article content...",
  author: { id: 3, email: "author@example.com" },
  like_count: 15,
  published_at: "2025-05-29T00:00:00.000000Z",
  created_at: "2025-06-29T16:43:07.000000Z",
  featured_image: null,
  status: "published"
}
```

## Performance Considerations

1. **Intersection Observer**: Efficient scroll detection without performance impact
2. **Lazy Animation**: Components only animate when they enter the viewport
3. **Debounced Animations**: Prevents excessive animation triggers
4. **Memory Management**: Proper cleanup of observers on component unmount

## Browser Compatibility

- **Modern Browsers**: Full support for all animation features
- **Legacy Support**: Graceful degradation for older browsers
- **Mobile Optimized**: Touch-friendly animations with reduced motion support

## Future Enhancements

1. **Animation Presets**: Pre-configured animation combinations for common use cases
2. **Accessibility**: Respect for `prefers-reduced-motion` system preference
3. **Advanced Triggers**: Custom trigger conditions beyond intersection
4. **Animation Sequences**: Chained animations for complex entrance effects

## Testing

All components have been tested for:
- ✅ Proper animation timing and sequencing
- ✅ Error handling for API failures
- ✅ Loading states and user feedback
- ✅ Responsive design across screen sizes
- ✅ Performance impact assessment
