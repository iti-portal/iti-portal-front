import React from 'react';
import { UsersManagementPage } from '../features/admin';

/**
 * Main UsersManagementPage component that's used by the router
 * This is a wrapper around the feature's component
 * @returns {React.ReactElement} Users management page
 */
const UsersManagementPageWrapper = () => <UsersManagementPage />;

export default UsersManagementPageWrapper;
