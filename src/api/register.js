export async function submitRegistration({ formData, setError, navigate, setIsSubmitting }) {
  setIsSubmitting(true);
  setError('');

  // Determine API endpoint based on role
  const apiEndpoint = formData.role === 'company'
    ? '/auth/register-company'
    : '/auth/register';

  // Transform frontend data to match backend expectations
  let backendData;
  if (formData.role === 'company') {
    backendData = {
      company_name: formData.company_name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      phone: formData.phone,
      ...(formData.location && { location: formData.location }),
      ...(formData.website && { website: formData.website }),
      ...(formData.description && { description: formData.description }),
      ...(formData.industry && { industry: formData.industry }),
      ...(formData.company_size && { company_size: formData.company_size }),
      ...(formData.established_at && { established_at: formData.established_at })
    };
  } else {
    backendData = {
      email: formData.email,
      role: formData.role,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      governorate: formData.governorate,
      username:
        formData.username
          ? formData.username.replace(/[^\w]/g, '_')
          : `${formData.role}_${formData.firstName.replace(/[^\w]/g, '_')}_${Date.now()}`,
      ...(formData.intake && { intake: formData.intake }),
      ...(formData.track && { track: formData.track }),
      ...(formData.student_status && { student_status: formData.student_status }),
      ...(formData.graduation_date && { graduation_date: formData.graduation_date }),
      ...(formData.accountType && { account_type: formData.accountType })
    };
  }

  // Remove undefined/null values
  Object.keys(backendData).forEach(key => {
    if (backendData[key] === undefined || backendData[key] === null || backendData[key] === '') {
      delete backendData[key];
    }
  });

  // Use FormData only for student registration with files
  const hasFiles = (formData.role !== 'company') && (formData.idPhotoFront || formData.idPhotoBack);
  let body, headers;

  if (hasFiles) {
    body = new FormData();
    Object.entries(backendData).forEach(([key, value]) => {
      body.append(key, value);
    });
    if (formData.idPhotoFront) body.append('nid_front', formData.idPhotoFront);
    if (formData.idPhotoBack) body.append('nid_back', formData.idPhotoBack);
    headers = {};
  } else {
    body = JSON.stringify(backendData);
    headers = { 'Content-Type': 'application/json' };
  }

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api'}${apiEndpoint}`,
      {
        method: 'POST',
        headers: {
          ...headers,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body,
        redirect: 'manual'
      }
    );

    const contentType = response.headers.get('content-type');
    let result;
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const textResult = await response.text();
      result = { message: textResult };
    }

    if (response.ok) {
      if (result.success !== false) {
        navigate('/verify-email', { state: { email: formData.email } });
      } else {
        setError(result.message || 'Registration failed');
      }
    } else {
      if (response.status === 422) {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(', ');
          setError(`Validation errors: ${errorMessages}`);
        } else if (result.message) {
          setError(`Validation error: ${result.message}`);
        } else {
          setError('Please check your input data and try again.');
        }
      } else {
        setError(result.message || `Server error: ${response.status}`);
      }
    }
  } catch (error) {
    setError('Network error occurred. Please check your connection and try again.');
  } finally {
    setIsSubmitting(false);
  }
}