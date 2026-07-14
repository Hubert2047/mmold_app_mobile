import { DeviceCard } from '@/components/dashboard/DeviceCard'
import { PowerChart } from '@/components/dashboard/PowerChart'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { StatusFilter } from '@/components/dashboard/StatusFilter'
import { useAuth } from '@/src/context/AuthContext'
import { useDashboard } from '@/src/context/DashboardContext'
import { useDevices } from '@/src/context/DevicesContext'
import { getHistoryStacked } from '@/src/services/dashboard'
import { IDeviceWithStatus, IHistoryStacked } from '@/src/type'
import { router } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'

type FilterKey = 'all' | IDeviceWithStatus['status']

export default function DashboardScreen() {
    const { t } = useTranslation()
    const { user } = useAuth()
    const { devices, fetchDevices } = useDevices()
    const { stats, liveStatus, refreshing, error, updatedAt, refresh } = useDashboard()
    const [chart, setChart] = useState<IHistoryStacked | null>(null)
    const [activeFilter, setActiveFilter] = useState<FilterKey>('all')

    const loadChart = useCallback(async () => {
        if (!user?.organizationId) return
        try {
            const data = await getHistoryStacked(user.organizationId, 'past24h', 5)
            setChart(data)
        } catch {}
    }, [user?.organizationId])

    useEffect(() => {
        loadChart()
    }, [loadChart])

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

    const filteredDevices =
        activeFilter === 'all' ? mergedDevices : mergedDevices.filter((d) => d.status === activeFilter)

    const onRefresh = useCallback(() => {
        refresh()
        fetchDevices({ silent: true })
        loadChart()
    }, [refresh, fetchDevices, loadChart])

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredDevices}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <DeviceCard device={item} onPress={() => router.push(`/dashboard/${item.id}`)} />
                )}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListHeaderComponent={
                    <View style={styles.headerContent}>
                        <View style={styles.titleBlock}>
                            <Text style={styles.title}>{t('tabs.dashboard')}</Text>
                            <Text style={styles.subtitle}>
                                {t('dashboard.updatedAt')} {updatedAt ? updatedAt.toLocaleTimeString() : '--'}
                            </Text>
                        </View>

                        {stats && <StatsGrid stats={stats} />}
                        {chart && <PowerChart chart={chart} contractCapacity={stats?.contractCapacityKw ?? 0} />}
                        <StatusFilter devices={mergedDevices} activeFilter={activeFilter} onChange={setActiveFilter} />
                    </View>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    listContent: { padding: 16, paddingTop: 50, gap: 10 },
    headerContent: { gap: 14, marginBottom: 14 },
    titleBlock: { alignItems: 'center', marginBottom: 4 },
    title: { fontSize: 20, fontWeight: '700', color: '#111827' },
    subtitle: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
})
