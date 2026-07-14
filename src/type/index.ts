export type IGateway = {
    id: string
    name: string
    maxDevices: number
    active: boolean
    lastOnline: string
    deviceCount: number
    organizationId: string
    createdAt: string
}

export type IDevice = {
    id: string
    organizationId: string
    gatewayId: string
    externalId: string | null

    name: string
    type: string
    phase: '單相' | '三相'
    mac: string[]

    ratedVoltage: number
    ratedCurrent: number
    ratedPowerKw: number
    powerFactorRated: number
    ctRatio: number

    loadType: string | null

    shutdownRangeMin: number
    shutdownRangeMax: number
    standbyRangeMin: number
    standbyRangeMax: number
    normalRangeMin: number
    normalRangeMax: number
    overloadAbove: number

    statusShutdownPct: number
    statusStandbyPct: number
    statusHighloadPct: number
    statusOverloadPct: number

    phaseImbalanceThresholdPct: number
    phaseImbalanceDurationMin: number

    workDays: string[]
    workHoursStart: string
    workHoursEnd: string
    breakHoursStart: string | null
    breakHoursEnd: string | null

    alertPowerSpikeThreshold: number | null
    alertOvercurrentThreshold: number | null
    alertNoDataTimeout: number | null
    alertImbalanceThreshold: number | null
    alertsEnabled: boolean

    createdAt: string
}
export type DeviceStatus = 'offline' | 'stopped' | 'standby' | 'producing' | 'highLoad' | 'overload'

export interface ILiveStatus {
    deviceId: string
    status: DeviceStatus
    statusSince: string | null
    currentPower: number
}

export interface IDeviceWithStatus extends IDevice {
    status: DeviceStatus
    statusSince: string | null
    currentPower: number
}

export interface IDashboardSummary {
    totalEnergyKwh: number
    carbonEmissionKg: number
    estimatedCostNtd: number
    deviceStatus: { total: number; running: number; standby: number; anomaly: number }
    vsYesterdayPercent: number | null
    todayAlertCount: number
    monthlyEnergyKwh: number
    peakTodayKw: number
    peakMonthKw: number
    currentDemandKw: number
    predictedDemandKw: number
    demandRemainingSec: number
    contractCapacityKw: number
    demandState: string
}

export interface IHistorySummary {
    totalKwh: number
    dailyAvgKwh: number
    peakDate: string | null
    peakKwh: number
}

export interface IStackedBucket {
    label: string
    values: Record<string, number>
}

export interface IHistoryStacked {
    period: string
    devices: { deviceId: string; name: string }[]
    buckets: IStackedBucket[]
}
export interface IDeviceRealtimePoint {
    time: string
    kw: number
}

export interface IDeviceRealtime {
    deviceId: string
    deviceName: string
    date: string
    windowStart: string
    points: IDeviceRealtimePoint[]
    stats: {
        currentPower: number | null
        avgPower: number
        maxPower: number
        minPower: number
    }
}

export interface IDeviceStatusRatioBucket {
    label: string
    normalPct: number
    standbyPct: number
    shutdownPct: number
    highloadPct: number
    overloadPct: number
}

export interface IDeviceStatusRatio {
    deviceId: string
    deviceName: string
    period: string
    windowStart: string
    buckets: IDeviceStatusRatioBucket[]
}
