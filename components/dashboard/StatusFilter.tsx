import { Device, DeviceStatus } from '@/src/data/mockDashboard'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type FilterKey = 'all' | DeviceStatus

type Props = {
    devices: Device[]
    activeFilter: FilterKey
    onChange: (filter: FilterKey) => void
}

const filterRows: FilterKey[][] = [
    ['all', 'offline', 'stopped', 'standby'],
    ['producing', 'highLoad', 'overload'],
]

const filterLabelKeys: Record<FilterKey, string> = {
    all: 'dashboard.filterAll',
    offline: 'dashboard.filterOffline',
    stopped: 'dashboard.filterStopped',
    standby: 'dashboard.filterStandby',
    producing: 'dashboard.filterProducing',
    highLoad: 'dashboard.filterHighLoad',
    overload: 'dashboard.filterOverload',
}

export function StatusFilter({ devices, activeFilter, onChange }: Props) {
    const { t } = useTranslation()

    function countFor(filter: FilterKey) {
        if (filter === 'all') return devices.length
        return devices.filter((d) => d.status === filter).length
    }

    return (
        <View style={styles.container}>
            {filterRows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((filter) => {
                        const isActive = activeFilter === filter
                        return (
                            <TouchableOpacity
                                key={filter}
                                style={[styles.chip, isActive && styles.chipActive]}
                                onPress={() => onChange(filter)}>
                                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                                    {t(filterLabelKeys[filter])} ({countFor(filter)})
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: { gap: 8 },
    row: { flexDirection: 'row', gap: 8 },
    chip: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    chipActive: {
        backgroundColor: '#1F4D3A',
        borderColor: '#1F4D3A',
    },
    chipText: { fontSize: 13, color: '#374151', fontWeight: '600' },
    chipTextActive: { color: '#FFFFFF' },
})
