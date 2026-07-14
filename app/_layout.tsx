import { useColorScheme } from '@/components/useColorScheme'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack, useRouter, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { AuthProvider, useAuth } from '../src/context/AuthContext'
import i18n, { initI18n } from '../src/i18n'
export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
    initialRouteName: 'login',
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    })
    const [i18nReady, setI18nReady] = useState(false)

    useEffect(() => {
        if (error) throw error
    }, [error])

    useEffect(() => {
        initI18n().then(() => setI18nReady(true))
    }, [])

    useEffect(() => {
        if (loaded && i18nReady) {
            SplashScreen.hideAsync()
        }
    }, [loaded, i18nReady])

    if (!loaded || !i18nReady) {
        return null
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <I18nextProvider i18n={i18n}>
                <AuthProvider>
                    <RootLayoutNav />
                </AuthProvider>
            </I18nextProvider>
        </GestureHandlerRootView>
    )
}

function RootLayoutNav() {
    const colorScheme = useColorScheme()
    const { tokens, isLoading } = useAuth()
    const segments = useSegments()
    const router = useRouter()

    useEffect(() => {
        if (isLoading) return

        const inAuthGroup = segments[0] === 'login' || segments[0] === 'register'

        if (!tokens && !inAuthGroup) {
            router.replace('/login')
        } else if (tokens && inAuthGroup) {
            router.replace('/(tabs)')
        }
    }, [tokens, isLoading, segments])

    if (isLoading) {
        return null
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name='login' options={{ headerShown: false }} />
                <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                <Stack.Screen name='register' options={{ headerShown: false }} />
                <Stack.Screen name='equipment' options={{ headerShown: false }} />
                <Stack.Screen name='system-settings' options={{ headerShown: false }} />
                <Stack.Screen name='notification-setup' options={{ headerShown: false }} />
            </Stack>
        </ThemeProvider>
    )
}
