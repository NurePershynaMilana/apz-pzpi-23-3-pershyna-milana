import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/theme/theme';
import { AppRouter } from '@/routes/AppRouter';
import { useAppDispatch } from '@/app/hooks';
import { setUser, setInitializing, logout } from '@/features/auth/authSlice';
import { authApi } from '@/api/authApi';
import { TOKEN_KEY } from '@/utils/constants';

const AppContent = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            dispatch(setInitializing(false));
            return;
        }

        dispatch(authApi.endpoints.getMe.initiate())
            .unwrap()
            .then((result) => {
                if (result.success && result.data) {
                    dispatch(setUser(result.data));
                } else {
                    dispatch(logout());
                }
            })
            .catch(() => {
                dispatch(logout());
            })
            .finally(() => {
                dispatch(setInitializing(false));
            });
    }, [dispatch]);

    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    );
};

const App = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
    </ThemeProvider>
);

export default App;
