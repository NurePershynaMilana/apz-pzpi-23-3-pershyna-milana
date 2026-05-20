export interface DashboardPDFLabels {
    title: string;
    subtitle: string;
    totalPlants: string;
    normal: string;
    attention: string;
    critical: string;
    plantList: string;
    colId: string;
    colName: string;
    colType: string;
    colLocation: string;
    colStatus: string;
    statusNormal: string;
    statusAttention: string;
    statusCritical: string;
}

export interface PlantPDFLabels {
    title: string;
    subtitle: string;
    plantInfo: string;
    name: string;
    type: string;
    location: string;
    optHumidity: string;
    optTemperature: string;
    optLight: string;
    sensors: string;
    colId: string;
    colType: string;
    colHardwareId: string;
    colActive: string;
    activeYes: string;
    activeNo: string;
    sensorReadings: string;
    colSensorId: string;
    colValue: string;
    colTime: string;
}
