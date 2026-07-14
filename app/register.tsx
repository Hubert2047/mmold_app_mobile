import LoadingOverlay from '@/components/LoadingOverlay'
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

const MIN_INVITE_CODE_LENGTH = 7
const MIN_USERNAME_LENGTH = 3
const MIN_PASSWORD_LENGTH = 6

export default function RegisterScreen() {
    const { t } = useTranslation()
    const [inviteCode, setInviteCode] = useState('')
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [focusedField, setFocusedField] = useState<FieldName | null>(null)
    const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
    const [serverFieldError, setServerFieldError] = useState<Partial<Record<FieldName, string>>>({})

    const inviteCodeError =
        serverFieldError.inviteCode ??
        (touched.inviteCode && inviteCode.length > 0 && inviteCode.length < MIN_INVITE_CODE_LENGTH
            ? t('register.inviteCodeTooShort', `工廠代碼至少需 ${MIN_INVITE_CODE_LENGTH} 個字元`)
            : null)

    const usernameError =
        serverFieldError.username ??
        (touched.username && username.length > 0 && username.length < MIN_USERNAME_LENGTH
            ? t('register.usernameTooShort', `帳號至少需 ${MIN_USERNAME_LENGTH} 個字元`)
            : null)

    const passwordError =
        touched.password && password.length > 0 && password.length < MIN_PASSWORD_LENGTH
            ? t('register.passwordTooShort', `密碼至少需 ${MIN_PASSWORD_LENGTH} 個字元`)
            : null

    const confirmPasswordError =
        touched.confirmPassword && confirmPassword.length > 0 && confirmPassword !== password
            ? t('register.passwordMismatch', '兩次密碼不一致')
            : null

    const isFormValid =
        inviteCode.length >= MIN_INVITE_CODE_LENGTH &&
        username.length >= MIN_USERNAME_LENGTH &&
        password.length >= MIN_PASSWORD_LENGTH &&
        password === confirmPassword &&
        name.trim().length > 0

    function markTouched(field: FieldName) {
        setTouched((prev) => ({ ...prev, [field]: true }))
    }

    function clearServerError(field: FieldName) {
        setServerFieldError((prev) => {
            if (!prev[field]) return prev
            const next = { ...prev }
            delete next[field]
            return next
        })
    }

    function mapServerErrorToField(message: string): FieldName | null {
        const lower = message.toLowerCase()
        if (lower.includes('invite code')) return 'inviteCode'
        if (lower.includes('username')) return 'username'
        return null
    }

    async function handleRegister() {
        setTouched({
            inviteCode: true,
            username: true,
            name: true,
            password: true,
            confirmPassword: true,
        })

        if (!isFormValid) {
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
            console.error('Register error:', err)
            const message = err instanceof ApiError ? err.message : t('register.unknownError', '發生未知錯誤')
            const targetField = mapServerErrorToField(message)

            if (targetField === 'inviteCode') {
                setServerFieldError({ inviteCode: t('register.invalidInviteCode', '工廠代碼無效') })
            } else if (targetField === 'username') {
                setServerFieldError({ username: t('register.usernameTaken', '此帳號已被使用') })
            } else {
                Alert.alert(t('register.registerFailed'), message)
            }
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
                keyboardShouldPersistTaps='always'
                showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{t('register.title')}</Text>

                <View style={styles.card}>
                    <View style={styles.field}>
                        <Text style={styles.label}>{t('register.factoryCode')}</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'inviteCode' && styles.inputFocused,
                                inviteCodeError && styles.inputError,
                                webNoOutlineStyle,
                            ]}
                            autoCapitalize='none'
                            value={inviteCode}
                            onChangeText={(text) => {
                                setInviteCode(text)
                                clearServerError('inviteCode')
                            }}
                            onFocus={() => setFocusedField('inviteCode')}
                            onBlur={() => {
                                setFocusedField(null)
                                markTouched('inviteCode')
                            }}
                        />
                        {inviteCodeError && <Text style={styles.errorText}>{inviteCodeError}</Text>}
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>{t('register.username')}</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'username' && styles.inputFocused,
                                usernameError && styles.inputError,
                                webNoOutlineStyle,
                            ]}
                            autoCapitalize='none'
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text)
                                clearServerError('username')
                            }}
                            onFocus={() => setFocusedField('username')}
                            onBlur={() => {
                                setFocusedField(null)
                                markTouched('username')
                            }}
                        />
                        {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>{t('register.name')}</Text>
                        <TextInput
                            style={[styles.input, focusedField === 'name' && styles.inputFocused, webNoOutlineStyle]}
                            value={name}
                            onChangeText={setName}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => {
                                setFocusedField(null)
                                markTouched('name')
                            }}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>{t('register.password')}</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'password' && styles.inputFocused,
                                passwordError && styles.inputError,
                                webNoOutlineStyle,
                            ]}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => {
                                setFocusedField(null)
                                markTouched('password')
                            }}
                        />
                        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>{t('register.confirmPassword')}</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'confirmPassword' && styles.inputFocused,
                                confirmPasswordError && styles.inputError,
                                webNoOutlineStyle,
                            ]}
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            onFocus={() => setFocusedField('confirmPassword')}
                            onBlur={() => {
                                setFocusedField(null)
                                markTouched('confirmPassword')
                            }}
                        />
                        {confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}
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

            <LoadingOverlay visible={submitting} label={t('register.registering')} />
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
    inputError: {
        borderColor: '#EF4444',
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 4,
    },
    button: {
        backgroundColor: '#1F4D3A',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: { opacity: 0.5 },
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
