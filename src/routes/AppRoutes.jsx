import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Register from '../pages/Register';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import PrivateRoute from './PrivateRoute';
import ProfilePage from'../features/student/profile/ProfilePage'
import EditProfilePage from '../features/student/profile/EditProfilePage';
const AppRoutes = ({ isAuthenticated }) => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    {/* Add more routes here */}
    <Route
      path="/student/profile"
      element={
        // استخدام PrivateRoute لحماية صفحة البروفايل
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
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
