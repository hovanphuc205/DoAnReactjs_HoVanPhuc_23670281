import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  
  if (!currentUser) {
    // Chưa đăng nhập
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.chucVu)) {
    // Không có quyền truy cập
    if (currentUser.chucVu === 'Quản lý') {
      return <Navigate to="/manager" replace />;
    } else {
      return <Navigate to="/staff" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
