import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { apiFetch } from '../services/api'
import { getMe, UserProfile } from '../services/auth'
import { AuthTokens, getTokens, loadTokens, setTokens, subscribeTokens } from '../services/tokenStore'

type AuthContextType = {
    tokens: AuthTokens | null
    user: UserProfile | null
    isLoading: boolean
    login: (inviteCode: string, username: string, password: string) => Promise<void>
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [tokens, setTokensState] = useState<AuthTokens | null>(getTokens())
    const [user, setUser] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    async function refreshUser() {
        try {
            const profile = await getMe()
            setUser(profile)
        } catch {
            setUser(null)
        }
    }

    useEffect(() => {
        loadTokens().then(async (loaded) => {
            setTokensState(loaded)
            if (loaded?.accessToken) {
                await refreshUser()
            }
            setIsLoading(false)
        })
        return subscribeTokens((next) => {
            setTokensState(next)
            if (!next) setUser(null)
        })
    }, [])

    async function login(inviteCode: string, username: string, password: string) {
        if (!inviteCode || !username || !password) {
            throw new Error('Vui lòng nhập đầy đủ thông tin')
        }

        const data = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                invite_code: inviteCode,
                username,
                password,
            }),
        })

        await setTokens({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
        })

        await refreshUser()
    }

    async function logout() {
        await setTokens(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ tokens, user, isLoading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
