import {
    Box,
    TextField,
    Button,
    Stack,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { userSchema, type UserFormValues } from '@/utils/validators';

interface UserFormProps {
    defaultValues?: Partial<UserFormValues>;
    onSubmit: (data: UserFormValues) => void;
    onCancel: () => void;
    loading?: boolean;
    isEdit?: boolean;
}

export const UserForm = ({ defaultValues, onSubmit, onCancel, loading, isEdit }: UserFormProps) => {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: { first_name: '', last_name: '', email: '', role: 'user', ...defaultValues },
    });

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label={t('auth.firstName')}
                        {...register('first_name')}
                        error={!!errors.first_name}
                        helperText={errors.first_name && t(errors.first_name.message!)}
                        fullWidth
                    />
                    <TextField
                        label={t('auth.lastName')}
                        {...register('last_name')}
                        error={!!errors.last_name}
                        helperText={errors.last_name && t(errors.last_name.message!)}
                        fullWidth
                    />
                </Box>
                <TextField
                    label={t('auth.email')}
                    type="email"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email && t(errors.email.message!)}
                    fullWidth
                    disabled={isEdit}
                />
                {!isEdit && (
                    <TextField
                        label={t('auth.password')}
                        type="password"
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password && t(errors.password.message!)}
                        fullWidth
                    />
                )}
                <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                        <FormControl size="small" fullWidth>
                            <InputLabel>{t('admin.role')}</InputLabel>
                            <Select {...field} label={t('admin.role')}>
                                <MenuItem value="user">user</MenuItem>
                                <MenuItem value="admin">admin</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 1 }}>
                    <Button onClick={onCancel} disabled={loading}>
                        {t('common.cancel')}
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? t('common.loading') : t('common.save')}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};
