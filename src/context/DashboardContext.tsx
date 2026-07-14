import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { getDashboard, getLiveStatus } from '../services/dashboard'
import { IDashboardSummary, ILiveStatus } from '../type'
import { useAuth } from './AuthContext'

const POLL_INTERVAL_MS = 30_000

type DashboardContextType = {
    stats: IDashboardSummary | null
    liveStatus: ILiveStatus[]
    loading: boolean
    refreshing: boolean
    error: string | null
    updatedAt: Date | null
    refresh: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const [stats, setStats] = useState<IDashboardSummary | null>(null)
    const [liveStatus, setLiveStatus] = useState<ILiveStatus[]>([])
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null)

    const hasLoadedOnce = useRef(false)
    const fetchingRef = useRef(false)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const appStateRef = useRef(AppState.currentState)

    const fetchData = useCallback(
        async (opts?: { silent?: boolean }) => {
            if (!user?.organizationId) return
            if (fetchingRef.current) return
            fetchingRef.current = true

            const silent = opts?.silent ?? false
            if (!silent || !hasLoadedOnce.current) setLoading(true)
            else setRefreshing(true)
            setError(null)

            try {
                const [dashboardData, liveStatusData] = await Promise.all([
                    getDashboard(user.organizationId),
                    getLiveStatus(user.organizationId),
                ])
                setStats(dashboardData)
                setLiveStatus(liveStatusData)
                setUpdatedAt(new Date())
                hasLoadedOnce.current = true
            } catch {
                if (!hasLoadedOnce.current) setError('load_failed')
            } finally {
                setLoading(false)
                setRefreshing(false)
                fetchingRef.current = false
            }
        },
        [user?.organizationId],
    )

    const startPolling = useCallback(() => {
        if (intervalRef.current) return
        intervalRef.current = setInterval(() => fetchData({ silent: true }), POLL_INTERVAL_MS)
    }, [fetchData])

    const stopPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }, [])

    useEffect(() => {
        if (!user?.organizationId) {
            stopPolling()
            return
        }
        hasLoadedOnce.current = false
        fetchData()
        startPolling()
        return () => stopPolling()
    }, [user?.organizationId, fetchData, startPolling, stopPolling])

    useEffect(() => {
        const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
            const wasBackground = appStateRef.current.match(/inactive|background/)
            if (wasBackground && next === 'active') {
                fetchData({ silent: true })
                startPolling()
            } else if (next.match(/inactive|background/)) {
                stopPolling()
            }
            appStateRef.current = next
        })
        return () => sub.remove()
    }, [fetchData, startPolling, stopPolling])

    const refresh = useCallback(() => fetchData({ silent: true }), [fetchData])

    return (
        <DashboardContext.Provider value={{ stats, liveStatus, loading, refreshing, error, updatedAt, refresh }}>
            {children}
        </DashboardContext.Provider>
    )
}

export function useDashboard() {
    const ctx = useContext(DashboardContext)
    if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
    return ctx
}
