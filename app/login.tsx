import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { useAuth } from '../src/context/AuthContext'
import { ApiError } from '../src/services/api'

type FieldName = 'inviteCode' | 'username' | 'password'
const webNoOutlineStyle = { outlineStyle: 'none', boxShadow: 'none' } as any
const REMEMBERED_CREDENTIALS_KEY = 'remembered_credentials'

export default function LoginScreen() {
    const { login } = useAuth()
    const { t } = useTranslation()
    const [inviteCode, setInviteCode] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [focusedField, setFocusedField] = useState<FieldName | null>(null)
    const [rememberMe, setRememberMe] = useState(false)

    useEffect(() => {
        AsyncStorage.getItem(REMEMBERED_CREDENTIALS_KEY).then((raw) => {
            if (!raw) return
            try {
                const saved = JSON.parse(raw)
                setInviteCode(saved.inviteCode ?? '')
                setUsername(saved.username ?? '')
                setRememberMe(true)
            } catch {}
        })
    }, [])

    async function handleLogin() {
        setSubmitting(true)
        try {
            await login(inviteCode, username, password)

            if (rememberMe) {
                await AsyncStorage.setItem(REMEMBERED_CREDENTIALS_KEY, JSON.stringify({ inviteCode, username }))
            } else {
                await AsyncStorage.removeItem(REMEMBERED_CREDENTIALS_KEY)
            }

            router.replace('/(tabs)')
        } catch (err) {
            const message = err instanceof ApiError ? err.message : (err as Error).message
            Alert.alert(t('login.loginFailed'), message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>{t('login.appName')}</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.field}>
                        <Text style={styles.label}>{t('login.factoryCode')}</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'inviteCode' && styles.inputFocused,
                                webNoOutlineStyle,
                            ]}
                            placeholder={t('login.factoryCode')}
                            placeholderTextColor='#9CA3AF'
                            autoCapitalize='none'
                            value={inviteCode}
                            onChangeText={setInviteCode}
                            onFocus={() => setFocusedField('inviteCode')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>{t('login.username')}</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'username' && styles.inputFocused,
                                webNoOutlineStyle,
                            ]}
                            placeholder={t('login.username')}
                            placeholderTextColor='#9CA3AF'
                            autoCapitalize='none'
                            value={username}
                            onChangeText={setUsername}
                            onFocus={() => setFocusedField('username')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>{t('login.password')}</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'password' && styles.inputFocused,
                                webNoOutlineStyle,
                            ]}
                            placeholder={t('login.password')}
                            placeholderTextColor='#9CA3AF'
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    <Pressable style={styles.rememberRow} onPress={() => setRememberMe(!rememberMe)}>
                        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                            {rememberMe && <Ionicons name='checkmark' size={14} color='#FFFFFF' />}
                        </View>
                        <Text style={styles.rememberText}>{t('login.rememberMe')}</Text>
                    </Pressable>

                    <TouchableOpacity
                        style={[styles.button, submitting && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={submitting}>
                        <Text style={styles.buttonText}>
                            {submitting ? t('login.loggingIn') : t('login.loginButton')}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.registerRow}>
                        <Text style={styles.registerText}>{t('login.firstTime')} </Text>
                        <TouchableOpacity onPress={() => router.push('/register')}>
                            <Text style={styles.registerLink}>{t('login.registerNow')}</Text>
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
        backgroundColor: '#EAF7EF',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    header: {
        marginBottom: 28,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1F2937',
    },
    form: { gap: 16 },
    field: { gap: 6 },
    label: { fontSize: 13, fontWeight: '600', color: '#374151' },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 15,
        color: '#111827',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    inputFocused: {
        borderColor: '#4CAF6D',
    },
    rememberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    checkboxChecked: {
        backgroundColor: '#4CAF6D',
        borderColor: '#4CAF6D',
    },
    rememberText: { fontSize: 13, color: '#374151' },
    button: {
        backgroundColor: '#1F4D3A',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 4,
    },
    registerText: { fontSize: 13, color: '#6B7280' },
    registerLink: { fontSize: 13, color: '#1F4D3A', fontWeight: '600' },
})
