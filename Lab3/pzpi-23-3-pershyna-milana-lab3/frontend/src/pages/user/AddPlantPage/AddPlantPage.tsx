import { Box, Card, CardContent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    useCreateMyPlantMutation,
    useUpdateMyPlantMutation,
    useGetMyPlantQuery,
} from '@/api/plantsApi';
import { PlantForm } from '@/components/plant/PlantForm';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useSnackbar } from '@/hooks/useSnackbar';
import { ROUTES } from '@/routes/routes';
import type { PlantFormValues } from '@/utils/validators';

export const AddPlantPage = () => {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const plantId = Number(id);

    const { t } = useTranslation();
    const navigate = useNavigate();
    const snackbar = useSnackbar();

    const { data: plantData, isLoading: plantLoading } = useGetMyPlantQuery(plantId, {
        skip: !isEdit,
    });
    const [createPlant, { isLoading: creating }] = useCreateMyPlantMutation();
    const [updatePlant, { isLoading: updating }] = useUpdateMyPlantMutation();

    const plant = plantData?.data;
    const isLoading = creating || updating;

    if (isEdit && plantLoading) return <LoadingSpinner />;

    const handleSubmit = async (data: PlantFormValues) => {
        try {
            if (isEdit) {
                await updatePlant({ id: plantId, body: data }).unwrap();
                snackbar.success(t('common.success'));
                navigate(`/plants/${plantId}`);
            } else {
                const result = await createPlant(data).unwrap();
                snackbar.success(t('common.success'));
                navigate(`/plants/${result.data?.plant_id ?? ''}`);
            }
        } catch {
            snackbar.error(t('common.error'));
        }
    };

    return (
        <Box>
            <PageHeader
                title={isEdit ? t('plants.editPlant') : t('plants.addPlant')}
                breadcrumbs={[
                    { label: t('plants.title'), href: ROUTES.PLANTS },
                    { label: isEdit ? t('plants.editPlant') : t('plants.addPlant') },
                ]}
            />
            <Card sx={{ maxWidth: 600 }}>
                <CardContent sx={{ p: 3 }}>
                    <PlantForm
                        defaultValues={
                            plant
                                ? {
                                      name: plant.name,
                                      location: plant.location,
                                      plant_type_id: plant.plant_type_id,
                                  }
                                : undefined
                        }
                        onSubmit={handleSubmit}
                        onCancel={() => navigate(isEdit ? `/plants/${plantId}` : ROUTES.PLANTS)}
                        loading={isLoading}
                    />
                </CardContent>
            </Card>
        </Box>
    );
};
