import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

type NumberFieldProps = {
    label: string
    value: string
    onChangeText: (value: string) => void
    step?: number
    editing: boolean
    disabled?: boolean
}

function NumberField({ label, value, onChangeText, step = 1, editing, disabled = false }: NumberFieldProps) {
    function clamp(next: number) {
        const decimals = String(step).split('.')[1]?.length ?? 0
        return decimals > 0 ? Number(next.toFixed(decimals)) : Math.round(next)
    }

    function increment() {
        const current = parseFloat(value) || 0
        onChangeText(String(clamp(current + step)))
    }

    function decrement() {
        const current = parseFloat(value) || 0
        onChangeText(String(clamp(current - step)))
    }

    if (!editing) {
        return (
            <View style={styles.fieldWrapper}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <Text style={[styles.fieldViewValue, disabled && styles.fieldLabelDisabled]}>{value}</Text>
            </View>
        )
    }

    return (
        <View style={styles.fieldWrapper}>
            <Text style={[styles.fieldLabel, disabled && styles.fieldLabelDisabled]}>{label}</Text>
            <View style={[styles.fieldInputRow, disabled && styles.fieldInputRowDisabled]}>
                <TextInput
                    style={[styles.fieldInput, disabled && styles.fieldInputDisabled]}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType='numeric'
                    editable={!disabled}
                />
                <View style={styles.stepperColumn}>
                    <TouchableOpacity onPress={increment} disabled={disabled} hitSlop={6}>
                        <Ionicons name='chevron-up' size={13} color={disabled ? '#E5E7EB' : '#9CA3AF'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={decrement} disabled={disabled} hitSlop={6}>
                        <Ionicons name='chevron-down' size={13} color={disabled ? '#E5E7EB' : '#9CA3AF'} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

function SavedToast({ visible }: { visible: boolean }) {
    const { t } = useTranslation()
    const opacity = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
                Animated.delay(1200),
                Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
            ]).start()
        }
    }, [visible])

    return (
        <Animated.View style={[styles.toast, { opacity }]} pointerEvents='none'>
            <Ionicons name='checkmark-circle' size={15} color='#FFFFFF' />
            <Text style={styles.toastText}>{t('systemSettings.saved')}</Text>
        </Animated.View>
    )
}

export default function SystemSettingsScreen() {
    const { t } = useTranslation()
    const [isEditing, setIsEditing] = useState(false)
    const [showToast, setShowToast] = useState(false)

    const [carbonFactor, setCarbonFactor] = useState('0.509')
    const [standbyThreshold, setStandbyThreshold] = useState('0.5')
    const [idleTimeout, setIdleTimeout] = useState('5')
    const [electricityRate, setElectricityRate] = useState('3.5')
    const [currentLimit, setCurrentLimit] = useState('70')
    const [oeeTarget] = useState('85')

    const [backup, setBackup] = useState<null | {
        carbonFactor: string
        standbyThreshold: string
        idleTimeout: string
        electricityRate: string
        currentLimit: string
    }>(null)

    function handleEnterEdit() {
        setBackup({ carbonFactor, standbyThreshold, idleTimeout, electricityRate, currentLimit })
        setIsEditing(true)
    }

    function handleCancel() {
        if (backup) {
            setCarbonFactor(backup.carbonFactor)
            setStandbyThreshold(backup.standbyThreshold)
            setIdleTimeout(backup.idleTimeout)
            setElectricityRate(backup.electricityRate)
            setCurrentLimit(backup.currentLimit)
        }
        setIsEditing(false)
    }

    function handleDone() {
        setIsEditing(false)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 1600)
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backArea} onPress={() => router.back()} hitSlop={10}>
                    <Ionicons name='chevron-back' size={22} color='#111827' />
                    <Text style={styles.title}>{t('systemSettings.title')}</Text>
                </TouchableOpacity>

                {isEditing ? (
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={handleCancel} hitSlop={10} style={styles.textButton}>
                            <Text style={styles.cancelText}>{t('systemSettings.cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDone} hitSlop={10} style={styles.textButton}>
                            <Text style={styles.doneText}>{t('systemSettings.done')}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={handleEnterEdit} hitSlop={10} style={styles.textButton}>
                        <Text style={styles.editText}>{t('systemSettings.edit')}</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>{t('systemSettings.operatingParams')}</Text>
                    <View style={styles.grid}>
                        <NumberField
                            label={t('systemSettings.carbonFactor')}
                            value={carbonFactor}
                            onChangeText={setCarbonFactor}
                            step={0.001}
                            editing={isEditing}
                        />
                        <NumberField
                            label={t('systemSettings.standbyThreshold')}
                            value={standbyThreshold}
                            onChangeText={setStandbyThreshold}
                            step={0.1}
                            editing={isEditing}
                        />
                        <NumberField
                            label={t('systemSettings.idleTimeout')}
                            value={idleTimeout}
                            onChangeText={setIdleTimeout}
                            step={1}
                            editing={isEditing}
                        />
                        <NumberField
                            label={t('systemSettings.electricityRate')}
                            value={electricityRate}
                            onChangeText={setElectricityRate}
                            step={0.1}
                            editing={isEditing}
                        />
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>{t('systemSettings.processThresholds')}</Text>
                    <View style={styles.grid}>
                        <NumberField
                            label={t('systemSettings.currentLimit')}
                            value={currentLimit}
                            onChangeText={setCurrentLimit}
                            step={1}
                            editing={isEditing}
                        />
                        <NumberField
                            label={t('systemSettings.oeeTarget')}
                            value={oeeTarget}
                            onChangeText={() => {}}
                            editing={isEditing}
                            disabled
                        />
                    </View>
                </View>
            </ScrollView>

            <SavedToast visible={showToast} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#EAF7EF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 14,
        gap: 10,
    },
    backArea: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    textButton: {
        minWidth: 40,
        alignItems: 'flex-end',
    },
    cancelText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#9CA3AF',
    },
    editText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1F4D3A',
    },
    doneText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F4D3A',
    },
    content: { paddingHorizontal: 20, paddingBottom: 40, gap: 14 },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 14,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 16,
        columnGap: 12,
    },
    fieldWrapper: {
        width: '47%',
    },
    fieldLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 6,
    },
    fieldLabelDisabled: {
        color: '#D1D5DB',
    },
    fieldViewValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        paddingVertical: 10,
    },
    fieldInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    fieldInputRowDisabled: {
        backgroundColor: '#F3F4F6',
        borderColor: '#F3F4F6',
    },
    fieldInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        padding: 0,
    },
    fieldInputDisabled: {
        color: '#D1D5DB',
    },
    stepperColumn: {
        gap: 2,
        alignItems: 'center',
    },
    toast: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#1F4D3A',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    toastText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
})
