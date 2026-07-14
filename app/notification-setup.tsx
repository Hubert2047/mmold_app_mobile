import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { router } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const NTFY_SERVER = 'https://ntfy.mmold.com'
const TOPIC_NAME = 'user_b0461514-70eb-4ae7-a6c7-11383...' // TODO: thay bằng topic thật của user

function CopyField({ value }: { value: string }) {
    const { t } = useTranslation()
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        await Clipboard.setStringAsync(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <View style={styles.copyField}>
            <Text style={styles.copyValue} numberOfLines={1} ellipsizeMode='middle'>
                {value}
            </Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopy} hitSlop={6}>
                <Ionicons
                    name={copied ? 'checkmark' : 'copy-outline'}
                    size={14}
                    color={copied ? '#1F4D3A' : '#6B7280'}
                />
                <Text style={[styles.copyButtonText, copied && styles.copyButtonTextActive]}>
                    {copied ? t('notifications.copied') : t('notifications.copy')}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

function StepItem({ index, title, children }: { index: number; title: string; children: React.ReactNode }) {
    return (
        <View style={styles.stepRow}>
            <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{index}</Text>
            </View>
            <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{title}</Text>
                {children}
            </View>
        </View>
    )
}

export default function NotificationSetupScreen() {
    const { t } = useTranslation()

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backArea} onPress={() => router.back()} hitSlop={10}>
                    <Ionicons name='chevron-back' size={22} color='#111827' />
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {t('notifications.title')}
                    </Text>
                </TouchableOpacity>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <View style={styles.cardTitleRow}>
                        <Ionicons name='notifications' size={16} color='#1F4D3A' />
                        <Text style={styles.cardTitle}>{t('notifications.title')}</Text>
                    </View>

                    <Text style={styles.intro}>{t('notifications.intro')}</Text>

                    <View style={styles.divider} />

                    <StepItem index={1} title={t('notifications.step1Title')}>
                        <Text style={styles.stepDesc}>
                            Android 用戶到{' '}
                            <Text
                                style={styles.link}
                                onPress={() =>
                                    Linking.openURL('https://play.google.com/store/apps/details?id=io.heckel.ntfy')
                                }>
                                Google Play
                            </Text>
                            ，iOS 用戶到{' '}
                            <Text
                                style={styles.link}
                                onPress={() => Linking.openURL('https://apps.apple.com/app/ntfy/id1625396347')}>
                                App Store
                            </Text>
                            ，搜尋「ntfy」並安裝。
                        </Text>
                    </StepItem>

                    <StepItem index={2} title={t('notifications.step2Title')}>
                        <Text style={styles.stepDesc}>
                            {t('notifications.step2Desc', '在 ntfy app → Settings → Default server 填入：')}
                        </Text>
                        <CopyField value={NTFY_SERVER} />
                    </StepItem>

                    <StepItem index={3} title={t('notifications.step3Title')}>
                        <Text style={styles.stepDesc}>{t('notifications.step3Desc')}</Text>
                        <CopyField value={TOPIC_NAME} />
                    </StepItem>

                    <View style={styles.warningBox}>
                        <Ionicons name='warning' size={14} color='#B45309' style={{ marginTop: 1 }} />
                        <Text style={styles.warningText}>{t('notifications.warning')}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#EAF7EF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
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
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    content: { paddingHorizontal: 20, paddingBottom: 40 },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
    },
    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    intro: {
        fontSize: 12.5,
        lineHeight: 19,
        color: '#6B7280',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 16,
    },
    stepRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    stepBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#1F4D3A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    stepContent: { flex: 1 },
    stepTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    stepDesc: {
        fontSize: 12.5,
        lineHeight: 19,
        color: '#6B7280',
    },
    link: {
        color: '#1F4D3A',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    copyField: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginTop: 8,
    },
    copyValue: {
        flex: 1,
        fontSize: 12,
        fontFamily: 'SpaceMono',
        color: '#111827',
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    copyButtonText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#6B7280',
    },
    copyButtonTextActive: {
        color: '#1F4D3A',
    },
    warningBox: {
        flexDirection: 'row',
        gap: 8,
        backgroundColor: '#FFFBEB',
        borderRadius: 10,
        padding: 12,
        marginTop: 4,
    },
    warningText: {
        flex: 1,
        fontSize: 11.5,
        lineHeight: 17,
        color: '#92400E',
    },
})
