import { DeviceCard } from '@/components/dashboard/DeviceCard'
import { PowerChart } from '@/components/dashboard/PowerChart'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { StatusFilter } from '@/components/dashboard/StatusFilter'
import { DeviceStatus, mockDevices, mockStats } from '@/src/data/mockDashboard'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, Text, View } from 'react-native'

type FilterKey = 'all' | DeviceStatus

export default function DashboardScreen() {
    const { t } = useTranslation()
    const [activeFilter, setActiveFilter] = useState<FilterKey>('all')

    const filteredDevices = activeFilter === 'all' ? mockDevices : mockDevices.filter((d) => d.status === activeFilter)

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredDevices}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <DeviceCard device={item} />}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View style={styles.headerContent}>
                        <View style={styles.titleBlock}>
                            <Text style={styles.title}>{t('tabs.dashboard')}</Text>
                            <Text style={styles.subtitle}>
                                {t('dashboard.updatedAt')} {mockStats.updatedAt}
                            </Text>
                        </View>

                        <StatsGrid />
                        <PowerChart />
                        <StatusFilter devices={mockDevices} activeFilter={activeFilter} onChange={setActiveFilter} />
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
