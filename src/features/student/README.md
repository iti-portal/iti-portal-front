# Student Feature

This feature handles all student-related functionality within the ITI Portal application.

## Folder Structure

- `/components` - Reusable UI components specific to the student feature
  - `/profile` - Components for student profile viewing
  - `/profile/edit` - Components for student profile editing
- `/data` - Mock data and constants
- `/hooks` - Custom React hooks
- `/pages` - Page components that compose multiple components
- `/services` - API services and data fetching
- `/store` - Redux slices and state management
- `/types` - TypeScript type definitions
- `/utils` - Utility functions

## Main Pages

- `ProfilePage` - Displays the student's profile information
- `EditProfilePage` - Allows students to edit their profile information

## Getting Started

Import components from the index.js file:

```jsx
import { ProfilePage, EditProfilePage } from 'features/student';
```

## Key Components

### Profile Components

- `ProfileHeader` - Displays the student's banner image, profile photo, and basic info
- `ProfileSectionCard` - Card layout for profile sections
- `ProfileNavigation` - Navigation tabs for different profile sections

### Profile Edit Components

- `PersonalInfoForm` - Form for editing personal information
- `ContactInfoForm` - Form for editing contact information
- `EducationAndExperienceForm` - Form for editing education and work experience
- `SkillsAndCertificatesForm` - Form for managing skills and certificates
- `ProjectsAndPortfolioForm` - Form for managing projects and portfolio items
