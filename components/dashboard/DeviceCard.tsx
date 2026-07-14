import { DeviceStatus, IDeviceWithStatus } from '@/src/type'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const statusColors: Record<DeviceStatus, { bg: string; text: string }> = {
    offline: { bg: '#F3F4F6', text: '#6B7280' },
    stopped: { bg: '#FEE2E2', text: '#DC2626' },
    standby: { bg: '#FEF3C7', text: '#D97706' },
    producing: { bg: '#DCFCE7', text: '#16A34A' },
    highLoad: { bg: '#FFEDD5', text: '#EA580C' },
    overload: { bg: '#FEE2E2', text: '#DC2626' },
}

type Props = {
    device: IDeviceWithStatus
    onPress?: () => void
}

export function DeviceCard({ device, onPress }: Props) {
    const { t } = useTranslation()
    const statusStyle = statusColors[device.status]

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.iconBox}>
                <Ionicons name='speedometer-outline' size={22} color='#6B7280' />
            </View>

            <View style={styles.info}>
                <Text style={styles.name}>{device.name}</Text>
                <Text style={styles.meta}>
                    {device.type} · {device.externalId ?? '—'} · {device.phase}
                </Text>
                <View style={styles.ratedRow}>
                    <Text style={styles.ratedText}>{device.ratedPowerKw} kW</Text>
                    <Text style={styles.ratedText}>{device.ratedCurrent} A</Text>
                    <Text style={styles.ratedText}>{device.ratedVoltage} V</Text>
                </View>
            </View>

            <View style={styles.right}>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                        {t(`dashboard.status${device.status.charAt(0).toUpperCase() + device.status.slice(1)}`)}
                    </Text>
                </View>
                <Text style={styles.power}>{device.currentPower} kW</Text>
                <Ionicons name='chevron-forward' size={18} color='#D1D5DB' />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        gap: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: { flex: 1, gap: 4 },
    name: { fontSize: 15, fontWeight: '700', color: '#111827' },
    meta: { fontSize: 12, color: '#9CA3AF' },
    ratedRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
    ratedText: { fontSize: 12, color: '#6B7280' },
    right: { alignItems: 'flex-end', gap: 6 },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    statusText: { fontSize: 11, fontWeight: '600' },
    power: { fontSize: 13, fontWeight: '700', color: '#111827' },
})
