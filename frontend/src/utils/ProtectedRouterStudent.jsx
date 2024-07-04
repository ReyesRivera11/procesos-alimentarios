import React from 'react'
import { useAuth } from '../context/auth-context'
import {Outlet, Navigate} from "react-router-dom"
import { CircularProgress } from '@nextui-org/react';
const ProtectedRouterStudent = () => {
  const { auth, loading, user } = useAuth();
  if (loading) {
      return <div className="w-full h-full flex justify-center items-center">
          <CircularProgress size="lg" color="warning" aria-label="Loading..." />
      </div>
  }

  if (!auth || user.role !== 'alumno') {
      return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRouterStudent