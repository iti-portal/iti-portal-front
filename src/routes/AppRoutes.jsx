import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Layout from '../components/Layout/LayoutRegistration';
import { RegistrationPage, EmailVerificationPage } from '../features/registration';
import { LoginPage, ForgotPasswordPage, ResetPasswordPage } from '../features/auth';
import NotFound from '../pages/NotFound';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import UsersManagementPage from '../pages/UsersManagementPage';
import { StaffManagementPage, ServiceManagementPage } from '../features/admin';
import PrivateRoute from './PrivateRoute';
import ProfilePage from'../features/student/profile/ProfilePage'
import EditProfilePage from '../features/student/profile/EditProfilePage';
import { CreateAchievement, ViewAchievements } from '../features/achievements';

const AppRoutes = ({ isAuthenticated }) => (
  <Routes>
    <Route path="/" element={<Home />} />
    {/* Registration routes */}
    <Route path="/register" element={<Layout><RegistrationPage /></Layout>} />
    <Route path="/verify-email" element={<EmailVerificationPage />} />
    
    {/* Auth routes */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    
    {/* Admin routes */}
    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
    <Route path="/admin/staff" element={<StaffManagementPage />} />
    <Route path="/admin/users" element={<UsersManagementPage />} />
    <Route path="/admin/services" element={<ServiceManagementPage />} />
    
    {/* Student profile routes */}
    <Route
      path="/student/profile"
      element={
        <PrivateRoute isAuthenticated={isAuthenticated}>
          <ProfilePage />
        </PrivateRoute>
      }
    />
    <Route
      path="/student/profile/edit" 
      element={
        <PrivateRoute isAuthenticated={isAuthenticated}>
          <EditProfilePage /> 
        </PrivateRoute>
      }
    />
    
    {/* Achievements Routes */}
    <Route
      path="/achievements"
      element={
        <PrivateRoute isAuthenticated={isAuthenticated}>
          <ViewAchievements />
        </PrivateRoute>
      }
    />
    <Route
      path="/achievements/create"
      element={
        <PrivateRoute isAuthenticated={isAuthenticated}>
          <CreateAchievement />
        </PrivateRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;