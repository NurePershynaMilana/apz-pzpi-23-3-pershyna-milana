import './pdfFonts';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Plant } from '@/types';
import { calculatePlantStatus } from '@/utils/plantStatus';
import type { DashboardPDFLabels } from './pdfLabels';

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'NotoSans', backgroundColor: '#FFFFFF' },
    header: { marginBottom: 24 },
    title: { fontSize: 24, fontWeight: 700, color: '#7C3AED', marginBottom: 4 },
    subtitle: { fontSize: 12, color: '#6B7280' },
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    statCard: { flex: 1, backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8 },
    statLabel: { fontSize: 10, color: '#6B7280', marginBottom: 4 },
    statValue: { fontSize: 20, fontWeight: 700, color: '#111827' },
    section: { marginBottom: 20 },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 8,
        color: '#111827',
        borderBottom: '1px solid #E5E7EB',
        paddingBottom: 4,
    },
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

const STATUS_LABEL: Record<string, keyof Pick<DashboardPDFLabels, 'statusNormal' | 'statusAttention' | 'statusCritical'>> = {
    normal: 'statusNormal',
    attention: 'statusAttention',
    critical: 'statusCritical',
};

interface DashboardReportPDFProps {
    plants: Plant[];
    labels: DashboardPDFLabels;
    locale: string;
}

export const DashboardReportPDF = ({ plants, labels, locale }: DashboardReportPDFProps) => {
    const statuses = plants.map((p) => calculatePlantStatus(p, {}));
    const normalCount = statuses.filter((s) => s === 'normal').length;
    const attentionCount = statuses.filter((s) => s === 'attention').length;
    const criticalCount = statuses.filter((s) => s === 'critical').length;
    const date = new Date().toLocaleDateString(locale);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>{labels.title}</Text>
                    <Text style={styles.subtitle}>{labels.subtitle} — {date}</Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>{labels.totalPlants}</Text>
                        <Text style={styles.statValue}>{plants.length}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>{labels.normal}</Text>
                        <Text style={[styles.statValue, { color: '#10B981' }]}>{normalCount}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>{labels.attention}</Text>
                        <Text style={[styles.statValue, { color: '#F59E0B' }]}>{attentionCount}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>{labels.critical}</Text>
                        <Text style={[styles.statValue, { color: '#EF4444' }]}>{criticalCount}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{labels.plantList}</Text>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableCellHead}>{labels.colId}</Text>
                        <Text style={styles.tableCellHead}>{labels.colName}</Text>
                        <Text style={styles.tableCellHead}>{labels.colType}</Text>
                        <Text style={styles.tableCellHead}>{labels.colLocation}</Text>
                        <Text style={styles.tableCellHead}>{labels.colStatus}</Text>
                    </View>
                    {plants.map((plant, i) => (
                        <View key={plant.plant_id} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{plant.plant_id}</Text>
                            <Text style={styles.tableCell}>{plant.name}</Text>
                            <Text style={styles.tableCell}>{plant.plantType?.name ?? '—'}</Text>
                            <Text style={styles.tableCell}>{plant.location}</Text>
                            <Text style={styles.tableCell}>
                                {labels[STATUS_LABEL[statuses[i]] ?? 'statusNormal']}
                            </Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};
