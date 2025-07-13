import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../services/authAPI';
import { useAuth } from '../../../contexts/AuthContext';
import {
  initializeLoginData,
  initializeAuthErrors,
  formatAuthError,
} from '../utils/authHelpers';

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState(initializeLoginData());
  const [errors, setErrors] = useState(initializeAuthErrors());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: '',
    message: '',
    persistent: false,
  });

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }
    },
    [errors]
  );

  const showAlert = useCallback((type, message, persistent = false) => {
    setAlert({ show: true, type, message, persistent });
    if (!persistent) {
      setTimeout(
        () =>
          setAlert({ show: false, type: '', message: '', persistent: false }),
        4000
      );
    }
  }, []);

  const handleCloseAlert = useCallback(() => {
    setAlert({ show: false, type: '', message: '', persistent: false });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors(initializeAuthErrors());
    setAlert({ show: false, type: '', message: '', persistent: false });
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      clearErrors();

      try {
        const { ok, data } = await loginUser(formData);

        if (ok && data.success && data.data?.token) {
          const user = data.data.user || data.data;
          const role = user.role;

          login(user, data.data.token); // store user and token in context

          if (role !== 'staff' &&role !== 'admin' &&!user.isVerified) {
            showAlert(
              'warning',
              data.message || 'Please verify your email to complete the login.'
            );
            setTimeout(() => {
              navigate('/verify-email', { state: { email: formData.email } });
            }, 1500);
            return;
          }

          showAlert('success', 'Login successful! Redirecting...');

          setTimeout(() => {
            switch (role) {
              case 'admin':
              case 'staff':
                navigate('/admin/dashboard');
                break;
              case 'student':
              case 'company':
              case 'alumni':
                navigate('/');
                break;
              default:
                navigate('/unauthorized');
            }
          }, 1500);
        } else {
          showAlert('error', data.message || 'Login failed');
        }
      } catch (error) {
        showAlert('error', formatAuthError(error));
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, navigate, clearErrors, showAlert, login]
  );

  const resetForm = useCallback(() => {
    setFormData(initializeLoginData());
    setErrors(initializeAuthErrors());
    setAlert({ show: false, type: '', message: '', persistent: false });
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    alert,
    handleChange,
    handleSubmit,
    showAlert,
    handleCloseAlert,
    clearErrors,
    resetForm,
  };
};
