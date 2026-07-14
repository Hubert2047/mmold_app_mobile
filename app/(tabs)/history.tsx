import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type DeviceStatus = 'offline' | 'standby' | 'idle' | 'production' | 'highload' | 'overload'

interface DeviceHistory {
    id: string
    name: string
    category: string
    meterId: string
    phase: string
    kw: number
    a: number
    v: number
    productionHours: number
    highLoadHours: number
    totalHours: number
    hourly: DeviceStatus[]
}

const STATUS_COLORS: Record<DeviceStatus, string> = {
    offline: '#9CA3AF',
    standby: '#60A5FA',
    idle: '#818CF8',
    production: '#22C55E',
    highload: '#F59E0B',
    overload: '#EF4444',
}

function buildHourly(): DeviceStatus[] {
    return Array.from({ length: 24 }, () => 'offline')
}

const MOCK_DEVICES: DeviceHistory[] = [
    {
        id: '1',
        name: '2號CNC成型機',
        category: 'cnc',
        meterId: 'meter_05',
        phase: '單相',
        kw: 20,
        a: 40,
        v: 220,
        productionHours: 0,
        highLoadHours: 0,
        totalHours: 24,
        hourly: buildHourly(),
    },
    {
        id: '2',
        name: '冷卻水塔',
        category: 'other',
        meterId: 'meter_20',
        phase: '單相',
        kw: 40,
        a: 70,
        v: 220,
        productionHours: 0,
        highLoadHours: 0,
        totalHours: 24,
        hourly: buildHourly(),
    },
    {
        id: '3',
        name: '2號空壓機',
        category: 'compressor',
        meterId: 'meter_02',
        phase: '單相',
        kw: 45,
        a: 80,
        v: 220,
        productionHours: 0,
        highLoadHours: 0,
        totalHours: 24,
        hourly: buildHourly(),
    },
    {
        id: '4',
        name: 'UPS不斷電',
        category: 'other',
        meterId: 'meter_19',
        phase: '3相',
        kw: 2,
        a: 18,
        v: 110,
        productionHours: 0,
        highLoadHours: 0,
        totalHours: 24,
        hourly: buildHourly(),
    },
    {
        id: '5',
        name: '3號CNC成型機',
        category: 'cnc',
        meterId: 'meter_06',
        phase: '3相',
        kw: 13,
        a: 28,
        v: 220,
        productionHours: 0,
        highLoadHours: 0,
        totalHours: 24,
        hourly: buildHourly(),
    },
    {
        id: '6',
        name: '4號CNC成型機',
        category: 'cnc',
        meterId: 'meter_07',
        phase: '3相',
        kw: 13,
        a: 28,
        v: 220,
        productionHours: 0,
        highLoadHours: 0,
        totalHours: 24,
        hourly: buildHourly(),
    },
]

function formatDateDisplay(dateStr: string): string {
    const d = new Date(dateStr)
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

function formatWeekday(dateStr: string): string {
    const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六']
    return weekdays[new Date(dateStr).getDay()]
}

function isToday(dateStr: string): boolean {
    return dateStr === new Date().toISOString().slice(0, 10)
}

export default function HistoryScreen() {
    const { t } = useTranslation()
    const [selectedDate, setSelectedDate] = useState('2026-07-14')

    const totalDevices = MOCK_DEVICES.length
    const producingCount = 0
    const highLoadCount = 0
    const overloadCount = 0

    function goToPreviousDay() {
        const d = new Date(selectedDate)
        d.setDate(d.getDate() - 1)
        setSelectedDate(d.toISOString().slice(0, 10))
    }

    function goToNextDay() {
        const d = new Date(selectedDate)
        d.setDate(d.getDate() + 1)
        setSelectedDate(d.toISOString().slice(0, 10))
    }

    function goToToday() {
        setSelectedDate(new Date().toISOString().slice(0, 10))
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('tabs.history', '歷史')}</Text>
            </View>

            <View style={styles.dateNav}>
                <TouchableOpacity onPress={goToPreviousDay} style={styles.dateNavButton} hitSlop={8}>
                    <Ionicons name='chevron-back' size={18} color='#6B7280' />
                </TouchableOpacity>

                <View style={styles.datePill}>
                    <Ionicons name='calendar-outline' size={14} color='#6B7280' />
                    <Text style={styles.datePillText}>{formatDateDisplay(selectedDate)}</Text>
                    <Text style={styles.datePillWeekday}>{formatWeekday(selectedDate)}</Text>
                </View>

                <TouchableOpacity onPress={goToNextDay} style={styles.dateNavButton} hitSlop={8}>
                    <Ionicons name='chevron-forward' size={18} color='#6B7280' />
                </TouchableOpacity>
            </View>

            {!isToday(selectedDate) && (
                <TouchableOpacity onPress={goToToday}>
                    <Text style={styles.todayLink}>{t('history.backToToday', '回到今天')}</Text>
                </TouchableOpacity>
            )}

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>{t('history.totalDevices', '總設備')}</Text>
                    <Text style={styles.statValue}>
                        {totalDevices}
                        <Text style={styles.statUnit}> {t('history.unitDevice', '台')}</Text>
                    </Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>{t('history.inProduction', '生產中')}</Text>
                    <Text style={[styles.statValue, { color: '#22C55E' }]}>
                        {producingCount}
                        <Text style={styles.statUnit}> {t('history.unitHour', '小時')}</Text>
                    </Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>{t('history.highLoad', '高負載中')}</Text>
                    <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                        {highLoadCount}
                        <Text style={styles.statUnit}> {t('history.unitHour', '小時')}</Text>
                    </Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>{t('history.overload', '過載中')}</Text>
                    <Text style={[styles.statValue, { color: '#EF4444' }]}>
                        {overloadCount}
                        <Text style={styles.statUnit}> {t('history.unitHour', '小時')}</Text>
                    </Text>
                </View>
            </View>

            <View style={styles.legendSection}>
                <Text style={styles.legendTitle}>{t('history.deviceTimeline', '每台裝置歷程')}</Text>
                <View style={styles.legendRow}>
                    <LegendDot color={STATUS_COLORS.offline} label={t('history.status.offline', '離線中')} />
                    <LegendDot color={STATUS_COLORS.standby} label={t('history.status.standby', '停機中')} />
                    <LegendDot color={STATUS_COLORS.idle} label={t('history.status.idle', '待機中')} />
                    <LegendDot color={STATUS_COLORS.production} label={t('history.status.production', '生產中')} />
                    <LegendDot color={STATUS_COLORS.highload} label={t('history.status.highload', '高負載')} />
                    <LegendDot color={STATUS_COLORS.overload} label={t('history.status.overload', '過載中')} />
                </View>
            </View>

            <FlatList
                data={MOCK_DEVICES}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card}>
                        <View style={styles.cardTopRow}>
                            <View style={styles.deviceIconBox}>
                                <Ionicons name='time-outline' size={18} color='#6B7280' />
                            </View>
                            <View style={styles.deviceInfo}>
                                <Text style={styles.deviceName}>{item.name}</Text>
                                <Text style={styles.deviceSub}>
                                    {item.category} · {item.meterId} · {item.phase}
                                </Text>
                            </View>
                            <Text style={styles.ratioText}>
                                <Text style={{ color: '#22C55E' }}>{item.productionHours}</Text>
                                <Text style={{ color: '#9CA3AF' }}> / </Text>
                                <Text style={{ color: '#F59E0B' }}>{item.highLoadHours}</Text>
                                <Text style={{ color: '#9CA3AF' }}> / {item.totalHours}</Text>
                            </Text>
                            <Ionicons name='chevron-forward' size={16} color='#D1D5DB' style={{ marginLeft: 4 }} />
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

                        <View style={styles.timelineRow}>
                            {item.hourly.map((status, index) => (
                                <View
                                    key={index}
                                    style={[styles.timelineBlock, { backgroundColor: STATUS_COLORS[status] + '33' }]}
                                />
                            ))}
                        </View>
                    </TouchableOpacity>
                )}
            />
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB', paddingTop: 56, paddingHorizontal: 16 },
    header: {
        alignItems: 'center',
        marginBottom: 14,
    },
    title: { fontSize: 18, fontWeight: '700', color: '#111827' },

    dateNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginBottom: 6,
    },
    dateNavButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    datePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    datePillText: { fontSize: 13, fontWeight: '700', color: '#111827' },
    datePillWeekday: { fontSize: 12, color: '#9CA3AF' },
    todayLink: {
        textAlign: 'center',
        fontSize: 12,
        color: '#1F4D3A',
        fontWeight: '600',
        marginBottom: 16,
    },

    statsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 8,
    },
    statLabel: { fontSize: 11, color: '#9CA3AF', marginBottom: 4 },
    statValue: { fontSize: 18, fontWeight: '700', color: '#111827' },
    statUnit: { fontSize: 11, fontWeight: '400', color: '#9CA3AF' },

    legendSection: { marginBottom: 12 },
    legendTitle: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 8 },
    legendRow: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 6, columnGap: 10 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    legendDot: { width: 6, height: 6, borderRadius: 3 },
    legendLabel: { fontSize: 11, color: '#6B7280' },

    listContent: { paddingBottom: 24 },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
    },
    cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    deviceIconBox: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deviceInfo: { flex: 1 },
    deviceName: { fontSize: 14, fontWeight: '700', color: '#111827' },
    deviceSub: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
    ratioText: { fontSize: 12, fontWeight: '600' },

    specRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
    specPill: {
        backgroundColor: '#F3F4F6',
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    specText: { fontSize: 11, color: '#374151', fontWeight: '500' },

    timelineRow: { flexDirection: 'row', gap: 3, marginTop: 12 },
    timelineBlock: { flex: 1, height: 10, borderRadius: 2 },
})
