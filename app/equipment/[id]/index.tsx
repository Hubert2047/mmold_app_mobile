import LoadingOverlay from '@/components/LoadingOverlay'
import { useAuth } from '@/src/context/AuthContext'
import { useDevices } from '@/src/context/DevicesContext'
import { deleteDevice } from '@/src/services/devices'
import { getGateWays } from '@/src/services/gateways'
import { IGateway } from '@/src/type'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function EquipmentDetailScreen() {
    const { t } = useTranslation()
    const { user, tokens } = useAuth()
    const { id } = useLocalSearchParams<{ id: string }>()
    const { devices, loading, fetchDevices, getDeviceById } = useDevices()
    const [deleting, setDeleting] = useState(false)
    const [gateways, setGateways] = useState<IGateway[]>([])

    const item = getDeviceById(id)

    useEffect(() => {
        if (!item && !loading) {
            fetchDevices()
        }
    }, [item, loading])

    useEffect(() => {
        if (!user?.organizationId || !tokens?.accessToken) return
        getGateWays(user.organizationId, tokens.accessToken)
            .then(setGateways)
            .catch(() => {})
    }, [user?.organizationId, tokens?.accessToken])

    const gatewayName = gateways.find((g) => g.id === item?.gatewayId)?.name

    function handleEdit() {
        router.push(`/equipment/${id}/edit`)
    }

    function handleDelete() {
        Alert.alert(t('equipment.deleteConfirmTitle'), t('equipment.deleteConfirmMessage'), [
            { text: t('account.cancel'), style: 'cancel' },
            {
                text: t('equipment.delete'),
                style: 'destructive',
                onPress: async () => {
                    if (!user?.organizationId) return
                    setDeleting(true)
                    try {
                        await deleteDevice(user.organizationId, id)
                        await fetchDevices({ silent: true })
                        router.back()
                    } catch (err) {
                        setDeleting(false)
                        Alert.alert(t('equipment.deleteFailed'))
                    }
                },
            },
        ])
    }

    if (!item) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backArea} onPress={() => router.back()} hitSlop={10}>
                        <Ionicons name='chevron-back' size={22} color='#111827' />
                        <Text style={styles.title}>{t('equipment.detailTitle')}</Text>
                    </TouchableOpacity>
                    <View style={{ width: 22 }} />
                </View>
                {loading && devices.length === 0 ? (
                    <View style={styles.emptyState}>
                        <LoadingOverlay visible label={t('equipment.loading')} variant='inline' />
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name='alert-circle-outline' size={40} color='#D1D5DB' />
                        <Text style={styles.emptyText}>{t('equipment.notFound')}</Text>
                    </View>
                )}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backArea} onPress={() => router.back()} hitSlop={10}>
                    <Ionicons name='chevron-back' size={22} color='#111827' />
                    <Text style={styles.title}>{t('equipment.detailTitle')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleEdit} hitSlop={10}>
                    <Ionicons name='pencil-outline' size={20} color='#111827' />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <View style={styles.cardTopRow}>
                        <View style={styles.iconBox}>
                            <Ionicons name='speedometer-outline' size={22} color='#6B7280' />
                        </View>
                        <View>
                            <Text style={styles.deviceName}>{item.name}</Text>
                            <Text style={styles.deviceSub}>{item.type}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <InfoRow label={t('equipment.gateway')} value={gatewayName ?? '—'} />
                    <InfoRow label={t('equipment.meterId')} value={item.externalId ?? '—'} />
                    <InfoRow label={t('equipment.phase')} value={item.phase} />
                    <InfoRow label={`${t('equipment.ratedVoltage')} (V)`} value={String(item.ratedVoltage)} />
                    <InfoRow label={`${t('equipment.ratedCurrent')} (A)`} value={String(item.ratedCurrent)} />
                    <InfoRow label={`${t('equipment.ratedPower')} (kW)`} value={String(item.ratedPowerKw)} />
                    <InfoRow label={t('equipment.ctRatio')} value={item.ctRatio != null ? String(item.ctRatio) : '—'} />
                </View>

                <View style={styles.card}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>{t('equipment.alertSettings')}</Text>
                        <View style={[styles.statusPill, item.alertsEnabled ? styles.statusOn : styles.statusOff]}>
                            <Text
                                style={[
                                    styles.statusPillText,
                                    item.alertsEnabled ? styles.statusOnText : styles.statusOffText,
                                ]}>
                                {item.alertsEnabled ? t('equipment.enabled') : t('equipment.disabled')}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <InfoRow
                        label={t('equipment.powerSpikeThreshold')}
                        value={
                            item.alertPowerSpikeThreshold != null
                                ? String(item.alertPowerSpikeThreshold)
                                : t('equipment.default')
                        }
                    />
                    <InfoRow
                        label={t('equipment.overcurrentThreshold')}
                        value={
                            item.alertOvercurrentThreshold != null
                                ? String(item.alertOvercurrentThreshold)
                                : t('equipment.default')
                        }
                    />
                    <InfoRow
                        label={t('equipment.noDataTimeout')}
                        value={
                            item.alertNoDataTimeout != null ? String(item.alertNoDataTimeout) : t('equipment.default')
                        }
                    />
                    <InfoRow
                        label={t('equipment.imbalanceThreshold')}
                        value={
                            item.alertImbalanceThreshold != null
                                ? String(item.alertImbalanceThreshold)
                                : t('equipment.default')
                        }
                    />
                </View>

                <TouchableOpacity style={styles.deleteCard} onPress={handleDelete} disabled={deleting}>
                    <Ionicons name='trash-outline' size={18} color='#DC2626' />
                    <Text style={styles.deleteText}>{deleting ? t('equipment.deleting') : t('equipment.delete')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 56,
        paddingBottom: 14,
    },
    backArea: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: { fontSize: 17, fontWeight: '700', color: '#111827' },
    content: { paddingHorizontal: 16, paddingBottom: 30, gap: 12 },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
    },
    cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deviceName: { fontSize: 16, fontWeight: '700', color: '#111827' },
    deviceSub: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 14 },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    infoLabel: { fontSize: 13, color: '#6B7280' },
    infoValue: { fontSize: 13, fontWeight: '700', color: '#111827' },
    sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
    statusPill: { borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10 },
    statusOn: { backgroundColor: '#DCFCE7' },
    statusOff: { backgroundColor: '#F3F4F6' },
    statusPillText: { fontSize: 11, fontWeight: '700' },
    statusOnText: { color: '#16A34A' },
    statusOffText: { color: '#6B7280' },
    deleteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingVertical: 14,
    },
    deleteText: { fontSize: 14, fontWeight: '700', color: '#DC2626' },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 8 },
    emptyText: { fontSize: 13, color: '#9CA3AF' },
})
