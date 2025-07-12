# Project Components Documentation

## Overview
The Projects & Portfolio section has been refactored into modular components following the same pattern as the Education, Experience, and Certificates sections.

## Components

### ProjectSection.jsx
- **Purpose**: Main container component for displaying the projects list
- **Features**:
  - Displays list of projects using ProjectItem components
  - Shows empty state when no projects exist
  - Contains "Add Project" button with professional styling
  - Scrollable container with custom scrollbar styling (max-height: 500px)
  - Consistent with other section components

### ProjectItem.jsx
- **Purpose**: Individual project display component
- **Features**:
  - Shows project title, category/type, and description
  - Displays technologies used as styled badges (shows first 4, with "+X more" for others)
  - Shows clickable links for live demo and GitHub repository
  - Displays project image preview (if available) with proper aspect ratio
  - Edit and Delete action buttons with hover effects
  - Responsive design with proper spacing and typography
  - Uses ITI color scheme and consistent styling

### ProjectForm.jsx
- **Purpose**: Form component for adding/editing projects in modal
- **Features**:
  - Comprehensive form validation for required and optional fields
  - URL validation for project and GitHub links
  - Image upload with preview functionality (2MB limit)
  - Technologies input with helpful placeholder and guidance
  - Error handling and display with proper styling
  - Image removal functionality
  - Support for both add and edit modes
  - Responsive grid layout for form fields

## Modal Integration
- Uses the shared Modal component with React Portal for full-screen overlay
- No Framer Motion animations to prevent conflicts
- Larger modal size (max-w-4xl) to accommodate the comprehensive project form
- Proper scroll locking when modal is open
- Keyboard navigation support (ESC to close)

## Key Features

### Form Validation
- **Required fields**: Title, description, technologies used
- **Optional fields**: Category, project URL, GitHub URL, image
- **URL validation**: Proper format checking for project and GitHub URLs
- **Image validation**: File size limit (2MB) and type checking

### Image Handling
- File upload with preview functionality
- Base64 encoding for storage (as per original implementation)
- Image removal capability
- Proper error handling for oversized files

### Technology Display
- Input as comma-separated string
- Display as styled badges in ProjectItem
- Truncation with "more" indicator for better UI

## Usage in ProjectsAndPortfolioForm.js
The main form now uses these modular components with:
- State management for modal visibility and editing mode
- Proper data flow between components
- Consistent error handling
- Integration with existing projects system
- Clean separation of concerns

## Benefits
1. **Modularity**: Each component has a single, focused responsibility
2. **Reusability**: Components can be easily reused or extended
3. **Maintainability**: Easier to update and debug individual components
4. **Consistency**: Follows the same pattern as other sections (Education, Experience, Certificates)
5. **User Experience**: Modal-based editing provides better UX with more space for complex forms
6. **Responsive Design**: All components work well across different screen sizes
7. **Professional Styling**: Consistent with ITI branding and design system

## Technical Implementation
- Uses React hooks for state management
- Proper event handling and form submission
- File reader API for image processing
- Error boundary considerations
- Accessibility features (labels, ARIA attributes, keyboard navigation)
- Performance optimizations (proper key props, avoiding unnecessary re-renders)
