import { IDashboardSummary } from '@/src/type'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
    stats: IDashboardSummary
}

function formatRemaining(sec: number) {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
}

export function StatsGrid({ stats }: Props) {
    const { t } = useTranslation()

    const statItems = [
        { key: 'todayAlerts', unit: '件', color: '#DC2626', value: stats.todayAlertCount },
        { key: 'realtimePower', unit: 'kW', color: '#2563EB', value: stats.currentDemandKw },
        { key: 'monthlyEnergy', unit: 'kwh', color: '#111827', value: stats.monthlyEnergyKwh },
        { key: 'monthlyCarbon', unit: 'kg', color: '#111827', value: stats.carbonEmissionKg },
        { key: 'currentDemand', unit: 'kW', color: '#2563EB', value: stats.currentDemandKw },
        { key: 'predictedDemand', unit: 'kW', color: '#2563EB', value: stats.predictedDemandKw },
        { key: 'remainingTime', unit: '', color: '#111827', value: formatRemaining(stats.demandRemainingSec) },
        { key: 'todayPeak', unit: 'kW', color: '#2563EB', value: stats.peakTodayKw },
        { key: 'monthlyPeak', unit: 'kW', color: '#2563EB', value: stats.peakMonthKw },
    ]

    return (
        <View style={styles.grid}>
            {statItems.map((item) => (
                <View key={item.key} style={styles.card}>
                    <Text style={styles.label} numberOfLines={1}>
                        {t(`dashboard.${item.key}`)}
                    </Text>
                    <Text style={[styles.value, { color: item.color }]}>
                        {item.value}
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
