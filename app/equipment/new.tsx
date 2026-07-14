import { useAuth } from '@/src/context/AuthContext'
import { useDevices } from '@/src/context/DevicesContext'
import { createDevice } from '@/src/services/devices'
import { getGateWays } from '@/src/services/gateways'
import { IGateway } from '@/src/type'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'

const TYPE_OPTIONS = ['空壓機', 'CNC', '空調', '照明', '其他']
const PHASE_OPTIONS = ['單相', '三相'] as const

export default function NewEquipmentScreen() {
    const { t } = useTranslation()
    const { user, tokens } = useAuth()
    const { fetchDevices } = useDevices()

    const [name, setName] = useState('')
    const [gatewayId, setGatewayId] = useState('')
    const [externalId, setExternalId] = useState('')
    const [type, setType] = useState(TYPE_OPTIONS[0])
    const [phase, setPhase] = useState<(typeof PHASE_OPTIONS)[number]>(PHASE_OPTIONS[0])
    const [ratedVoltage, setRatedVoltage] = useState('')
    const [ratedCurrent, setRatedCurrent] = useState('')
    const [ratedPowerKw, setRatedPowerKw] = useState('')
    const [ctRatio, setCtRatio] = useState('')

    const [alertsEnabled, setAlertsEnabled] = useState(true)
    const [powerSpike, setPowerSpike] = useState('')
    const [overcurrent, setOvercurrent] = useState('')
    const [noDataTimeout, setNoDataTimeout] = useState('')
    const [imbalance, setImbalance] = useState('')

    const [gateways, setGateways] = useState<IGateway[]>([])
    const [gatewayPickerVisible, setGatewayPickerVisible] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!user?.organizationId || !tokens?.accessToken) return
        getGateWays(user.organizationId, tokens.accessToken)
            .then((list) => {
                setGateways(list)
                if (list.length > 0) setGatewayId((prev) => prev || list[0].id)
            })
            .catch(() => {})
    }, [user?.organizationId, tokens?.accessToken])

    const selectedGateway = gateways.find((g) => g.id === gatewayId)

    function parseOrNull(value: string): number | null {
        const trimmed = value.trim()
        if (!trimmed) return null
        const n = parseFloat(trimmed)
        return Number.isNaN(n) ? null : n
    }

    async function handleSave() {
        if (!name.trim() || !externalId.trim()) {
            Alert.alert(t('equipment.validationTitle'), t('equipment.validationMessage'))
            return
        }
        if (!gatewayId) {
            Alert.alert(t('equipment.validationTitle'), t('equipment.selectGatewayRequired'))
            return
        }
        if (!user?.organizationId) return

        setSaving(true)
        try {
            await createDevice(user.organizationId, {
                name: name.trim(),
                gateway_id: gatewayId,
                device_id_external: externalId.trim(),
                device_type: type,
                phase: phase === '三相' ? 2 : 1,
                rated_voltage: parseFloat(ratedVoltage) || 0,
                rated_current: parseFloat(ratedCurrent) || 0,
                rated_power_kw: parseFloat(ratedPowerKw) || 0,
                ct_ratio: parseOrNull(ctRatio),
                alerts_enabled: alertsEnabled,
                alert_power_spike_threshold: parseOrNull(powerSpike),
                alert_overcurrent_threshold: parseOrNull(overcurrent),
                alert_no_data_timeout: parseOrNull(noDataTimeout),
                alert_imbalance_threshold: parseOrNull(imbalance),
            })
            await fetchDevices({ silent: true })
            router.back()
        } catch (err) {
            Alert.alert(t('equipment.saveFailed'))
        } finally {
            setSaving(false)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backArea} onPress={() => router.back()} hitSlop={10}>
                    <Ionicons name='chevron-back' size={22} color='#111827' />
                    <Text style={styles.title}>{t('equipment.newTitle')}</Text>
                </TouchableOpacity>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>{t('equipment.name')}</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder={t('equipment.namePlaceholder')}
                    placeholderTextColor='#9CA3AF'
                />

                <Text style={styles.label}>{t('equipment.gateway')}</Text>
                <TouchableOpacity style={styles.selectInput} onPress={() => setGatewayPickerVisible(true)}>
                    <Text style={selectedGateway ? styles.selectValue : styles.selectPlaceholder}>
                        {selectedGateway?.name ?? t('equipment.selectGateway')}
                    </Text>
                    <Ionicons name='chevron-down' size={16} color='#9CA3AF' />
                </TouchableOpacity>

                <Text style={styles.label}>{t('equipment.meterId')}</Text>
                <TextInput
                    style={styles.input}
                    value={externalId}
                    onChangeText={setExternalId}
                    placeholder='meter_XX'
                    placeholderTextColor='#9CA3AF'
                />

                <Text style={styles.label}>{t('equipment.category')}</Text>
                <View style={styles.chipRow}>
                    {TYPE_OPTIONS.map((opt) => (
                        <TouchableOpacity
                            key={opt}
                            style={[styles.chip, type === opt && styles.chipActive]}
                            onPress={() => setType(opt)}>
                            <Text style={[styles.chipText, type === opt && styles.chipTextActive]}>{opt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>{t('equipment.phase')}</Text>
                <View style={styles.chipRow}>
                    {PHASE_OPTIONS.map((opt) => (
                        <TouchableOpacity
                            key={opt}
                            style={[styles.chip, phase === opt && styles.chipActive]}
                            onPress={() => setPhase(opt)}>
                            <Text style={[styles.chipText, phase === opt && styles.chipTextActive]}>{opt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.specRow}>
                    <View style={styles.specField}>
                        <Text style={styles.label}>{t('equipment.ratedVoltage')} (V)</Text>
                        <TextInput
                            style={styles.input}
                            value={ratedVoltage}
                            onChangeText={setRatedVoltage}
                            keyboardType='numeric'
                            placeholder='0'
                            placeholderTextColor='#9CA3AF'
                        />
                    </View>
                    <View style={styles.specField}>
                        <Text style={styles.label}>{t('equipment.ratedCurrent')} (A)</Text>
                        <TextInput
                            style={styles.input}
                            value={ratedCurrent}
                            onChangeText={setRatedCurrent}
                            keyboardType='numeric'
                            placeholder='0'
                            placeholderTextColor='#9CA3AF'
                        />
                    </View>
                </View>

                <View style={styles.specRow}>
                    <View style={styles.specField}>
                        <Text style={styles.label}>{t('equipment.ratedPower')} (kW)</Text>
                        <TextInput
                            style={styles.input}
                            value={ratedPowerKw}
                            onChangeText={setRatedPowerKw}
                            keyboardType='numeric'
                            placeholder='0'
                            placeholderTextColor='#9CA3AF'
                        />
                    </View>
                    <View style={styles.specField}>
                        <Text style={styles.label}>{t('equipment.ctRatio')}</Text>
                        <TextInput
                            style={styles.input}
                            value={ctRatio}
                            onChangeText={setCtRatio}
                            keyboardType='numeric'
                            placeholder='1.0'
                            placeholderTextColor='#9CA3AF'
                        />
                    </View>
                </View>

                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>{t('equipment.alertSettings')}</Text>
                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>{t('equipment.enableAlerts')}</Text>
                        <Switch value={alertsEnabled} onValueChange={setAlertsEnabled} />
                    </View>
                </View>

                <View style={styles.specRow}>
                    <View style={styles.specField}>
                        <Text style={styles.label}>{t('equipment.powerSpikeThreshold')} (kW)</Text>
                        <TextInput
                            style={styles.input}
                            value={powerSpike}
                            onChangeText={setPowerSpike}
                            keyboardType='numeric'
                            placeholder={t('equipment.useDefault')}
                            placeholderTextColor='#9CA3AF'
                        />
                    </View>
                    <View style={styles.specField}>
                        <Text style={styles.label}>{t('equipment.overcurrentThreshold')} (A)</Text>
                        <TextInput
                            style={styles.input}
                            value={overcurrent}
                            onChangeText={setOvercurrent}
                            keyboardType='numeric'
                            placeholder={t('equipment.useDefault')}
                            placeholderTextColor='#9CA3AF'
                        />
                    </View>
                </View>

                <View style={styles.specRow}>
                    <View style={styles.specField}>
                        <Text style={styles.label}>{t('equipment.noDataTimeout')} (s)</Text>
                        <TextInput
                            style={styles.input}
                            value={noDataTimeout}
                            onChangeText={setNoDataTimeout}
                            keyboardType='numeric'
                            placeholder={t('equipment.useDefault')}
                            placeholderTextColor='#9CA3AF'
                        />
                    </View>
                    <View style={styles.specField}>
                        <Text style={styles.label}>{t('equipment.imbalanceThreshold')} (0~1)</Text>
                        <TextInput
                            style={styles.input}
                            value={imbalance}
                            onChangeText={setImbalance}
                            keyboardType='numeric'
                            placeholder={t('equipment.useDefault')}
                            placeholderTextColor='#9CA3AF'
                        />
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    activeOpacity={0.85}
                    disabled={saving}>
                    <Text style={styles.saveButtonText}>{saving ? t('equipment.saving') : t('equipment.save')}</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={gatewayPickerVisible}
                animationType='slide'
                transparent
                onRequestClose={() => setGatewayPickerVisible(false)}>
                <TouchableOpacity
                    style={styles.pickerOverlay}
                    activeOpacity={1}
                    onPress={() => setGatewayPickerVisible(false)}>
                    <View style={styles.pickerSheet}>
                        <Text style={styles.pickerTitle}>{t('equipment.selectGateway')}</Text>
                        {gateways.map((gw) => (
                            <TouchableOpacity
                                key={gw.id}
                                style={styles.pickerRow}
                                onPress={() => {
                                    setGatewayId(gw.id)
                                    setGatewayPickerVisible(false)
                                }}>
                                <Text style={styles.pickerRowText}>{gw.name}</Text>
                                {gw.id === gatewayId && <Ionicons name='checkmark' size={18} color='#16352A' />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
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
    backArea: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    title: { fontSize: 17, fontWeight: '700', color: '#111827' },
    form: { paddingHorizontal: 16, paddingBottom: 20, gap: 4 },
    label: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginTop: 14, marginBottom: 6 },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#111827',
    },
    selectInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectValue: { fontSize: 14, color: '#111827' },
    selectPlaceholder: { fontSize: 14, color: '#9CA3AF' },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    chipActive: { backgroundColor: '#16352A', borderColor: '#16352A' },
    chipText: { fontSize: 13, color: '#374151', fontWeight: '500' },
    chipTextActive: { color: '#FFFFFF' },
    specRow: { flexDirection: 'row', gap: 10 },
    specField: { flex: 1 },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 22,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
    switchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    switchLabel: { fontSize: 12, color: '#6B7280' },
    footer: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        backgroundColor: '#F9FAFB',
    },
    saveButton: { backgroundColor: '#16352A', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
    saveButtonDisabled: { opacity: 0.6 },
    saveButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
    pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    pickerSheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 32,
    },
    pickerTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 8 },
    pickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    pickerRowText: { fontSize: 14, color: '#111827' },
})
