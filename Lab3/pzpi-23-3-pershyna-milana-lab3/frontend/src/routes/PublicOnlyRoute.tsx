import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from './routes';

export const PublicOnlyRoute = () => {
    const { isAuth, isInitializing } = useAuth();

    if (isInitializing) return null;
    if (isAuth) return <Navigate to={ROUTES.DASHBOARD} replace />;
    return <Outlet />;
};
