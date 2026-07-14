import { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react'
import { getDevices } from '../services/devices'
import { IDevice } from '../type'
import { useAuth } from './AuthContext'

type DevicesContextType = {
    devices: IDevice[]
    loading: boolean
    refreshing: boolean
    error: string | null
    hasLoadedOnce: boolean
    fetchDevices: (opts?: { silent?: boolean }) => Promise<void>
    getDeviceById: (id: string) => IDevice | undefined
}

const DevicesContext = createContext<DevicesContextType | undefined>(undefined)

export function DevicesProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const [devices, setDevices] = useState<IDevice[]>([])
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const hasLoadedOnce = useRef(false)
    const fetchingRef = useRef(false)

    const fetchDevices = useCallback(
        async (opts?: { silent?: boolean }) => {
            if (!user?.organizationId) return
            if (fetchingRef.current) return
            fetchingRef.current = true

            const silent = opts?.silent ?? false
            if (!silent || !hasLoadedOnce.current) {
                setLoading(true)
            } else {
                setRefreshing(true)
            }
            setError(null)

            try {
                const data = await getDevices(user.organizationId)
                setDevices(data)
                hasLoadedOnce.current = true
            } catch (err) {
                if (!hasLoadedOnce.current) {
                    setError('load_failed')
                }
            } finally {
                setLoading(false)
                setRefreshing(false)
                fetchingRef.current = false
            }
        },
        [user?.organizationId],
    )

    const getDeviceById = useCallback((id: string) => devices.find((d) => d.id === id), [devices])

    return (
        <DevicesContext.Provider
            value={{
                devices,
                loading,
                refreshing,
                error,
                hasLoadedOnce: hasLoadedOnce.current,
                fetchDevices,
                getDeviceById,
            }}>
            {children}
        </DevicesContext.Provider>
    )
}

export function useDevices() {
    const ctx = useContext(DevicesContext)
    if (!ctx) throw new Error('useDevices must be used within DevicesProvider')
    return ctx
}
