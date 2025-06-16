# Auth Feature

Modern authentication feature with proper folder structure and reusable components.

## 📁 Folder Structure

```
src/features/auth/
├── components/
│   ├── forms/
│   │   ├── LoginForm.jsx          # Login form component
│   │   ├── ForgotPasswordForm.jsx # Forgot password form (to be migrated)
│   │   └── ResetPasswordForm.jsx  # Reset password form (to be migrated)
│   └── ui/
│       ├── AuthLayout.jsx         # Shared auth page layout
│       ├── AuthFormHeader.jsx     # Auth form header with logo
│       ├── AuthInputField.jsx     # Reusable input field
│       └── AuthButton.jsx         # Reusable button component
├── hooks/
│   ├── useLogin.js               # Login form logic
│   ├── useForgotPassword.js      # Forgot password logic (to be created)
│   └── useResetPassword.js       # Reset password logic (to be created)
├── pages/
│   ├── LoginPage.jsx             # Modern login page
│   ├── ForgotPasswordPage.jsx    # Forgot password page (to be migrated)
│   └── ResetPasswordPage.jsx     # Reset password page (to be migrated)
├── services/
│   └── authAPI.js                # Centralized auth API calls
├── types/
│   └── auth.types.js             # Auth type definitions
├── utils/
│   └── authHelpers.js            # Auth utility functions
└── index.js                      # Feature exports
```

## 🔧 Components

### UI Components
- **AuthLayout**: Shared two-panel layout for auth pages
- **AuthFormHeader**: Header with logo, title, and description
- **AuthInputField**: Reusable form input with validation
- **AuthButton**: Consistent button styling with loading states

### Form Components
- **LoginForm**: Complete login form with validation
- **ForgotPasswordForm**: (To be created)
- **ResetPasswordForm**: (To be created)

## 🎣 Hooks

- **useLogin**: Manages login form state and submission
- **useForgotPassword**: (To be created)
- **useResetPassword**: (To be created)

## 🌐 Services

- **authAPI**: Centralized authentication API calls
  - loginUser()
  - forgotPassword()
  - resetPassword()
  - logoutUser()
  - getCurrentUser()

## 📝 Types

- Authentication form data structures
- Error handling types
- User roles and permissions
- Auth state management

## 🛠️ Utils

- Form validation helpers
- Role-based routing
- Permission checking
- Error formatting

## 🚀 Usage

```jsx
import { LoginPage } from './features/auth';

// Use in routes
<Route path="/login" element={<LoginPage />} />
```

## 🔄 Migration Status

- ✅ Created modern folder structure
- ✅ Migrated Login.js to LoginPage.jsx
- ✅ Migrated ForgotPassword.js to ForgotPasswordPage.jsx
- ✅ Migrated ResetPassword.js to ResetPasswordPage.jsx
- ✅ Created index.js exports
- ✅ Updated routing to use new components
- ⏳ TODO: Remove legacy files after testing

## 🎨 Features

- Modern React patterns (hooks, functional components)
- Consistent styling and animations
- Reusable components
- Proper error handling
- Type definitions
- Centralized API calls
- Clean separation of concerns
