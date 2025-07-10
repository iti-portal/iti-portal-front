// src/routes/AppRoutes.js

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
import ApprovalsManagementPage from '../features/admin/pages/ApprovalsManagementPage';
import ArticlesManagementPage from '../features/admin/pages/ArticlesManagementPage';
import NewArticleFormPage from '../features/admin/pages/NewArticleFormPage';
import ContactUsManagementPage from '../features/admin/pages/ContactUsManagementPage';
import { StaffManagementPage, ServiceManagementPage } from '../features/admin';
import PrivateRoute from './PrivateRoute';
import RoleBasedRoute from './RoleBasedRoute';
import { ProfilePage, EditProfilePage } from '../features/student';
import { CreateAchievement, ViewAchievements, MyAchievements } from '../features/achievements';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES } from '../features/auth/types/auth.types';
import CompanyAdmin from '../features/admin/components/company/CompanyAdmin';  
import JobManagementPage from '../features/admin/pages/JobsManagement';
import AvaliableJobs from '../features/student/jobs/AvaliableJobs';
import JobsList from '../features/company/jobs/ShowCompanyJobs';
import JobDetailsView from '../features/company/jobs/ShowJobDetails';
import StudentArticles from '../features/student/articles/StudentsArticles';
import PublicProfilePage from '../features/student/pages/PublicProfilePage';
import AccountSettings from '../features/auth/components/AccountSettings';
import MyNetwork from '../features/student/network/MyNetwork';
import CompanyLayout from './../layouts/CompanyLayout';
import CompanyProfile from '../features/company/profile/CompanyProfile';
import PostJob from '../features/company/postJob/PostJob';
import ManageApplicants from '../features/company/applicants/Applicants';
import Network from '../pages/explore-itians/ExploreItians';
import ManageJobs from '../features/company/jobs/ManageJobs';
import Analytics from '../features/company/analytics/Analytics';
import Messages from '../features/company/messages/Messages';
import ApplicationForm from '../features/student/components/applications/ApplicationForm';
import MyApplicationsPage from '../features/student/pages/MyApplicationsPage';
import ApplicationDetailsPage from '../features/student/pages/ApplicationDetailsPage';
import CompanyJobApplicationsPage from '../features/company/applicants/pages/CompanyJobApplicationsPage';
import AdminApplicationsPage from '../features/admin/pages/AdminApplicationsPage';
import ShowCompanyUser from '../features/student/company/ShowCompanyUser';
import ShowDetailArticleData from '../features/student/articles/ShowDetailArticleData';

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
            element={ <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}><AdminDashboardPage /></RoleBasedRoute> } 
          />
          <Route 
            path="/admin/users" 
            element={ <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}><UsersManagementPage /></RoleBasedRoute> } 
          />
          <Route 
            path="/admin/approvals" 
            element={ <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}><ApprovalsManagementPage /></RoleBasedRoute> } 
          />
          <Route
            path="/account/settings"
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><AccountSettings /></PrivateRoute> }
          />
          <Route 
            path="/admin/articles" 
            element={ <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}><ArticlesManagementPage /></RoleBasedRoute> } 
          />
          <Route 
            path="/admin/articles/new" 
            element={ <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}><NewArticleFormPage /></RoleBasedRoute> } 
          />
          <Route 
            path="/admin/staff" 
            element={ <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}><StaffManagementPage /></RoleBasedRoute> } 
          />
          <Route 
            path="/admin/contact-us" 
            element={ <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}><ContactUsManagementPage /></RoleBasedRoute> } 
          />
          <Route 
            path="/admin/services" 
            element={ <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}><ServiceManagementPage /></RoleBasedRoute> } 
          />
          <Route
            path="/admin/companies"
            element={ <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}><CompanyAdmin /></RoleBasedRoute> }
          />
          <Route
            path="/admin/jobs"
            element={ <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}><JobManagementPage /></RoleBasedRoute> }
          />
          
          {/* Company routes */}
          <Route
            path="/company/profile"
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><CompanyProfile /></PrivateRoute> }
          />
          <Route
            path="/company/dashboard"
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><CompanyLayout /></PrivateRoute> }
          >
            <Route path="post-job" element={<PostJob />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route path="applicants" element={<ManageApplicants />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="messages" element={<Messages />} />
          </Route>
          <Route
            path="/company/jobs" 
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><JobsList/></PrivateRoute> }
          />
          <Route
            path="/company/jobs/:id" 
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><JobDetailsView/></PrivateRoute> }
          />

          {/* Network / Explore Route */}
          <Route
            path="/network"
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><Network /></PrivateRoute> }
          />

          {/* --- CORRECTED PROFILE ROUTES --- */}

          {/* This route is for the LOGGED-IN user's own profile page (with edit buttons) */}
          <Route
            path="/student/profile" 
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><ProfilePage /></PrivateRoute> }
          />

          {/* This route is for viewing OTHER users' public profiles */}
          <Route
            path="/profile/:id" 
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><PublicProfilePage /></PrivateRoute> }
          />

          {/* This route is for the LOGGED-IN user to edit their profile */}
          <Route
            path="/student/profile/edit" 
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><EditProfilePage /></PrivateRoute> }
          />
          
          {/* --- END OF CORRECTED PROFILE ROUTES --- */}


          {/* Student Specific Routes */}
          <Route
            path="/my-network" 
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><MyNetwork /></PrivateRoute> }
          />
          <Route
            path="/student/availablejobs" 
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><AvaliableJobs/></PrivateRoute> }
          />
          <Route
            path="/student/articles" 
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><StudentArticles/></PrivateRoute> }
          />
          <Route
            path="/student/articles/:id" 
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><ShowDetailArticleData/></PrivateRoute> }
          />
          <Route
            path="/student/comapnies" 
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><ShowCompanyUser/></PrivateRoute> }
          />
          
          {/* Achievements Routes */}
          <Route
            path="/achievements"
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><ViewAchievements /></PrivateRoute> }
          />
          <Route
            path="/my-achievements"
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><MyAchievements /></PrivateRoute> }
          />
          <Route
            path="/achievements/create"
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><CreateAchievement /></PrivateRoute> }
          />

          {/* Job application routes */}
          <Route
            path="/job/:jobId/apply" 
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><ApplicationForm /></PrivateRoute> }
          />
          <Route
            path="/my-applications" 
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><MyApplicationsPage /></PrivateRoute> }
          />
          <Route 
            path="/my-applications/:applicationId" 
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><ApplicationDetailsPage /></PrivateRoute> }
          />
          
          {/* Company and Admin Application routes */}
          <Route 
            path="/admin/applications" 
            element={ <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}><AdminApplicationsPage /></RoleBasedRoute> } 
          />
          <Route 
            path="/company/jobs/:jobId/applications" 
            element={ <PrivateRoute isAuthenticated={isAuthenticated}><CompanyJobApplicationsPage /></PrivateRoute> } 
          />
        
          {/* Not Found route */}
          <Route path="*" element={<NotFound />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;