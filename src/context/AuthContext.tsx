import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { apiFetch } from '../services/api'
import { AuthTokens, getTokens, loadTokens, setTokens, subscribeTokens } from '../services/tokenStore'

type AuthContextType = {
    tokens: AuthTokens | null
    isLoading: boolean
    login: (inviteCode: string, username: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [tokens, setTokensState] = useState<AuthTokens | null>(getTokens())
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadTokens().then((loaded) => {
            setTokensState(loaded)
            setIsLoading(false)
        })
        return subscribeTokens(setTokensState)
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
    }

    async function logout() {
        await setTokens(null)
    }

    return <AuthContext.Provider value={{ tokens, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
