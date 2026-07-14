import { CATEGORY_OPTIONS, getEquipmentById, PHASE_OPTIONS, updateEquipment } from '@/src/data/equipment'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function EditEquipmentScreen() {
    const { t } = useTranslation()
    const { id } = useLocalSearchParams<{ id: string }>()
    const existing = getEquipmentById(id)

    const [name, setName] = useState(existing?.name ?? '')
    const [category, setCategory] = useState(existing?.category ?? CATEGORY_OPTIONS[0].value)
    const [meterId, setMeterId] = useState(existing?.meterId ?? '')
    const [phase, setPhase] = useState(existing?.phase ?? PHASE_OPTIONS[0])
    const [kw, setKw] = useState(existing ? String(existing.kw) : '')
    const [a, setA] = useState(existing ? String(existing.a) : '')
    const [v, setV] = useState(existing ? String(existing.v) : '')

    useEffect(() => {
        if (!existing) {
            Alert.alert(t('equipment.notFound'))
            router.back()
        }
    }, [])

    function handleSave() {
        if (!name.trim() || !meterId.trim()) {
            Alert.alert(t('equipment.validationTitle'), t('equipment.validationMessage'))
            return
        }

        updateEquipment(id, {
            name: name.trim(),
            category,
            meterId: meterId.trim(),
            phase,
            kw: parseFloat(kw) || 0,
            a: parseFloat(a) || 0,
            v: parseFloat(v) || 0,
        })

        router.back()
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backArea} onPress={() => router.back()} hitSlop={10}>
                    <Ionicons name='chevron-back' size={22} color='#111827' />
                    <Text style={styles.title}>{t('equipment.editTitle')}</Text>
                </TouchableOpacity>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>{t('equipment.name')}</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor='#9CA3AF' />

                <Text style={styles.label}>{t('equipment.category')}</Text>
                <View style={styles.chipRow}>
                    {CATEGORY_OPTIONS.map((opt) => (
                        <TouchableOpacity
                            key={opt.value}
                            style={[styles.chip, category === opt.value && styles.chipActive]}
                            onPress={() => setCategory(opt.value)}>
                            <Text style={[styles.chipText, category === opt.value && styles.chipTextActive]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>{t('equipment.meterId')}</Text>
                <TextInput
                    style={styles.input}
                    value={meterId}
                    onChangeText={setMeterId}
                    placeholderTextColor='#9CA3AF'
                />

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
                        <Text style={styles.label}>kW</Text>
                        <TextInput
                            style={styles.input}
                            value={kw}
                            onChangeText={setKw}
                            keyboardType='numeric'
                            placeholderTextColor='#9CA3AF'
                        />
                    </View>
                    <View style={styles.specField}>
                        <Text style={styles.label}>A</Text>
                        <TextInput
                            style={styles.input}
                            value={a}
                            onChangeText={setA}
                            keyboardType='numeric'
                            placeholderTextColor='#9CA3AF'
                        />
                    </View>
                    <View style={styles.specField}>
                        <Text style={styles.label}>V</Text>
                        <TextInput
                            style={styles.input}
                            value={v}
                            onChangeText={setV}
                            keyboardType='numeric'
                            placeholderTextColor='#9CA3AF'
                        />
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
                    <Text style={styles.saveButtonText}>{t('equipment.save')}</Text>
                </TouchableOpacity>
            </View>
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
    footer: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        backgroundColor: '#F9FAFB',
    },
    saveButton: {
        backgroundColor: '#16352A',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    saveButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
})
