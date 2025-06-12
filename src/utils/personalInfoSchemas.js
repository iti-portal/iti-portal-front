import * as Yup from 'yup';

export const studentSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required').max(255, 'First name must be less than 256 characters'),
  lastName: Yup.string().required('Last name is required').max(255, 'Last name must be less than 256 characters'),
  phone: Yup.string().required('Phone is required').max(20, 'Phone must be less than 21 characters'),
  governorate: Yup.string().required('Governorate is required'),
  graduation_date: Yup.date().typeError('Graduation date must be a valid date'),
  student_status: Yup.string().oneOf(['current', 'graduate'], 'Student status must be current or graduate'),
});

export const alumniSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required').max(255, 'First name must be less than 256 characters'),
  lastName: Yup.string().required('Last name is required').max(255, 'Last name must be less than 256 characters'),
  phone: Yup.string().required('Phone is required').max(20, 'Phone must be less than 21 characters'),
  governorate: Yup.string().required('Governorate is required'),
  graduation_date: Yup.date().required('Graduation date is required').typeError('Graduation date must be a valid date'),
});

export const companySchema = Yup.object().shape({
  company_name: Yup.string().required('Company name is required').max(255, 'Company name must be less than 256 characters'),
  description: Yup.string().required('Description is required'),
  location: Yup.string().required('Location is required').max(255, 'Location must be less than 256 characters'),
  industry: Yup.string().max(255, 'Industry must be less than 256 characters'),
  company_size: Yup.string().max(50, 'Company size must be less than 51 characters'),
  website: Yup.string().url('Website must be a valid URL'),
  established_at: Yup.date().typeError('Established date must be a valid date'),
});

export const accountTypeSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email is invalid')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Confirm Password is required'),
  role: Yup.string()
    .oneOf(['student', 'alumni', 'company'], 'Role must be student, alumni, or company')
    .required('Role is required'),
});