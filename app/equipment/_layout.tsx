import { Stack } from 'expo-router'

export default function EquipmentLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />
            <Stack.Screen name='new' />
            <Stack.Screen name='[id]/index' />
            <Stack.Screen name='[id]/edit' />
        </Stack>
    )
}
