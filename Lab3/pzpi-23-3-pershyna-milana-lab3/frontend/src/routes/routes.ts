export const ROUTES = {
    LOGIN: '/login',
    REGISTER: '/register',

    DASHBOARD: '/dashboard',
    PLANTS: '/plants',
    PLANT_DETAIL: '/plants/:id',
    ADD_PLANT: '/plants/new',
    EDIT_PLANT: '/plants/:id/edit',
    PROFILE: '/profile',
    SETTINGS: '/settings',

    ADMIN_DASHBOARD: '/admin',
    ADMIN_USERS: '/admin/users',
    ADMIN_PLANTS: '/admin/plants',
    ADMIN_PLANT_TYPES: '/admin/plant-types',
    ADMIN_SENSORS: '/admin/sensors',
    ADMIN_BACKUP: '/admin/backup',
} as const;
