import './pdfFonts';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Plant, SensorData } from '@/types';
import type { PlantPDFLabels } from './pdfLabels';

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'NotoSans', backgroundColor: '#FFFFFF' },
    header: { marginBottom: 24 },
    title: { fontSize: 24, fontWeight: 700, color: '#7C3AED', marginBottom: 4 },
    subtitle: { fontSize: 12, color: '#6B7280' },
    section: { marginBottom: 20 },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 8,
        color: '#111827',
        borderBottom: '1px solid #E5E7EB',
        paddingBottom: 4,
    },
    row: { flexDirection: 'row', marginBottom: 4 },
    label: { fontSize: 10, color: '#6B7280', width: 160 },
    value: { fontSize: 10, color: '#111827', flex: 1 },
    table: { marginTop: 8 },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        padding: '6 8',
        borderRadius: 4,
    },
    tableRow: { flexDirection: 'row', padding: '4 8', borderBottom: '1px solid #F3F4F6' },
    tableCell: { fontSize: 9, flex: 1, color: '#374151' },
    tableCellHead: { fontSize: 9, flex: 1, fontWeight: 700, color: '#111827' },
});

interface PlantReportPDFProps {
    plant: Plant;
    data: SensorData[];
    labels: PlantPDFLabels;
    locale: string;
}

export const PlantReportPDF = ({ plant, data, labels, locale }: PlantReportPDFProps) => {
    const date = new Date().toLocaleDateString(locale);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>{labels.title}</Text>
                    <Text style={styles.subtitle}>{labels.subtitle} — {date}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{labels.plantInfo}</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>{labels.name}:</Text>
                        <Text style={styles.value}>{plant.name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>{labels.type}:</Text>
                        <Text style={styles.value}>{plant.plantType?.name ?? '—'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>{labels.location}:</Text>
                        <Text style={styles.value}>{plant.location}</Text>
                    </View>
                    {plant.plantType && (
                        <>
                            <View style={styles.row}>
                                <Text style={styles.label}>{labels.optHumidity}:</Text>
                                <Text style={styles.value}>{plant.plantType.optimal_humidity}%</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>{labels.optTemperature}:</Text>
                                <Text style={styles.value}>{plant.plantType.optimal_temperature}°C</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>{labels.optLight}:</Text>
                                <Text style={styles.value}>{plant.plantType.optimal_light} lux</Text>
                            </View>
                        </>
                    )}
                </View>

                {plant.sensors && plant.sensors.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{labels.sensors}</Text>
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableCellHead}>{labels.colId}</Text>
                            <Text style={styles.tableCellHead}>{labels.colType}</Text>
                            <Text style={styles.tableCellHead}>{labels.colHardwareId}</Text>
                            <Text style={styles.tableCellHead}>{labels.colActive}</Text>
                        </View>
                        {plant.sensors.map((s) => (
                            <View key={s.sensor_id} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{s.sensor_id}</Text>
                                <Text style={styles.tableCell}>{s.sensor_type}</Text>
                                <Text style={styles.tableCell}>{s.hardware_id}</Text>
                                <Text style={styles.tableCell}>{s.is_active ? labels.activeYes : labels.activeNo}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {data.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{labels.sensorReadings}</Text>
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableCellHead}>{labels.colSensorId}</Text>
                            <Text style={styles.tableCellHead}>{labels.colValue}</Text>
                            <Text style={styles.tableCellHead}>{labels.colTime}</Text>
                        </View>
                        {data.slice(0, 20).map((d) => (
                            <View key={d.data_id} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{d.sensor_id}</Text>
                                <Text style={styles.tableCell}>{d.value}</Text>
                                <Text style={styles.tableCell}>
                                    {new Date(d.timestamp || d.created_at).toLocaleString(locale)}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </Page>
        </Document>
    );
};
