import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import Spinner from './Spinner';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return <Spinner />;
  }

  // If there is no user, redirect to the login page.
  // We also pass the current location in the state so we can redirect back after login.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is authenticated, render the children components.
  return children;
};

export default ProtectedRoute;
