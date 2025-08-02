import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Spinner from './Spinner';

const AdminRoute = ({ children }) => {
  const { user, isAdmin, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <Spinner />;
  }

  // If the user is logged in and has the 'admin' role, render the children.
  // Otherwise, redirect them to the homepage.
  if (user && isAdmin) {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default AdminRoute;
