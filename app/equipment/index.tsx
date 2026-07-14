import { deleteEquipment, Equipment, getEquipmentList } from '@/src/data/equipment'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { router } from 'expo-router'
import { useCallback, useMemo, useRef, useState, type ComponentRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
export default function EquipmentManagementScreen() {
    const { t } = useTranslation()
    const [equipment, setEquipment] = useState<Equipment[]>(getEquipmentList())
    const [searchText, setSearchText] = useState('')
    const swipeableRefs = useRef<Map<string, ComponentRef<typeof Swipeable>>>(new Map())

    useFocusEffect(
        useCallback(() => {
            setEquipment([...getEquipmentList()])
        }, []),
    )

    const filteredEquipment = useMemo(() => {
        const query = searchText.trim().toLowerCase()
        if (!query) return equipment
        return equipment.filter(
            (item) =>
                item.name.toLowerCase().includes(query) ||
                item.meterId.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query),
        )
    }, [equipment, searchText])

    function closeOtherSwipeables(exceptId: string) {
        swipeableRefs.current.forEach((ref, id) => {
            if (id !== exceptId) ref.close()
        })
    }

    function handleEdit(item: Equipment) {
        swipeableRefs.current.get(item.id)?.close()
        router.push(`/equipment/${item.id}/edit`)
    }

    function handleDelete(item: Equipment) {
        swipeableRefs.current.get(item.id)?.close()
        deleteEquipment(item.id)
        setEquipment([...getEquipmentList()])
    }

    function handleAdd() {
        router.push('/equipment/new')
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
                    <Ionicons name='chevron-back' size={22} color='#111827' />
                </TouchableOpacity>
                <Text style={styles.title}>{t('equipment.title', '設備管理')}</Text>
                <View style={{ width: 22 }} />
            </View>

            <View style={styles.searchBar}>
                <Ionicons name='search' size={16} color='#9CA3AF' />
                <TextInput
                    style={styles.searchInput}
                    placeholder={t('equipment.searchPlaceholder', '搜尋設備名稱、ID、類型...')}
                    placeholderTextColor='#9CA3AF'
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            <FlatList
                data={filteredEquipment}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Swipeable
                        ref={(ref) => {
                            if (ref) swipeableRefs.current.set(item.id, ref)
                            else swipeableRefs.current.delete(item.id)
                        }}
                        onSwipeableWillOpen={() => closeOtherSwipeables(item.id)}
                        renderRightActions={() => (
                            <View style={styles.swipeActions}>
                                <TouchableOpacity
                                    style={[styles.swipeButton, styles.editButton]}
                                    onPress={() => handleEdit(item)}>
                                    <Ionicons name='pencil' size={18} color='#2563EB' />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.swipeButton, styles.deleteButton]}
                                    onPress={() => handleDelete(item)}>
                                    <Ionicons name='trash' size={18} color='#DC2626' />
                                </TouchableOpacity>
                            </View>
                        )}>
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => router.push(`/equipment/${item.id}`)}
                            activeOpacity={0.7}>
                            <View style={styles.cardTopRow}>
                                <View style={styles.iconBox}>
                                    <Ionicons name='speedometer-outline' size={16} color='#6B7280' />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.deviceName}>{item.name}</Text>
                                    <Text style={styles.deviceSub}>
                                        {item.category} · {item.meterId} · {item.phase}
                                    </Text>
                                </View>
                                <Ionicons name='chevron-forward' size={16} color='#D1D5DB' />
                            </View>

                            <View style={styles.specRow}>
                                <View style={styles.specPill}>
                                    <Text style={styles.specText}>{item.kw} kw</Text>
                                </View>
                                <View style={styles.specPill}>
                                    <Text style={styles.specText}>{item.a} A</Text>
                                </View>
                                <View style={styles.specPill}>
                                    <Text style={styles.specText}>{item.v} v</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Swipeable>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name='cube-outline' size={40} color='#D1D5DB' />
                        <Text style={styles.emptyText}>{t('equipment.noResults', '找不到符合的設備')}</Text>
                    </View>
                }
            />

            <TouchableOpacity style={styles.fab} onPress={handleAdd} activeOpacity={0.85}>
                <Ionicons name='add' size={26} color='#FFFFFF' />
            </TouchableOpacity>
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
    title: { fontSize: 17, fontWeight: '700', color: '#111827' },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
        marginHorizontal: 16,
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 13,
        color: '#111827',
    },
    listContent: { paddingHorizontal: 16, paddingBottom: 100 },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
    },
    cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deviceName: { fontSize: 14, fontWeight: '700', color: '#111827' },
    deviceSub: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
    specRow: { flexDirection: 'row', gap: 6, marginTop: 10 },
    specPill: {
        backgroundColor: '#F3F4F6',
        borderRadius: 6,
        paddingVertical: 3,
        paddingHorizontal: 8,
    },
    specText: { fontSize: 11, color: '#374151', fontWeight: '500' },
    swipeActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
        marginLeft: 6,
    },
    swipeButton: {
        width: 52,
        height: '100%',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButton: { backgroundColor: '#DBEAFE' },
    deleteButton: { backgroundColor: '#FEE2E2' },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#16352A',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        gap: 8,
    },
    emptyText: { fontSize: 13, color: '#9CA3AF' },
})
