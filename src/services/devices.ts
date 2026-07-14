import { IDevice } from '../type'
import { apiFetch } from './api'

function mapDevice(raw: any): IDevice {
    return {
        id: raw.id,
        organizationId: raw.organization_id,
        gatewayId: raw.gateway_id,
        externalId: raw.device_id_external,
        name: raw.name,
        type: raw.device_type,
        phase: raw.phase === 1 ? '單相' : '三相',
        mac: raw.mac_addresses,
        ratedVoltage: raw.rated_voltage,
        ratedCurrent: raw.rated_current,
        ratedPowerKw: raw.rated_power_kw,
        powerFactorRated: raw.power_factor_rated,
        ctRatio: raw.ct_ratio,
        loadType: raw.load_type,
        shutdownRangeMin: raw.shutdown_range_min,
        shutdownRangeMax: raw.shutdown_range_max,
        standbyRangeMin: raw.standby_range_min,
        standbyRangeMax: raw.standby_range_max,
        normalRangeMin: raw.normal_range_min,
        normalRangeMax: raw.normal_range_max,
        overloadAbove: raw.overload_above,
        statusShutdownPct: raw.status_shutdown_pct,
        statusStandbyPct: raw.status_standby_pct,
        statusHighloadPct: raw.status_highload_pct,
        statusOverloadPct: raw.status_overload_pct,
        phaseImbalanceThresholdPct: raw.phase_imbalance_threshold_pct,
        phaseImbalanceDurationMin: raw.phase_imbalance_duration_min,
        workDays: raw.work_days,
        workHoursStart: raw.work_hours_start,
        workHoursEnd: raw.work_hours_end,
        breakHoursStart: raw.break_hours_start,
        breakHoursEnd: raw.break_hours_end,
        alertPowerSpikeThreshold: raw.alert_power_spike_threshold,
        alertOvercurrentThreshold: raw.alert_overcurrent_threshold,
        alertNoDataTimeout: raw.alert_no_data_timeout,
        alertImbalanceThreshold: raw.alert_imbalance_threshold,
        alertsEnabled: raw.alerts_enabled,
        createdAt: raw.created_at,
    }
}

export async function getDevices(organizationId: string): Promise<IDevice[]> {
    const data = await apiFetch(`/organizations/${organizationId}/devices`, { method: 'GET' })

    const list = Array.isArray(data) ? data : (data?.devices ?? data?.items ?? [])
    return list.map(mapDevice)
}
export async function deleteDevice(organizationId: string, deviceId: string): Promise<void> {
    await apiFetch(`/organizations/${organizationId}/devices/${deviceId}`, { method: 'DELETE' })
}
export async function updateDevice(
    organizationId: string,
    deviceId: string,
    payload: Record<string, any>,
): Promise<IDevice> {
    const data = await apiFetch(`/organizations/${organizationId}/devices/${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
    })
    return mapDevice(data)
}
export async function createDevice(organizationId: string, payload: Record<string, any>): Promise<IDevice> {
    const data = await apiFetch(`/organizations/${organizationId}/devices`, {
        method: 'POST',
        body: JSON.stringify(payload),
    })
    return mapDevice(data)
}
