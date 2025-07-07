import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import ArticlesManagment from '../components/articles/ArticlesManagment';

/**
 * ArticlesManagementPage component that wraps the dashboard with layout
 * @returns {React.ReactElement} Articles Management Page
 */
const ArticlesManagementPage = () => (
  <AdminLayout>
    <ArticlesManagment />
  </AdminLayout>
);

export default ArticlesManagementPage;
