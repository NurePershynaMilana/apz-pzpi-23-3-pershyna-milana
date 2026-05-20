import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Divider,
    Stack,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdateUserMutation } from '@/api/usersApi';
import { useAuth } from '@/hooks/useAuth';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useAppDispatch } from '@/app/hooks';
import { setUser } from '@/features/auth/authSlice';
import { PageHeader } from '@/components/common/PageHeader';
import { Modal } from '@/components/common/Modal';
import { z } from 'zod';
import { changePasswordSchema, type ChangePasswordFormValues } from '@/utils/validators';

const profileSchema = z.object({
    first_name: z.string().min(1, 'validation.required'),
    last_name: z.string().min(1, 'validation.required'),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfilePage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const snackbar = useSnackbar();
    const [passwordOpen, setPasswordOpen] = useState(false);

    const [updateUser, { isLoading }] = useUpdateUserMutation();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: { first_name: user?.first_name ?? '', last_name: user?.last_name ?? '' },
    });

    const firstName = watch('first_name');
    const lastName = watch('last_name');

    const {
        register: regPwd,
        handleSubmit: handlePwd,
        formState: { errors: pwdErrors },
        reset: resetPwd,
    } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });

    const onSave = async (data: ProfileFormValues) => {
        if (!user) return;
        try {
            const result = await updateUser({ id: user.user_id, body: data }).unwrap();
            if (result.data) dispatch(setUser(result.data));
            snackbar.success(t('common.success'));
        } catch {
            snackbar.error(t('common.error'));
        }
    };

    const onChangePassword = async (data: ChangePasswordFormValues) => {
        if (!user) return;
        try {
            await updateUser({
                id: user.user_id,
                body: { password: data.newPassword, currentPassword: data.currentPassword } as { password: string },
            }).unwrap();
            snackbar.success(t('common.success'));
            setPasswordOpen(false);
            resetPwd();
        } catch {
            snackbar.error(t('common.error'));
        }
    };

    return (
        <Box>
            <PageHeader title={t('profile.title')} />
            <Card sx={{ maxWidth: 560 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Email: {user?.email}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSave)}>
                        <Stack spacing={2}>
                            <TextField
                                label={t('auth.firstName')}
                                {...register('first_name')}
                                error={!!errors.first_name}
                                helperText={errors.first_name && t(errors.first_name.message!)}
                                fullWidth
                                InputLabelProps={firstName ? { shrink: true } : undefined}
                            />
                            <TextField
                                label={t('auth.lastName')}
                                {...register('last_name')}
                                error={!!errors.last_name}
                                helperText={errors.last_name && t(errors.last_name.message!)}
                                fullWidth
                                InputLabelProps={lastName ? { shrink: true } : undefined}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isLoading}
                                sx={{ alignSelf: 'flex-start' }}
                            >
                                {isLoading ? t('common.loading') : t('profile.saveChanges')}
                            </Button>
                        </Stack>
                    </Box>
                    <Divider sx={{ my: 3 }} />
                    <Button variant="outlined" onClick={() => setPasswordOpen(true)}>
                        {t('profile.changePassword')}
                    </Button>
                </CardContent>
            </Card>

            <Modal
                open={passwordOpen}
                onClose={() => setPasswordOpen(false)}
                title={t('profile.changePassword')}
                actions={
                    <>
                        <Button onClick={() => setPasswordOpen(false)}>{t('common.cancel')}</Button>
                        <Button
                            variant="contained"
                            onClick={handlePwd(onChangePassword)}
                            disabled={isLoading}
                        >
                            {t('common.save')}
                        </Button>
                    </>
                }
            >
                <Stack spacing={2}>
                    <TextField
                        label={t('profile.currentPassword')}
                        type="password"
                        fullWidth
                        {...regPwd('currentPassword')}
                        error={!!pwdErrors.currentPassword}
                        helperText={
                            pwdErrors.currentPassword && t(pwdErrors.currentPassword.message!)
                        }
                    />
                    <TextField
                        label={t('profile.newPassword')}
                        type="password"
                        fullWidth
                        {...regPwd('newPassword')}
                        error={!!pwdErrors.newPassword}
                        helperText={pwdErrors.newPassword && t(pwdErrors.newPassword.message!)}
                    />
                    <TextField
                        label={t('profile.confirmNewPassword')}
                        type="password"
                        fullWidth
                        {...regPwd('confirmNewPassword')}
                        error={!!pwdErrors.confirmNewPassword}
                        helperText={
                            pwdErrors.confirmNewPassword && t(pwdErrors.confirmNewPassword.message!)
                        }
                    />
                </Stack>
            </Modal>
        </Box>
    );
};
