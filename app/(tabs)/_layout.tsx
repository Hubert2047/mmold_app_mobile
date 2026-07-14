import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

import { useClientOnlyValue } from '@/components/useClientOnlyValue'
import { useColorScheme } from '@/components/useColorScheme'
import Colors from '@/constants/Colors'
import { useTranslation } from 'react-i18next'

export default function TabLayout() {
    const colorScheme = useColorScheme() ?? 'light'
    const { t } = useTranslation()

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme].tint,
                headerShown: useClientOnlyValue(false, true),
            }}>
            <Tabs.Screen
                name='index'
                options={{
                    title: t('tabs.dashboard'),
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons name='stats-chart' size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name='history'
                options={{
                    title: t('tabs.history'),
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons name='time-outline' size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name='alerts'
                options={{
                    title: t('tabs.alerts'),
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons name='shield-outline' size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name='account'
                options={{
                    title: t('tabs.account'),
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons name='person-outline' size={24} color={color} />,
                }}
            />
        </Tabs>
    )
}
