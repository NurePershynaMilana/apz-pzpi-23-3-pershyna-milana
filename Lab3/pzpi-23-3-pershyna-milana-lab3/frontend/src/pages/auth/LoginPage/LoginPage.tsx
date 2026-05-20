import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Link,
    InputAdornment,
    IconButton,
    Alert,
} from '@mui/material';
import { Nature as NatureIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '@/api/authApi';
import { setCredentials } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/app/hooks';
import { loginSchema, type LoginFormValues } from '@/utils/validators';
import { ROUTES } from '@/routes/routes';

export const LoginPage = () => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [login, { isLoading }] = useLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

    const onSubmit = async (data: LoginFormValues) => {
        setApiError('');
        try {
            const result = await login(data).unwrap();
            if (result.success && result.data) {
                dispatch(setCredentials({ user: result.data.user, token: result.data.token }));
                navigate(ROUTES.DASHBOARD, { replace: true });
            } else {
                setApiError(result.error ?? result.message ?? t('errors.unknown'));
            }
        } catch (err: unknown) {
            const e = err as { data?: { error?: string; message?: string } };
            setApiError(e?.data?.error ?? e?.data?.message ?? t('errors.networkError'));
        }
    };

    return (
        <Card sx={{ width: '100%', maxWidth: 400, mx: 2 }}>
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 3,
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                        }}
                    >
                        <NatureIcon sx={{ fontSize: 32, color: 'white' }} />
                    </Box>
                    <Typography variant="h5" fontWeight={700}>
                        Plant Care System
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {t('auth.welcomeBack')}
                    </Typography>
                </Box>

                {apiError && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        {apiError}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextField
                        label={t('auth.email')}
                        type="email"
                        fullWidth
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email && t(errors.email.message!)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label={t('auth.password')}
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password && t(errors.password.message!)}
                        sx={{ mb: 3 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword((p) => !p)}
                                        edge="end"
                                        size="small"
                                    >
                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={isLoading}
                        sx={{ mb: 2 }}
                    >
                        {isLoading ? t('common.loading') : t('auth.login')}
                    </Button>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                    <Link
                        component={RouterLink}
                        to={ROUTES.REGISTER}
                        variant="body2"
                        color="primary"
                    >
                        {t('auth.noAccount')}
                    </Link>
                </Box>
            </CardContent>
        </Card>
    );
};
