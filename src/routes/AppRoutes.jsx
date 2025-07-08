import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Layout from '../components/Layout/LayoutRegistration';
import { RegistrationPage, EmailVerificationPage } from '../features/registration';
import { LoginPage, ForgotPasswordPage, ResetPasswordPage } from '../features/auth';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import UsersManagementPage from '../pages/UsersManagementPage';
import ContactUsManagementPage from '../features/admin/pages/ContactUsManagementPage';
import { StaffManagementPage, ServiceManagementPage } from '../features/admin';
import PrivateRoute from './PrivateRoute';
import RoleBasedRoute from './RoleBasedRoute';
import { ProfilePage, EditProfilePage } from '../features/student';
import { CreateAchievement, ViewAchievements, MyAchievements } from '../features/achievements';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES } from '../features/auth/types/auth.types';
import ApplicationForm from '../features/student/components/applications/ApplicationForm';
import MyApplicationsPage from '../features/student/pages/MyApplicationsPage';
import ApplicationDetailsPage from '../features/student/pages/ApplicationDetailsPage';
import CompanyJobApplicationsPage from '../features/company/applicants/pages/CompanyJobApplicationsPage';
import AdminApplicationsPage from '../features/admin/pages/AdminApplicationsPage';
import ChatPage from '../pages/ChatPage';
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <Routes>
      {/* Public Home route - accessible without login, no loading check */}
      <Route
        path="/"
        element={<Home/>}
      />
      
      {/* Public About and Contact routes */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Routes that need loading check */}
      {loading ? (
        <Route 
          path="*" 
          element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#901b20] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          } 
        />
      ) : (
        <>
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
        path="/admin/staff" 
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <StaffManagementPage />
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
        path="/admin/contact-us" 
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <ContactUsManagementPage />
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
  path="/chat"
  element={
    <PrivateRoute isAuthenticated={isAuthenticated}>
      <ChatPage />
    </PrivateRoute>
  }
/>
      <Route
        path="/my-achievements"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <MyAchievements />
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
    {/* Job application routes */}
      <Route
        path="/job/:jobId/apply" 
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <ApplicationForm />
          </PrivateRoute>
        }
      />
    {/* My Applications route */}
    <Route
      path="/my-applications" 
      element={
        <PrivateRoute isAuthenticated={isAuthenticated}>
          <MyApplicationsPage />
        </PrivateRoute>
      }
    />
    <Route 
      path="/my-applications/:applicationId" 
      element={
        <PrivateRoute isAuthenticated={isAuthenticated}>
          <ApplicationDetailsPage />
        </PrivateRoute> 
      }
    />
    
    {/* Company and Admin Application routes */}
    <Route 
      path="/admin/applications" 
      element={
        <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
          <AdminApplicationsPage />
        </RoleBasedRoute>
      } 
    />
    <Route 
      path="/company/jobs/:jobId/applications" 
      element={
        <PrivateRoute isAuthenticated={isAuthenticated}>
          <CompanyJobApplicationsPage />
        </PrivateRoute>
      } 
    />

    
    {/* Not Found route */}
    <Route path="*" element={<NotFound />} />
          </>
        )}
    </Routes>
  );
};

export default AppRoutes;