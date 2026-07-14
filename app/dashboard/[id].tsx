import { useAuth } from '@/src/context/AuthContext'
import { useDashboard } from '@/src/context/DashboardContext'
import { useDevices } from '@/src/context/DevicesContext'
import { getDeviceRealtime, getDeviceStatusRatio } from '@/src/services/dashboard'
import { IDeviceRealtime, IDeviceStatusRatio, IDeviceWithStatus } from '@/src/type'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
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

function formatValue(value: number | null | undefined, digits = 3) {
    return (value ?? 0).toFixed(digits)
}

export default function DeviceDetailScreen() {
    const { t } = useTranslation()
    const { id } = useLocalSearchParams<{ id: string }>()
    const insets = useSafeAreaInsets()
    const { user } = useAuth()
    const { devices } = useDevices()
    const { liveStatus } = useDashboard()

    const [realtime, setRealtime] = useState<IDeviceRealtime | null>(null)
    const [statusRatio, setStatusRatio] = useState<IDeviceStatusRatio | null>(null)

    const mergedDevices: IDeviceWithStatus[] = useMemo(() => {
        const statusMap = new Map(liveStatus.map((s) => [s.deviceId, s]))
        return devices.map((d) => {
            const s = statusMap.get(d.id)
            return {
                ...d,
                status: s?.status ?? 'offline',
                statusSince: s?.statusSince ?? null,
                currentPower: s?.currentPower ?? 0,
            }
        })
    }, [devices, liveStatus])

    const currentIndex = useMemo(() => mergedDevices.findIndex((d) => d.id === id), [mergedDevices, id])
    const device = currentIndex >= 0 ? mergedDevices[currentIndex] : undefined

    useEffect(() => {
        if (!user?.organizationId || !id) return
        setRealtime(null)
        setStatusRatio(null)
        getDeviceRealtime(user.organizationId, id)
            .then(setRealtime)
            .catch(() => setRealtime(null))
        getDeviceStatusRatio(user.organizationId, id)
            .then(setStatusRatio)
            .catch(() => setStatusRatio(null))
    }, [user?.organizationId, id])

    function goToOffset(offset: number) {
        if (currentIndex < 0 || mergedDevices.length === 0) return
        const nextIndex = (currentIndex + offset + mergedDevices.length) % mergedDevices.length
        router.setParams({ id: mergedDevices[nextIndex].id })
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

    const hasMinutePower = (realtime?.points.length ?? 0) > 0
    const hasHourlyStatus = (statusRatio?.buckets.length ?? 0) > 0

    const powerChartData = hasMinutePower
        ? {
              labels: realtime!.points.map((p, i) => (i % 6 === 0 ? p.time : '')),
              datasets: [{ data: realtime!.points.map((p) => p.kw) }],
          }
        : null

    const statusChartData = hasHourlyStatus
        ? {
              labels: statusRatio!.buckets.map((b, i) => (i % 6 === 0 ? b.label : '')),
              datasets: [
                  {
                      data: statusRatio!.buckets.map((b) => b.shutdownPct),
                      color: () => STATUS_COLORS.stopped,
                      strokeWidth: 2,
                  },
                  {
                      data: statusRatio!.buckets.map((b) => b.standbyPct),
                      color: () => STATUS_COLORS.standby,
                      strokeWidth: 2,
                  },
                  {
                      data: statusRatio!.buckets.map((b) => b.normalPct),
                      color: () => STATUS_COLORS.producing,
                      strokeWidth: 2,
                  },
                  {
                      data: statusRatio!.buckets.map((b) => b.highloadPct),
                      color: () => STATUS_COLORS.highLoad,
                      strokeWidth: 2,
                  },
                  {
                      data: statusRatio!.buckets.map((b) => b.overloadPct),
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
                        {currentIndex + 1} / {mergedDevices.length}
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
                        {device.type} · {device.phase} · {t('dashboard.lastUpdated')}
                        {device.statusSince ?? '—'}
                    </Text>
                </View>

                <TouchableOpacity onPress={() => goToOffset(1)} style={styles.navArrow} hitSlop={12}>
                    <Ionicons name='chevron-forward' size={18} color='#9CA3AF' />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.specRow}>
                    <View style={styles.specChip}>
                        <Text style={styles.specChipText}>{device.ratedPowerKw} kW</Text>
                    </View>
                    <View style={styles.specChip}>
                        <Text style={styles.specChipText}>{device.ratedCurrent} A</Text>
                    </View>
                    <View style={styles.specChip}>
                        <Text style={styles.specChipText}>{device.ratedVoltage} V</Text>
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
                    <StatCard label={t('dashboard.maxKw')} value={formatValue(realtime?.stats.maxPower)} />
                    <StatCard label={t('dashboard.minKw')} value={formatValue(realtime?.stats.minPower)} />
                    <StatCard label={t('dashboard.ratedKw')} value={String(device.ratedPowerKw ?? 0)} />
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
