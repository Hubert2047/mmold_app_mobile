import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Severity = 'HIGH' | 'MEDIUM' | 'LOW'

interface AlertItem {
    id: string
    deviceName: string
    category: string
    subCategory: string
    severity: Severity
    time: string
    description: string
}

const MOCK_ALERTS: AlertItem[] = [
    {
        id: '1',
        deviceName: '冷卻水塔',
        category: '電力品質',
        subCategory: '功率突波',
        severity: 'HIGH',
        time: '2026/4/14 下午3:02:40',
        description: '設備 冷卻水塔 功率突波: 5.19 kW (閾值: 5.00 kW)',
    },
    {
        id: '2',
        deviceName: '1號空壓機',
        category: '電力品質',
        subCategory: '功率突波',
        severity: 'HIGH',
        time: '2026/4/14 下午3:00:39',
        description: '設備 1號空壓機 功率突波: 5.55 kW (閾值: 5.00 kW)',
    },
    {
        id: '3',
        deviceName: '電梯',
        category: '電力品質',
        subCategory: '功率突波',
        severity: 'HIGH',
        time: '2026/4/14 下午3:00:39',
        description: '設備 電梯 功率突波: 7.79 kW (閾值: 5.00 kW)',
    },
    {
        id: '4',
        deviceName: '3號空壓機',
        category: '電力品質',
        subCategory: '功率突波',
        severity: 'HIGH',
        time: '2026/4/14 下午3:00:39',
        description: '設備 3號空壓機 功率突波: 7.68 kW (閾值: 5.00 kW)',
    },
]

// 'all' 與 'powerQuality' 是穩定的內部篩選 key（不隨語系變動）
const FILTERS = ['all', 'powerQuality'] as const
type FilterType = (typeof FILTERS)[number]

// alert.category 目前是 mock data 內的原始標籤，用來跟篩選 key 對應
const CATEGORY_BY_FILTER: Record<FilterType, string | null> = {
    all: null,
    powerQuality: '電力品質',
}

export default function AlertsScreen() {
    const { t } = useTranslation()
    const [activeFilter, setActiveFilter] = useState<FilterType>('all')

    const highCount = MOCK_ALERTS.filter((a) => a.severity === 'HIGH').length
    const mediumCount = MOCK_ALERTS.filter((a) => a.severity === 'MEDIUM').length
    const lowCount = MOCK_ALERTS.filter((a) => a.severity === 'LOW').length

    const targetCategory = CATEGORY_BY_FILTER[activeFilter]
    const filteredAlerts =
        targetCategory === null ? MOCK_ALERTS : MOCK_ALERTS.filter((a) => a.category === targetCategory)

    function filterLabel(filter: FilterType) {
        return filter === 'all' ? t('alerts.allCategories') : t('alerts.powerQuality')
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerSide} />
                <Text style={styles.title}>{t('tabs.alerts')}</Text>
                <View style={styles.headerSide}>
                    <TouchableOpacity style={styles.recordButton}>
                        <Ionicons name='document-text-outline' size={16} color='#111827' />
                        <Text style={styles.recordButtonText}>{t('alerts.record')}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.filterGroup}>
                <Text style={styles.groupLabel}>{t('alerts.riskLevel')}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                    <View style={[styles.chip, styles.chipActive]}>
                        <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                        <Text style={styles.chipTextActive}>
                            {t('alerts.highRisk')} ({highCount})
                        </Text>
                    </View>
                    <View style={styles.chip}>
                        <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
                        <Text style={styles.chipText}>
                            {t('alerts.mediumRisk')} ({mediumCount})
                        </Text>
                    </View>
                    <View style={styles.chip}>
                        <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
                        <Text style={styles.chipText}>
                            {t('alerts.lowRisk')} ({lowCount})
                        </Text>
                    </View>
                </ScrollView>
            </View>

            <View style={styles.divider} />

            <View style={styles.filterGroup}>
                <Text style={styles.groupLabel}>{t('alerts.category')}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                    {FILTERS.map((filter) => {
                        const isActive = filter === activeFilter
                        return (
                            <TouchableOpacity
                                key={filter}
                                style={[styles.chip, isActive && styles.chipActive]}
                                onPress={() => setActiveFilter(filter)}>
                                <Text style={isActive ? styles.chipTextActive : styles.chipText}>
                                    {filterLabel(filter)}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </View>

            <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
                {filteredAlerts.map((alert) => (
                    <View key={alert.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.deviceName}>{alert.deviceName}</Text>
                            <View style={styles.severityBadge}>
                                <Text style={styles.severityText}>{alert.severity}</Text>
                            </View>
                        </View>

                        <View style={styles.tagRow}>
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>{alert.category}</Text>
                            </View>
                            <Text style={styles.subCategoryText}>{alert.subCategory}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{t('alerts.time')}</Text>
                            <Text style={styles.infoValue}>{alert.time}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{t('alerts.abnormal')}</Text>
                            <Text style={styles.infoValue}>{alert.description}</Text>
                        </View>

                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.actionButtonText}>{t('alerts.excludeReport')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

const DARK_GREEN = '#16352A'

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB', paddingTop: 60, paddingHorizontal: 20 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    headerSide: {
        minWidth: 70,
        alignItems: 'flex-end',
    },
    title: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', flex: 1 },
    recordButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    recordButtonText: { fontSize: 13, color: '#111827', fontWeight: '500' },

    filterGroup: { marginBottom: 4 },
    groupLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 6 },
    chipRow: { flexDirection: 'row', gap: 8, paddingBottom: 2 },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
    },
    chipActive: { backgroundColor: DARK_GREEN, borderColor: DARK_GREEN },
    chipText: { fontSize: 12, fontWeight: '500', color: '#111827' },
    chipTextActive: { fontSize: 12, fontWeight: '500', color: '#FFFFFF' },
    dot: { width: 7, height: 7, borderRadius: 4 },

    divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 14 },

    list: { flex: 1, marginTop: 16 },
    listContent: { paddingBottom: 24, gap: 12 },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    deviceName: { fontSize: 16, fontWeight: '700', color: '#111827' },
    severityBadge: {
        backgroundColor: '#FEE2E2',
        borderRadius: 6,
        paddingVertical: 3,
        paddingHorizontal: 8,
    },
    severityText: { fontSize: 11, fontWeight: '700', color: '#DC2626' },

    tagRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    tag: {
        backgroundColor: '#F3F4F6',
        borderRadius: 6,
        paddingVertical: 3,
        paddingHorizontal: 8,
    },
    tagText: { fontSize: 12, color: '#6B7280' },
    subCategoryText: { fontSize: 12, color: '#6B7280' },

    infoRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    infoLabel: { width: 44, fontSize: 13, color: '#9CA3AF' },
    infoValue: { flex: 1, fontSize: 13, color: '#374151' },

    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    actionButton: {
        backgroundColor: DARK_GREEN,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    actionButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
})
