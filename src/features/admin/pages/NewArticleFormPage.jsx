import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import NewArticleForm from '../components/articles/NewArticleForm';

/**
 * NewArticleFormPage component that wraps the new article form with layout
 * @returns {React.ReactElement} New article form page
 */
const NewArticleFormPage = () => (
  <AdminLayout>
    <NewArticleForm />
  </AdminLayout>
);

export default NewArticleFormPage;
