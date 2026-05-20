import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().min(1, 'validation.required').email('validation.email'),
    password: z.string().min(6, 'validation.passwordMin'),
});

export const registerSchema = z
    .object({
        first_name: z.string().min(1, 'validation.required'),
        last_name: z.string().min(1, 'validation.required'),
        email: z.string().min(1, 'validation.required').email('validation.email'),
        password: z.string().min(6, 'validation.passwordMin'),
        confirmPassword: z.string().min(6, 'validation.passwordMin'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'validation.passwordsMatch',
        path: ['confirmPassword'],
    });

export const plantSchema = z.object({
    name: z.string().min(1, 'validation.required'),
    location: z.string().min(1, 'validation.required'),
    plant_type_id: z.number({ message: 'validation.required' }).positive(),
});

export const plantTypeSchema = z.object({
    name: z.string().min(1, 'validation.required'),
    optimal_humidity: z.number().min(0).max(100),
    optimal_temperature: z.number().min(-50).max(100),
    optimal_light: z.number().min(0),
    watering_frequency: z.number().min(1),
});

export const sensorSchema = z.object({
    plant_id: z.number().positive(),
    sensor_type: z.enum(['humidity', 'temperature', 'light']),
    hardware_id: z.string().min(1, 'validation.required'),
    is_active: z.boolean().optional(),
});

export const userSchema = z.object({
    first_name: z.string().min(1, 'validation.required'),
    last_name: z.string().min(1, 'validation.required'),
    email: z.string().min(1, 'validation.required').email('validation.email'),
    role: z.enum(['user', 'admin']).optional(),
    password: z.string().min(6, 'validation.passwordMin').optional(),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'validation.required'),
        newPassword: z.string().min(6, 'validation.passwordMin'),
        confirmNewPassword: z.string().min(6, 'validation.passwordMin'),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'validation.passwordsMatch',
        path: ['confirmNewPassword'],
    });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type PlantFormValues = z.infer<typeof plantSchema>;
export type PlantTypeFormValues = z.infer<typeof plantTypeSchema>;
export type SensorFormValues = z.infer<typeof sensorSchema>;
export type UserFormValues = z.infer<typeof userSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
