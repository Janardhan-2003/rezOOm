// src/components/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PublicRoute = ({ children }) => {
  const token = Cookies.get('authToken');

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
