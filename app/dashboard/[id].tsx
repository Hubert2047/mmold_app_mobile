import { Device, mockDevices } from '@/src/data/mockDashboard'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SCREEN_WIDTH = Dimensions.get('window').width
const CHART_WIDTH = SCREEN_WIDTH - 32

const STATUS_COLORS = {
    stopped: '#9CA3AF',
    standby: '#60A5FA',
    producing: '#22C55E',
    highLoad: '#F59E0B',
    overload: '#EF4444',
} as const

function formatValue(value: number | undefined, digits = 3) {
    return (value ?? 0).toFixed(digits)
}

export default function DeviceDetailScreen() {
    const { t } = useTranslation()
    const { id } = useLocalSearchParams<{ id: string }>()
    const insets = useSafeAreaInsets()

    const currentIndex = useMemo(() => mockDevices.findIndex((d) => d.id === id), [id])
    const device: Device | undefined = currentIndex >= 0 ? mockDevices[currentIndex] : undefined

    function goToOffset(offset: number) {
        if (currentIndex < 0) return
        const nextIndex = (currentIndex + offset + mockDevices.length) % mockDevices.length
        router.setParams({ id: mockDevices[nextIndex].id })
    }

    function handleClose() {
        if (router.canGoBack()) {
            router.back()
        } else {
            router.replace('/')
        }
    }

    if (!device) {
        return (
            <View style={styles.screen}>
                <View style={[styles.topRow, { paddingTop: insets.top + 10 }]}>
                    <TouchableOpacity onPress={handleClose} style={styles.closeButton} hitSlop={8}>
                        <Ionicons name='chevron-back' size={20} color='#111827' />
                        <Text style={styles.closeButtonText}>{t('common.close')}</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.emptyText}>{t('equipment.notFound')}</Text>
            </View>
        )
    }

    const hasMinutePower = device.minutePower && device.minutePower.length > 0
    const hasHourlyStatus = device.hourlyStatus && device.hourlyStatus.length > 0

    const powerChartData = hasMinutePower
        ? {
              labels: device.minutePower!.map((p, i) => (i % 6 === 0 ? p.time : '')),
              datasets: [{ data: device.minutePower!.map((p) => p.kw) }],
          }
        : null

    const statusChartData = hasHourlyStatus
        ? {
              labels: device.hourlyStatus!.map((p, i) => (i % 6 === 0 ? p.hour : '')),
              datasets: [
                  {
                      data: device.hourlyStatus!.map((p) => p.stopped),
                      color: () => STATUS_COLORS.stopped,
                      strokeWidth: 2,
                  },
                  {
                      data: device.hourlyStatus!.map((p) => p.standby),
                      color: () => STATUS_COLORS.standby,
                      strokeWidth: 2,
                  },
                  {
                      data: device.hourlyStatus!.map((p) => p.producing),
                      color: () => STATUS_COLORS.producing,
                      strokeWidth: 2,
                  },
                  {
                      data: device.hourlyStatus!.map((p) => p.highLoad),
                      color: () => STATUS_COLORS.highLoad,
                      strokeWidth: 2,
                  },
                  {
                      data: device.hourlyStatus!.map((p) => p.overload),
                      color: () => STATUS_COLORS.overload,
                      strokeWidth: 2,
                  },
              ],
          }
        : null

    return (
        <View style={styles.screen}>
            <View style={[styles.topRow, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton} hitSlop={8}>
                    <Ionicons name='chevron-back' size={20} color='#111827' />
                    <Text style={styles.closeButtonText}>{t('common.close')}</Text>
                </TouchableOpacity>

                <View style={styles.pageIndicator}>
                    <Text style={styles.pageIndicatorText}>
                        {currentIndex + 1} / {mockDevices.length}
                    </Text>
                </View>
            </View>

            <View style={styles.navRow}>
                <TouchableOpacity onPress={() => goToOffset(-1)} style={styles.navArrow} hitSlop={12}>
                    <Ionicons name='chevron-back' size={18} color='#9CA3AF' />
                </TouchableOpacity>

                <View style={styles.titleBlock}>
                    <Text style={styles.deviceName} numberOfLines={1}>
                        {device.name}
                    </Text>
                    <Text style={styles.deviceSub} numberOfLines={1}>
                        {device.category} · {device.phase} · {t('dashboard.lastUpdated')}
                        {device.lastUpdated}
                    </Text>
                </View>

                <TouchableOpacity onPress={() => goToOffset(1)} style={styles.navArrow} hitSlop={12}>
                    <Ionicons name='chevron-forward' size={18} color='#9CA3AF' />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.specRow}>
                    <View style={styles.specChip}>
                        <Text style={styles.specChipText}>{device.ratedKw} kW</Text>
                    </View>
                    <View style={styles.specChip}>
                        <Text style={styles.specChipText}>{device.ratedA} A</Text>
                    </View>
                    <View style={styles.specChip}>
                        <Text style={styles.specChipText}>{device.ratedV} V</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>{t('dashboard.minutePowerTrend')}</Text>
                <View style={styles.chartCard}>
                    {powerChartData ? (
                        <LineChart
                            data={powerChartData}
                            width={CHART_WIDTH - 24}
                            height={180}
                            withDots={false}
                            withInnerLines={false}
                            chartConfig={baseChartConfig}
                            bezier
                            style={styles.chartStyle}
                        />
                    ) : (
                        <View style={styles.noDataBox}>
                            <Text style={styles.noDataText}>{t('dashboard.noData')}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.statsGrid}>
                    <StatCard label={t('dashboard.energyKwh')} value={formatValue(device.energyKwh)} />
                    <StatCard label={t('dashboard.carbonKg')} value={formatValue(device.carbonKg)} />
                    <StatCard label={t('dashboard.maxKw')} value={formatValue(device.maxKw)} />
                    <StatCard label={t('dashboard.agingKwh')} value={formatValue(device.agingKwh)} />
                    <StatCard label={t('dashboard.minKw')} value={formatValue(device.minKw)} />
                    <StatCard label={t('dashboard.ratedKw')} value={String(device.ratedKw)} />
                </View>

                <Text style={styles.sectionTitle}>{t('dashboard.hourlyStatusPercent')}</Text>
                <View style={styles.chartCard}>
                    {statusChartData ? (
                        <>
                            <LineChart
                                data={statusChartData}
                                width={CHART_WIDTH - 24}
                                height={180}
                                withDots={false}
                                withInnerLines
                                fromZero
                                segments={4}
                                formatYLabel={(y) => `${y}%`}
                                chartConfig={baseChartConfig}
                                style={styles.chartStyle}
                            />
                            <View style={styles.legendRow}>
                                <LegendDot color={STATUS_COLORS.stopped} label={t('dashboard.legendStopped')} />
                                <LegendDot color={STATUS_COLORS.standby} label={t('dashboard.legendStandby')} />
                                <LegendDot color={STATUS_COLORS.producing} label={t('dashboard.legendProducing')} />
                                <LegendDot color={STATUS_COLORS.highLoad} label={t('dashboard.legendHighLoad')} />
                                <LegendDot color={STATUS_COLORS.overload} label={t('dashboard.legendOverload')} />
                            </View>
                        </>
                    ) : (
                        <View style={styles.noDataBox}>
                            <Text style={styles.noDataText}>{t('dashboard.noData')}</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    )
}

function LegendDot({ color, label }: { color: string; label: string }) {
    return (
        <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendLabel}>{label}</Text>
        </View>
    )
}

const baseChartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(31, 77, 58, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    propsForBackgroundLines: { stroke: '#F0F0F0' },
    propsForLabels: { fontSize: 10 },
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingBottom: 10,
    },
    closeButton: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingVertical: 4 },
    closeButtonText: { fontSize: 15, fontWeight: '600', color: '#111827' },
    pageIndicator: { backgroundColor: '#F3F4F6', borderRadius: 10, paddingVertical: 4, paddingHorizontal: 10 },
    pageIndicatorText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    navArrow: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
    titleBlock: { flex: 1, alignItems: 'center' },
    deviceName: { fontSize: 15, fontWeight: '700', color: '#111827' },
    deviceSub: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
    content: { padding: 16, paddingBottom: 40, gap: 16 },
    specRow: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
    specChip: { backgroundColor: '#F3F4F6', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 18 },
    specChipText: { fontSize: 13, fontWeight: '700', color: '#111827' },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
    chartCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        padding: 12,
        alignItems: 'center',
    },
    chartStyle: { borderRadius: 8 },
    noDataBox: { height: 180, alignItems: 'center', justifyContent: 'center' },
    noDataText: { fontSize: 13, color: '#9CA3AF' },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    statCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        padding: 14,
    },
    statLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 6 },
    statValue: { fontSize: 18, fontWeight: '700', color: '#111827' },
    legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 10, justifyContent: 'center' },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    legendDot: { width: 7, height: 7, borderRadius: 4 },
    legendLabel: { fontSize: 11, color: '#6B7280' },
    emptyText: { textAlign: 'center', marginTop: 40, fontSize: 13, color: '#9CA3AF' },
})
