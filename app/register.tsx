import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { ApiError, apiFetch } from '../src/services/api'

type FieldName = 'inviteCode' | 'username' | 'name' | 'password' | 'confirmPassword'
const webNoOutlineStyle = { outlineStyle: 'none', boxShadow: 'none' } as any

export default function RegisterScreen() {
    const { t } = useTranslation()
    const [inviteCode, setInviteCode] = useState('')
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [focusedField, setFocusedField] = useState<FieldName | null>(null)

    async function handleRegister() {
        if (password !== confirmPassword) {
            Alert.alert(t('register.registerFailed'), t('register.passwordMismatch'))
            return
        }

        setSubmitting(true)
        try {
            await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    invite_code: inviteCode,
                    username,
                    name,
                    password,
                }),
            })

            Alert.alert(t('register.registerSuccess'), t('register.registerSuccessMessage'), [
                { text: 'OK', onPress: () => router.replace('/login') },
            ])
        } catch (err) {
            const message = err instanceof ApiError ? err.message : (err as Error).message
            Alert.alert(t('register.registerFailed'), message)
        } finally {
            setSubmitting(false)
        }
    }

    function goToLogin() {
        if (router.canGoBack()) {
            router.back()
        } else {
            router.replace('/login')
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <TouchableOpacity style={styles.backButton} onPress={goToLogin} hitSlop={10}>
                <Ionicons name='chevron-back' size={22} color='#FFFFFF' />
            </TouchableOpacity>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{t('register.title')}</Text>

                <View style={styles.card}>
                    <View style={styles.field}>
                        <Text style={styles.label}>{t('register.factoryCode')}</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'inviteCode' && styles.inputFocused,
                                webNoOutlineStyle,
                            ]}
                            autoCapitalize='none'
                            value={inviteCode}
                            onChangeText={setInviteCode}
                            onFocus={() => setFocusedField('inviteCode')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>{t('register.username')}</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'username' && styles.inputFocused,
                                webNoOutlineStyle,
                            ]}
                            autoCapitalize='none'
                            value={username}
                            onChangeText={setUsername}
                            onFocus={() => setFocusedField('username')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>{t('register.name')}</Text>
                        <TextInput
                            style={[styles.input, focusedField === 'name' && styles.inputFocused, webNoOutlineStyle]}
                            value={name}
                            onChangeText={setName}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>{t('register.password')}</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'password' && styles.inputFocused,
                                webNoOutlineStyle,
                            ]}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>{t('register.confirmPassword')}</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'confirmPassword' && styles.inputFocused,
                                webNoOutlineStyle,
                            ]}
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            onFocus={() => setFocusedField('confirmPassword')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, submitting && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={submitting}>
                        <Text style={styles.buttonText}>
                            {submitting ? t('register.registering') : t('register.registerButton')}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.loginRow}>
                        <Text style={styles.loginRowText}>{t('register.haveAccount', '已經有帳號？')}</Text>
                        <TouchableOpacity onPress={goToLogin} hitSlop={6}>
                            <Text style={styles.loginRowLink}>{t('register.loginNow', '登入')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#22C55E',
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 56 : 32,
        left: 16,
        zIndex: 10,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 32,
        paddingHorizontal: 24,
    },
    field: { marginBottom: 18 },
    label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#111827',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    inputFocused: {
        borderColor: '#22C55E',
    },
    button: {
        backgroundColor: '#86EFAC',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        gap: 4,
    },
    loginRowText: { fontSize: 13, color: '#6B7280' },
    loginRowLink: { fontSize: 13, color: '#16A34A', fontWeight: '700' },
})
