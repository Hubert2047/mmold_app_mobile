import {
    DeviceStatus,
    IDashboardSummary,
    IDeviceRealtime,
    IDeviceStatusRatio,
    IHistoryStacked,
    IHistorySummary,
    ILiveStatus,
} from '../type'
import { apiFetch } from './api'

function normalizeStatus(raw: string): DeviceStatus {
    const map: Record<string, DeviceStatus> = {
        offline: 'offline',
        stopped: 'stopped',
        standby: 'standby',
        producing: 'producing',
        high_load: 'highLoad',
        highload: 'highLoad',
        highLoad: 'highLoad',
        overload: 'overload',
    }
    return map[raw] ?? 'offline'
}

function mapDashboard(raw: any): IDashboardSummary {
    return {
        totalEnergyKwh: raw.total_energy_kwh ?? 0,
        carbonEmissionKg: raw.carbon_emission_kg ?? 0,
        estimatedCostNtd: raw.estimated_cost_ntd ?? 0,
        deviceStatus: {
            total: raw.device_status?.total ?? 0,
            running: raw.device_status?.running ?? 0,
            standby: raw.device_status?.standby ?? 0,
            anomaly: raw.device_status?.anomaly ?? 0,
        },
        vsYesterdayPercent: raw.vs_yesterday_percent ?? null,
        todayAlertCount: raw.today_alert_count ?? 0,
        monthlyEnergyKwh: raw.monthly_energy_kwh ?? 0,
        peakTodayKw: raw.peak_today_kw ?? 0,
        peakMonthKw: raw.peak_month_kw ?? 0,
        currentDemandKw: raw.current_demand_kw ?? 0,
        predictedDemandKw: raw.predicted_demand_kw ?? 0,
        demandRemainingSec: raw.demand_remaining_sec ?? 0,
        contractCapacityKw: raw.contract_capacity_kw ?? 0,
        demandState: raw.demand_state ?? 'low',
    }
}

function mapLiveStatus(raw: any): ILiveStatus {
    return {
        deviceId: raw.device_id,
        status: normalizeStatus(raw.status),
        statusSince: raw.status_since,
        currentPower: raw.current_power ?? 0,
    }
}

function mapHistorySummary(raw: any): IHistorySummary {
    return {
        totalKwh: raw.total_kwh ?? 0,
        dailyAvgKwh: raw.daily_avg_kwh ?? 0,
        peakDate: raw.peak_date ?? null,
        peakKwh: raw.peak_kwh ?? 0,
    }
}

function mapHistoryStacked(raw: any): IHistoryStacked {
    return {
        period: raw.period,
        devices: (raw.devices ?? []).map((d: any) => ({ deviceId: d.device_id ?? d.id, name: d.name })),
        buckets: (raw.buckets ?? []).map((b: any) => ({ label: b.label, values: b.values ?? {} })),
    }
}

export async function getDashboard(organizationId: string): Promise<IDashboardSummary> {
    const data = await apiFetch(`/organizations/${organizationId}/dashboard`, { method: 'GET' })
    return mapDashboard(data)
}

export async function getLiveStatus(organizationId: string): Promise<ILiveStatus[]> {
    const data = await apiFetch(`/organizations/${organizationId}/live-status`, { method: 'GET' })
    const list = Array.isArray(data) ? data : (data?.items ?? [])
    return list.map(mapLiveStatus)
}

export async function getHistorySummary(organizationId: string, from: string, to: string): Promise<IHistorySummary> {
    const params = new URLSearchParams({ from, to })
    const data = await apiFetch(`/organizations/${organizationId}/history/summary?${params}`, { method: 'GET' })
    return mapHistorySummary(data)
}

export async function getHistoryStacked(
    organizationId: string,
    range: 'past24h' | 'past7d' | 'past30d' | string,
    top: number = 5,
): Promise<IHistoryStacked> {
    const params = new URLSearchParams({ range, top: String(top) })
    const data = await apiFetch(`/organizations/${organizationId}/history/stacked?${params}`, { method: 'GET' })
    return mapHistoryStacked(data)
}
function mapDeviceRealtime(raw: any): IDeviceRealtime {
    return {
        deviceId: raw.device_id,
        deviceName: raw.device_name,
        date: raw.date,
        windowStart: raw.window_start,
        points: (raw.points ?? []).map((p: any) => ({ time: p.time ?? p.label, kw: p.value ?? p.kw ?? 0 })),
        stats: {
            currentPower: raw.stats?.current_power ?? null,
            avgPower: raw.stats?.avg_power ?? 0,
            maxPower: raw.stats?.max_power ?? 0,
            minPower: raw.stats?.min_power ?? 0,
        },
    }
}

function mapDeviceStatusRatio(raw: any): IDeviceStatusRatio {
    return {
        deviceId: raw.device_id,
        deviceName: raw.device_name,
        period: raw.period,
        windowStart: raw.window_start,
        buckets: (raw.buckets ?? []).map((b: any) => ({
            label: b.label,
            normalPct: b.normal_pct ?? 0,
            standbyPct: b.standby_pct ?? 0,
            shutdownPct: b.shutdown_pct ?? 0,
            highloadPct: b.highload_pct ?? 0,
            overloadPct: b.overload_pct ?? 0,
        })),
    }
}

export async function getDeviceRealtime(organizationId: string, deviceId: string): Promise<IDeviceRealtime> {
    const data = await apiFetch(`/organizations/${organizationId}/devices/${deviceId}/realtime`, { method: 'GET' })
    return mapDeviceRealtime(data)
}

export async function getDeviceStatusRatio(organizationId: string, deviceId: string): Promise<IDeviceStatusRatio> {
    const data = await apiFetch(`/organizations/${organizationId}/devices/${deviceId}/status-ratio`, { method: 'GET' })
    return mapDeviceStatusRatio(data)
}
