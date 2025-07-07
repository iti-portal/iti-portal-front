import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Layout from '../components/Layout/LayoutRegistration';
import { RegistrationPage, EmailVerificationPage } from '../features/registration';
import { LoginPage, ForgotPasswordPage, ResetPasswordPage } from '../features/auth';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import UsersManagementPage from '../pages/UsersManagementPage';
import ApprovalsManagementPage from '../features/admin/pages/ApprovalsManagementPage';
import ArticlesManagementPage from '../features/admin/pages/ArticlesManagementPage';
import NewArticleFormPage from '../features/admin/pages/NewArticleFormPage';
import { StaffManagementPage, ServiceManagementPage } from '../features/admin';
import PrivateRoute from './PrivateRoute';
import RoleBasedRoute from './RoleBasedRoute';
import { ProfilePage, EditProfilePage } from '../features/student';
import { CreateAchievement, ViewAchievements } from '../features/achievements';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES } from '../features/auth/types/auth.types';

import CompanyLayout from './../layouts/CompanyLayout';
import CompanyProfile from '../features/company/profile/CompanyProfile';
import PostJob from '../features/company/postJob/PostJob';
import ManageApplicants from '../features/company/applicants/Applicants';
import ExploreItians from './../components/Home/explore-itians/ExploreItians';
import ManageJobs from '../features/company/jobs/ManageJobs';
import Analytics from '../features/company/analytics/Analytics';
import Messages from '../features/company/messages/Messages';

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Protected Home route */}
      <Route
        path="/"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Home />
          </PrivateRoute>
        }
      />
      
      {/* Registration routes */}
      <Route path="/register" element={<Layout><RegistrationPage /></Layout>} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />
      
      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Unauthorized route */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Admin routes - Protected by RoleBasedRoute for admin only */}
      <Route 
        path="/admin/dashboard" 
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <AdminDashboardPage />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <UsersManagementPage />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/admin/approvals" 
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <ApprovalsManagementPage />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/admin/articles" 
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <ArticlesManagementPage />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/admin/articles/new" 
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <NewArticleFormPage />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/admin/staff" 
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <StaffManagementPage />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/admin/services" 
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <ServiceManagementPage />
          </RoleBasedRoute>
        } 
      />
      {/* Company routes */}
      <Route
        path="/company"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <CompanyLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<CompanyProfile />} />
        <Route path="profile" element={<CompanyProfile />} />
        <Route path="post-job" element={<PostJob />} />
        <Route path="manage-jobs" element={<ManageJobs />} />
        <Route path="applicants" element={<ManageApplicants />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="messages" element={<Messages />} />
      </Route>



      <Route
        path="/explore-itians"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <ExploreItians />
          </PrivateRoute>
        }
      />
      {/* Student profile routes */}
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
};

export default AppRoutes;