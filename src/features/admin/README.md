# Admin Feature

This feature handles all admin-related functionality for the ITI Portal.

## Structure

- `components/`: Contains all UI components specific to the admin feature
  - `dashboard/`: Dashboard-specific components
  - `layout/`: Layout components like sidebar, navbar, and footer
- `hooks/`: Custom React hooks for admin-specific functionality
- `pages/`: Page components that compose the admin UI
- `services/`: API service functions for admin operations
- `types/`: TypeScript types and interfaces
- `utils/`: Utility functions and helpers
- `index.js`: Entry point for the admin feature, exporting all necessary components

## Usage

Import components from this feature using:

```jsx
import { AdminDashboardPage, AdminSidebar } from '../features/admin';
```
