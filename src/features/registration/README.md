# Registration Feature

The registration feature handles user account creation for students, alumni, and companies in the ITI Portal.

## Structure

```
registration/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   ├── forms/          # Form-specific components
│   └── ui/             # Basic UI components
├── hooks/              # Custom hooks for state and logic
├── pages/              # Full page components
├── services/           # API and external service calls
├── types/              # Type definitions
├── utils/              # Helper functions and utilities
└── constants/          # Feature-specific constants
```

## Features

- Multi-step registration flow
- Role-based registration (Student, Alumni, Company)
- Form validation with Yup schemas
- Email verification process
- Responsive design with animations

## Usage

```javascript
import { RegistrationPage } from '../features/registration';

// Use in routing
<Route path="/register" component={RegistrationPage} />
```

## Components

### Forms
- `AccountTypeForm` - Role selection and basic credentials
- `PersonalInfoForm` - Role-specific personal information
- `SecurityForm` - Additional security information (excluding companies)
- `ReviewForm` - Final review before submission

### Common
- `ProgressSteps` - Multi-step progress indicator
- `RegistrationHeader` - Consistent header component

### UI
- `FormField` - Standardized form input component
- `FormSection` - Section wrapper for forms
- `StepNavigation` - Navigation between steps

## Hooks

- `useRegistrationForm` - Main form state management
- `useFormValidation` - Validation logic
- `useStepNavigation` - Step navigation logic

## API Services

- `registrationAPI` - User registration endpoints
- `emailVerificationAPI` - Email verification endpoints
