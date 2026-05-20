import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from './routes';

export const AdminRoute = () => {
    const { isAdmin } = useAuth();

    if (!isAdmin) return <Navigate to={ROUTES.DASHBOARD} replace />;
    return <Outlet />;
};
