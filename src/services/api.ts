import { getTokens, setTokens } from './tokenStore'

const API_BASE_URL = 'https://api.mmold.com/api/v1'

export class ApiError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
    const tokens = getTokens()
    if (!tokens?.refreshToken) return null

    if (!refreshPromise) {
        refreshPromise = (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh_token: tokens.refreshToken }),
                })
                const data = await res.json().catch(() => null)

                if (!res.ok) {
                    await setTokens(null)
                    return null
                }

                const newTokens = {
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token ?? tokens.refreshToken,
                }
                await setTokens(newTokens)
                return newTokens.accessToken
            } catch {
                await setTokens(null)
                return null
            } finally {
                refreshPromise = null
            }
        })()
    }

    return refreshPromise
}

async function request(path: string, options: RequestInit, token?: string) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            credentials: 'include',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    })
    const data = await res.json().catch(() => null)
    return { res, data }
}

export async function apiFetch(path: string, options: RequestInit = {}, accessTokenOverride?: string) {
    const tokens = getTokens()
    const accessToken = accessTokenOverride ?? tokens?.accessToken

    let { res, data } = await request(path, options, accessToken)

    if (res.status === 401 && tokens?.refreshToken) {
        const newAccessToken = await refreshAccessToken()
        if (newAccessToken) {
            ;({ res, data } = await request(path, options, newAccessToken))
        }
    }

    if (!res.ok) {
        const message = data?.message || data?.detail || 'Error'
        throw new ApiError(message, res.status)
    }

    return data
}
