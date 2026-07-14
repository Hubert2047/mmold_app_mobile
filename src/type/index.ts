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
