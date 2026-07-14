import { deleteEquipment, getEquipmentById } from '@/src/data/equipment'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function EquipmentDetailScreen() {
    const { t } = useTranslation()
    const { id } = useLocalSearchParams<{ id: string }>()
    const item = getEquipmentById(id)

    function handleEdit() {
        router.push(`/equipment/${id}/edit`)
    }

    function handleDelete() {
        Alert.alert(t('equipment.deleteConfirmTitle'), t('equipment.deleteConfirmMessage'), [
            { text: t('account.cancel'), style: 'cancel' },
            {
                text: t('equipment.delete'),
                style: 'destructive',
                onPress: () => {
                    deleteEquipment(id)
                    router.back()
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
                <View style={styles.emptyState}>
                    <Ionicons name='alert-circle-outline' size={40} color='#D1D5DB' />
                    <Text style={styles.emptyText}>{t('equipment.notFound')}</Text>
                </View>
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
                            <Text style={styles.deviceSub}>{item.category}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <InfoRow label={t('equipment.meterId')} value={item.meterId} />
                    <InfoRow label={t('equipment.phase')} value={item.phase} />
                    <InfoRow label='kW' value={String(item.kw)} />
                    <InfoRow label='A' value={String(item.a)} />
                    <InfoRow label='V' value={String(item.v)} />
                </View>

                <TouchableOpacity style={styles.deleteCard} onPress={handleDelete}>
                    <Ionicons name='trash-outline' size={18} color='#DC2626' />
                    <Text style={styles.deleteText}>{t('equipment.delete')}</Text>
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
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 8 },
    emptyText: { fontSize: 13, color: '#9CA3AF' },
})
