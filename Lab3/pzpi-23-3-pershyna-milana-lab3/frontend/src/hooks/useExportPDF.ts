import { pdf, Document } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { createElement, type ReactElement, type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import type { Plant, SensorData } from '@/types';
import { PlantReportPDF } from '@/components/pdf/PlantReportPDF';
import { DashboardReportPDF } from '@/components/pdf/DashboardReportPDF';
import type { DashboardPDFLabels, PlantPDFLabels } from '@/components/pdf/pdfLabels';

type PDFElement = ReactElement<ComponentProps<typeof Document>>;

const LOCALE_MAP: Record<string, string> = {
    uk: 'uk-UA',
    en: 'en-US',
};

export const useExportPDF = () => {
    const { t, i18n } = useTranslation();
    const locale = LOCALE_MAP[i18n.language] ?? 'en-US';

    const exportPlantReport = async (plant: Plant, sensorData: SensorData[]) => {
        const labels: PlantPDFLabels = {
            title: t('pdf.systemTitle'),
            subtitle: t('pdf.plantReport'),
            plantInfo: t('pdf.plantInfo'),
            name: t('common.name'),
            type: t('plants.plantType'),
            location: t('plants.location'),
            optHumidity: t('plantTypes.optimalHumidity'),
            optTemperature: t('plantTypes.optimalTemperature'),
            optLight: t('plantTypes.optimalLight'),
            sensors: t('sensors.title'),
            colId: t('common.id'),
            colType: t('sensors.sensorType'),
            colHardwareId: t('sensors.hardwareId'),
            colActive: t('sensors.isActive'),
            activeYes: t('common.yes'),
            activeNo: t('common.no'),
            sensorReadings: t('pdf.sensorReadings'),
            colSensorId: 'Sensor ID',
            colValue: t('pdf.value'),
            colTime: t('pdf.time'),
        };
        const element = createElement(PlantReportPDF, { plant, data: sensorData, labels, locale }) as PDFElement;
        const blob = await pdf(element).toBlob();
        saveAs(blob, `plant-${plant.plant_id}-report.pdf`);
    };

    const exportDashboardReport = async (plants: Plant[]) => {
        const labels: DashboardPDFLabels = {
            title: t('pdf.systemTitle'),
            subtitle: t('pdf.dashboardReport'),
            totalPlants: t('plants.total'),
            normal: t('plants.normal'),
            attention: t('plants.attention'),
            critical: t('plants.critical'),
            plantList: t('pdf.plantList'),
            colId: t('common.id'),
            colName: t('common.name'),
            colType: t('plants.plantType'),
            colLocation: t('plants.location'),
            colStatus: t('common.status'),
            statusNormal: t('plants.status.normal'),
            statusAttention: t('plants.status.attention'),
            statusCritical: t('plants.status.critical'),
        };
        const element = createElement(DashboardReportPDF, { plants, labels, locale }) as PDFElement;
        const blob = await pdf(element).toBlob();
        saveAs(blob, `dashboard-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    return { exportPlantReport, exportDashboardReport };
};
