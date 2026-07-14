import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../../src/context/AuthContext'
import { changeLanguage } from '../../src/i18n'

type MenuItem = {
    icon: keyof typeof Ionicons.glyphMap
    iconColor: string
    iconBg: string
    titleKey: string
    descKey: string
    onPress?: () => void
}

const LANGUAGE_OPTIONS: { code: 'en' | 'zh-Hant'; label: string; nativeLabel: string }[] = [
    { code: 'zh-Hant', label: 'Chinese (Traditional)', nativeLabel: '中文（繁體）' },
    { code: 'en', label: 'English', nativeLabel: 'English' },
]

export default function AccountScreen() {
    const { t, i18n } = useTranslation()
    const { logout } = useAuth()
    const [languageModalVisible, setLanguageModalVisible] = useState(false)

    function handleLogout() {
        Alert.alert(t('account.logoutConfirmTitle'), t('account.logoutConfirmMessage'), [
            { text: t('account.cancel'), style: 'cancel' },
            {
                text: t('account.logout'),
                style: 'destructive',
                onPress: async () => {
                    await logout()
                    router.replace('/login')
                },
            },
        ])
    }

    async function handleSelectLanguage(code: 'en' | 'zh-Hant') {
        await changeLanguage(code)
        setLanguageModalVisible(false)
    }

    const currentLanguageLabel = LANGUAGE_OPTIONS.find((opt) => opt.code === i18n.language)?.nativeLabel ?? 'English'

    const menuItems: MenuItem[] = [
        {
            icon: 'construct-outline',
            iconColor: '#374151',
            iconBg: '#F3F4F6',
            titleKey: 'account.equipmentManagement',
            descKey: 'account.equipmentManagementDesc',
        },
        {
            icon: 'settings-outline',
            iconColor: '#374151',
            iconBg: '#F3F4F6',
            titleKey: 'account.systemManagement',
            descKey: 'account.systemManagementDesc',
        },
        {
            icon: 'notifications-outline',
            iconColor: '#374151',
            iconBg: '#F3F4F6',
            titleKey: 'account.notifications',
            descKey: 'account.notificationsDesc',
        },
        {
            icon: 'language-outline',
            iconColor: '#374151',
            iconBg: '#F3F4F6',
            titleKey: 'account.language',
            descKey: 'account.languageDesc',
            onPress: () => setLanguageModalVisible(true),
        },
        {
            icon: 'mail-outline',
            iconColor: '#374151',
            iconBg: '#F3F4F6',
            titleKey: 'account.contactUs',
            descKey: 'account.contactUsDesc',
        },
    ]

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>系</Text>
                        </View>
                        <View>
                            <Text style={styles.adminName}>{t('account.adminName')}</Text>
                            <Text style={styles.adminRole}>{t('account.adminRole')}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <View style={styles.infoLeft}>
                            <Ionicons name='at-outline' size={16} color='#9CA3AF' />
                            <Text style={styles.infoLabel}>{t('account.username')}</Text>
                        </View>
                        <Text style={styles.infoValue}>admin</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoLeft}>
                            <Ionicons name='business-outline' size={16} color='#9CA3AF' />
                            <Text style={styles.infoLabel}>{t('account.factory')}</Text>
                        </View>
                        <Text style={styles.infoValue}>示範工廠</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoLeft}>
                            <Ionicons name='pricetag-outline' size={16} color='#9CA3AF' />
                            <Text style={styles.infoLabel}>{t('account.factoryCode')}</Text>
                        </View>
                        <Text style={styles.infoValue}>XHX-JAD</Text>
                    </View>
                </View>

                {menuItems.map((item) => (
                    <TouchableOpacity key={item.titleKey} style={styles.menuCard} onPress={item.onPress}>
                        <View style={[styles.menuIconBox, { backgroundColor: item.iconBg }]}>
                            <Ionicons name={item.icon} size={20} color={item.iconColor} />
                        </View>
                        <View style={styles.menuTextBox}>
                            <Text style={styles.menuTitle}>{t(item.titleKey)}</Text>
                            <Text style={styles.menuDesc}>
                                {item.titleKey === 'account.language' ? currentLanguageLabel : t(item.descKey)}
                            </Text>
                        </View>
                        <Ionicons name='chevron-forward' size={18} color='#D1D5DB' />
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.logoutCard} onPress={handleLogout}>
                    <Ionicons name='log-out-outline' size={20} color='#DC2626' />
                    <Text style={styles.logoutText}>{t('account.logout')}</Text>
                    <Ionicons name='chevron-forward' size={18} color='#FCA5A5' style={styles.logoutChevron} />
                </TouchableOpacity>

                <Text style={styles.versionText}>{t('account.appVersion')}</Text>
            </ScrollView>

            <Modal
                visible={languageModalVisible}
                transparent
                animationType='slide'
                onRequestClose={() => setLanguageModalVisible(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setLanguageModalVisible(false)}>
                    <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.sheetHandle} />
                        <Text style={styles.sheetTitle}>{t('account.selectLanguage')}</Text>

                        {LANGUAGE_OPTIONS.map((option) => {
                            const isSelected = i18n.language === option.code
                            return (
                                <TouchableOpacity
                                    key={option.code}
                                    style={styles.languageRow}
                                    onPress={() => handleSelectLanguage(option.code)}>
                                    <View>
                                        <Text style={styles.languageNative}>{option.nativeLabel}</Text>
                                        <Text style={styles.languageSub}>{option.label}</Text>
                                    </View>
                                    {isSelected && <Ionicons name='checkmark-circle' size={22} color='#1F4D3A' />}
                                </TouchableOpacity>
                            )
                        })}
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#EAF7EF' },
    scrollContent: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 30, gap: 12 },
    pageTitle: { fontSize: 18, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 8 },
    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
        marginBottom: 4,
    },
    profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1F4D3A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
    adminName: { fontSize: 16, fontWeight: '700', color: '#111827' },
    adminRole: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 12 },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    infoLabel: { fontSize: 13, color: '#6B7280' },
    infoValue: { fontSize: 13, fontWeight: '700', color: '#111827' },
    menuCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
    },
    menuIconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuTextBox: { flex: 1 },
    menuTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
    menuDesc: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
    logoutCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        marginTop: 8,
    },
    logoutText: { flex: 1, fontSize: 14, fontWeight: '700', color: '#DC2626' },
    logoutChevron: { marginLeft: -8 },
    versionText: { textAlign: 'center', fontSize: 11, color: '#9CA3AF', marginTop: 8 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 30,
    },
    sheetHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E5E7EB',
        alignSelf: 'center',
        marginBottom: 14,
    },
    sheetTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
    },
    languageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    languageNative: { fontSize: 15, fontWeight: '600', color: '#111827' },
    languageSub: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
})
