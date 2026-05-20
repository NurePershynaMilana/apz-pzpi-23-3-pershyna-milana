import { useAppSelector } from '@/app/hooks';
import {
    selectUser,
    selectIsAuth,
    selectIsAdmin,
    selectIsInitializing,
} from '@/features/auth/authSelectors';

export const useAuth = () => {
    const user = useAppSelector(selectUser);
    const isAuth = useAppSelector(selectIsAuth);
    const isAdmin = useAppSelector(selectIsAdmin);
    const isInitializing = useAppSelector(selectIsInitializing);
    return { user, isAuth, isAdmin, isInitializing };
};
