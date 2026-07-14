import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Localization from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import zhHant from './locales/zh-Hant.json'

export const LANGUAGE_STORAGE_KEY = 'app_language'

const resources = {
    en: { translation: en },
    'zh-Hant': { translation: zhHant },
}

function getDeviceLanguage(): string {
    const deviceLocale = Localization.getLocales()[0]?.languageTag ?? 'en'
    if (deviceLocale.startsWith('zh')) return 'zh-Hant'
    return 'en'
}

export async function initI18n() {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
    const initialLanguage = savedLanguage ?? getDeviceLanguage()

    await i18n.use(initReactI18next).init({
        resources,
        lng: initialLanguage,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    })

    return i18n
}

export async function changeLanguage(language: 'en' | 'zh-Hant') {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    await i18n.changeLanguage(language)
}

export default i18n
