import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Layout from '../components/Layout/LayoutRegistration';
import LayoutEmailVerification from '../components/Layout/LayoutEmailVerification';
import RegistrationForm from '../features/registration/RegistrationForm';
import EmailVerification from '../features/registration/EmailVerification';
import Login from '../features/auth/Login';
import ForgotPassword from '../features/auth/ForgotPassword';
import ResetPassword from '../features/auth/ResetPassword';
import NotFound from '../pages/NotFound';
import StaffDashboard from '../features/staff/dashboard/StaffDashboard';
import AdminDashboard from '../features/admin/AdminDashboard'; // Assuming you have an admin dashboard component
import Services from '../features/services/Services'; // Assuming you have a services component

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/register" element={<Layout><RegistrationForm /></Layout>} />
    <Route path="/verify-email" element={<LayoutEmailVerification><EmailVerification /></LayoutEmailVerification>} />
    <Route path="/login" element={<Login />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/staff/dashboard" element={<StaffDashboard />} />
    <Route path='/admin/dashboard' element={<AdminDashboard />} />
    <Route path='/services' element={<Services/>} />
    {/* Add more routes here */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
