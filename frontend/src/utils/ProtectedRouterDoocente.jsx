import React from 'react';
import { useAuth } from '../context/auth-context';
import { Outlet, Navigate } from 'react-router-dom';
import { CircularProgress } from '@nextui-org/react';

const ProtectedRouterDocente = () => {
    const { auth, loading, user } = useAuth();
    if (loading) {
        return <div className="w-full h-full flex justify-center items-center">
            <CircularProgress size="lg" color="warning" aria-label="Loading..." />
        </div>
    }

    if (!auth || user.role !== 'docente') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRouterDocente;
