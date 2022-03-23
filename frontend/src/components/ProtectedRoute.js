import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ userToken, children }) => {
  const ADMIN = process.env.REACT_APP_ADMIN || "admin";
  if (!userToken || userToken !== ADMIN) {
    return <Navigate to="/404" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
