import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ROUTES } from './routes';

export const ProtectedRoute = () => {
    const { isAuth, isInitializing } = useAuth();

    if (isInitializing) return <LoadingSpinner fullScreen />;
    if (!isAuth) return <Navigate to={ROUTES.LOGIN} replace />;
    return <Outlet />;
};
