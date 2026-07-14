import AsyncStorage from '@react-native-async-storage/async-storage'

export type AuthTokens = {
    accessToken: string
    refreshToken: string
}

let currentTokens: AuthTokens | null = null
let listeners: Array<(tokens: AuthTokens | null) => void> = []

export function getTokens() {
    return currentTokens
}

export async function setTokens(tokens: AuthTokens | null) {
    currentTokens = tokens
    if (tokens) {
        await AsyncStorage.setItem('auth_tokens', JSON.stringify(tokens))
    } else {
        await AsyncStorage.removeItem('auth_tokens')
    }
    listeners.forEach((listener) => listener(currentTokens))
}

export async function loadTokens() {
    const raw = await AsyncStorage.getItem('auth_tokens')
    currentTokens = raw ? JSON.parse(raw) : null
    return currentTokens
}

export function subscribeTokens(listener: (tokens: AuthTokens | null) => void) {
    listeners.push(listener)
    return () => {
        listeners = listeners.filter((l) => l !== listener)
    }
}