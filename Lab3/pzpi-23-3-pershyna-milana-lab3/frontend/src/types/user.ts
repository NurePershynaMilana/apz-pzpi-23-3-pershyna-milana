export type UserRole = 'user' | 'admin';

export interface User {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: UserRole;
    last_login?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateUserPayload {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    role?: UserRole;
}

export interface UpdateUserPayload {
    first_name?: string;
    last_name?: string;
    role?: UserRole;
    password?: string;
}
