import { Box, Button, Chip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    useGetUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} from '@/api/usersApi';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Modal } from '@/components/common/Modal';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useFormatters } from '@/i18n/useFormatters';
import type { User, UserRole } from '@/types';
import { UserForm } from './UserForm';
import type { UserFormValues } from '@/utils/validators';

export const UsersPage = () => {
    const { t } = useTranslation();
    const snackbar = useSnackbar();
    const { formatDateTime, sortStrings } = useFormatters();

    const [modalOpen, setModalOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data, isLoading } = useGetUsersQuery();
    const [createUser, { isLoading: creating }] = useCreateUserMutation();
    const [updateUser, { isLoading: updating }] = useUpdateUserMutation();
    const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

    const users = data?.data ?? [];

    const handleOpen = (user?: User) => {
        setEditUser(user ?? null);
        setModalOpen(true);
    };

    const handleSave = async (values: UserFormValues) => {
        try {
            if (editUser) {
                await updateUser({ id: editUser.user_id, body: values }).unwrap();
            } else {
                await createUser({
                    ...values,
                    password: values.password ?? 'changeme123',
                }).unwrap();
            }
            snackbar.success(t('common.success'));
            setModalOpen(false);
        } catch {
            snackbar.error(t('common.error'));
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteUser(deleteId).unwrap();
            snackbar.success(t('common.success'));
        } catch {
            snackbar.error(t('common.error'));
        } finally {
            setDeleteId(null);
        }
    };

    const roleColors: Record<UserRole, 'secondary' | 'default'> = {
        admin: 'secondary',
        user: 'default',
    };

    const columns: GridColDef[] = [
        { field: 'user_id', headerName: t('common.id'), width: 60 },
        { field: 'email', headerName: t('auth.email'), flex: 1, minWidth: 160, sortComparator: sortStrings },
        { field: 'first_name', headerName: t('auth.firstName'), width: 120, sortComparator: sortStrings },
        { field: 'last_name', headerName: t('auth.lastName'), width: 120, sortComparator: sortStrings },
        {
            field: 'role',
            headerName: t('admin.role'),
            width: 100,
            renderCell: (params: GridRenderCellParams<User, UserRole>) => (
                <Chip label={params.value} size="small" color={roleColors[params.value!]} />
            ),
        },
        {
            field: 'last_login',
            headerName: t('admin.lastLogin'),
            width: 160,
            renderCell: (params: GridRenderCellParams<User, string>) =>
                params.value ? formatDateTime(params.value) : '—',
        },
        {
            field: 'created_at',
            headerName: t('common.createdAt'),
            width: 160,
            renderCell: (params: GridRenderCellParams<User, string>) =>
                params.value ? formatDateTime(params.value) : '—',
        },
        {
            field: 'actions',
            headerName: t('common.actions'),
            width: 100,
            sortable: false,
            renderCell: (params: GridRenderCellParams<User>) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Button
                        size="small"
                        onClick={() => handleOpen(params.row as User)}
                        sx={{ minWidth: 0, p: 0.5 }}
                    >
                        <EditIcon fontSize="small" />
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        onClick={() => setDeleteId((params.row as User).user_id)}
                        sx={{ minWidth: 0, p: 0.5 }}
                    >
                        <DeleteIcon fontSize="small" />
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <Box>
            <PageHeader
                title={t('admin.users')}
                actions={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                    >
                        {t('common.add')}
                    </Button>
                }
            />

            <Box sx={{ height: 520, bgcolor: 'background.paper', borderRadius: 3 }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    loading={isLoading}
                    getRowId={(row: User) => row.user_id}
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-columnHeaders': { bgcolor: 'background.paper' },
                        '& .MuiDataGrid-cell': { borderColor: 'divider' },
                    }}
                />
            </Box>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editUser ? t('common.edit') : t('common.add')}
            >
                <UserForm
                    defaultValues={
                        editUser
                            ? {
                                  first_name: editUser.first_name,
                                  last_name: editUser.last_name,
                                  email: editUser.email,
                                  role: editUser.role,
                              }
                            : undefined
                    }
                    onSubmit={handleSave}
                    onCancel={() => setModalOpen(false)}
                    loading={creating || updating}
                    isEdit={!!editUser}
                />
            </Modal>

            <ConfirmDialog
                open={!!deleteId}
                title={t('common.delete')}
                message={t('admin.deleteUserConfirm')}
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
                loading={deleting}
            />
        </Box>
    );
};
