import type { Sensor } from './sensor';

export interface PlantType {
    plant_type_id: number;
    name: string;
    optimal_humidity: number;
    optimal_temperature: number;
    optimal_light: number;
    watering_frequency: number;
}

export interface Plant {
    plant_id: number;
    user_id: number;
    plant_type_id: number;
    name: string;
    location: string;
    created_at: string;
    updated_at: string;
    plantType?: PlantType;
    sensors?: Sensor[];
}

export interface CreatePlantPayload {
    plant_type_id: number;
    name: string;
    location: string;
}

export interface UpdatePlantPayload {
    plant_type_id?: number;
    name?: string;
    location?: string;
}

export interface CreatePlantTypePayload {
    name: string;
    optimal_humidity: number;
    optimal_temperature: number;
    optimal_light: number;
    watering_frequency: number;
}
