import { mockStats } from '@/src/data/mockDashboard'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

const statItems = [
    { key: 'todayAlerts', unit: '件', color: '#DC2626', valueKey: 'todayAlerts' as const },
    { key: 'realtimePower', unit: 'kW', color: '#2563EB', valueKey: 'realtimePower' as const },
    { key: 'monthlyEnergy', unit: 'kwh', color: '#111827', valueKey: 'monthlyEnergy' as const },
    { key: 'monthlyCarbon', unit: 'kg', color: '#111827', valueKey: 'monthlyCarbon' as const },
    { key: 'currentDemand', unit: 'kW', color: '#2563EB', valueKey: 'currentDemand' as const },
    { key: 'predictedDemand', unit: 'kW', color: '#2563EB', valueKey: 'predictedDemand' as const },
    { key: 'remainingTime', unit: '', color: '#111827', valueKey: 'remainingTime' as const },
    { key: 'todayPeak', unit: 'kW', color: '#2563EB', valueKey: 'todayPeak' as const },
    { key: 'monthlyPeak', unit: 'kW', color: '#2563EB', valueKey: 'monthlyPeak' as const },
]

export function StatsGrid() {
    const { t } = useTranslation()

    return (
        <View style={styles.grid}>
            {statItems.map((item) => (
                <View key={item.key} style={styles.card}>
                    <Text style={styles.label} numberOfLines={1}>
                        {t(`dashboard.${item.key}`)}
                    </Text>
                    <Text style={[styles.value, { color: item.color }]}>
                        {mockStats[item.valueKey]}
                        {item.unit ? <Text style={styles.unit}> {item.unit}</Text> : null}
                    </Text>
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    card: {
        width: '31.5%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    label: { fontSize: 11, color: '#9CA3AF', marginBottom: 6 },
    value: { fontSize: 18, fontWeight: '700' },
    unit: { fontSize: 12, fontWeight: '400', color: '#6B7280' },
})
