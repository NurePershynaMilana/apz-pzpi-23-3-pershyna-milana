import type { Plant, SensorType } from '@/types';
import { DEVIATION_THRESHOLD } from './constants';

export type PlantStatus = 'normal' | 'attention' | 'critical';

export function calculatePlantStatus(
    plant: Plant,
    latestReadings: Partial<Record<SensorType, number>>,
): PlantStatus {
    if (!plant.plantType) return 'normal';
    const { optimal_humidity, optimal_temperature, optimal_light } = plant.plantType;

    const deviations: number[] = [];
    if (latestReadings.humidity != null)
        deviations.push(Math.abs(latestReadings.humidity - optimal_humidity) / optimal_humidity);
    if (latestReadings.temperature != null)
        deviations.push(
            Math.abs(latestReadings.temperature - optimal_temperature) / optimal_temperature,
        );
    if (latestReadings.light != null)
        deviations.push(Math.abs(latestReadings.light - optimal_light) / optimal_light);

    const outOfRange = deviations.filter((d) => d > DEVIATION_THRESHOLD).length;
    if (outOfRange >= 2) return 'critical';
    if (outOfRange === 1) return 'attention';
    return 'normal';
}
