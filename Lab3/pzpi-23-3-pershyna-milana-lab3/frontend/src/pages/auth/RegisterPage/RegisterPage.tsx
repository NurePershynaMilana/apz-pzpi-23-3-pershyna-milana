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
import { useRegisterMutation } from '@/api/authApi';
import { setCredentials } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/app/hooks';
import { registerSchema, type RegisterFormValues } from '@/utils/validators';
import { ROUTES } from '@/routes/routes';

export const RegisterPage = () => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [registerUser, { isLoading }] = useRegisterMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

    const onSubmit = async (data: RegisterFormValues) => {
        setApiError('');
        const { confirmPassword: _confirmPassword, ...payload } = data;
        try {
            const result = await registerUser(payload).unwrap();
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
        <Card sx={{ width: '100%', maxWidth: 440, mx: 2 }}>
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
                        {t('auth.createAccount')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Plant Care System
                    </Typography>
                </Box>

                {apiError && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        {apiError}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            label={t('auth.firstName')}
                            fullWidth
                            {...register('first_name')}
                            error={!!errors.first_name}
                            helperText={errors.first_name && t(errors.first_name.message!)}
                        />
                        <TextField
                            label={t('auth.lastName')}
                            fullWidth
                            {...register('last_name')}
                            error={!!errors.last_name}
                            helperText={errors.last_name && t(errors.last_name.message!)}
                        />
                    </Box>
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
                        sx={{ mb: 2 }}
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
                    <TextField
                        label={t('auth.confirmPassword')}
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        {...register('confirmPassword')}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword && t(errors.confirmPassword.message!)}
                        sx={{ mb: 3 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={isLoading}
                        sx={{ mb: 2 }}
                    >
                        {isLoading ? t('common.loading') : t('auth.register')}
                    </Button>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                    <Link component={RouterLink} to={ROUTES.LOGIN} variant="body2" color="primary">
                        {t('auth.hasAccount')}
                    </Link>
                </Box>
            </CardContent>
        </Card>
    );
};
