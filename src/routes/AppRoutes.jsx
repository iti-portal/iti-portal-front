import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Register from '../pages/Register';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Profile from '../features/company/profile/Profile'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    {/* Add more routes here */}
    <Route path="/company/profile" element={<Profile />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
