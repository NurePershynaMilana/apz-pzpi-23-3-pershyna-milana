export type SensorType = 'humidity' | 'temperature' | 'light';

export interface Sensor {
    sensor_id: number;
    plant_id: number;
    sensor_type: SensorType;
    hardware_id: string;
    is_active: boolean;
}

export interface SensorData {
    data_id: number;
    sensor_id: number;
    value: number;
    timestamp: string;
    created_at: string;
}

export interface CreateSensorPayload {
    plant_id: number;
    sensor_type: SensorType;
    hardware_id: string;
    is_active?: boolean;
}

export interface UpdateSensorPayload {
    sensor_type?: SensorType;
    hardware_id?: string;
    is_active?: boolean;
}
