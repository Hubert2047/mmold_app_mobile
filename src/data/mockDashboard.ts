export type DeviceStatus = 'offline' | 'stopped' | 'standby' | 'producing' | 'highLoad' | 'overload'

export type Device = {
    id: string
    name: string
    category: string
    meterCode: string
    phase: string
    status: DeviceStatus
    powerKw: number
    ratedKw: number
    ratedA: number
    ratedV: number
}

export const mockStats = {
    updatedAt: '上午10:23:46',
    todayAlerts: 0,
    realtimePower: 0.0,
    monthlyEnergy: 0,
    monthlyCarbon: 0,
    currentDemand: 0.0,
    predictedDemand: 0.0,
    remainingTime: '6:13',
    todayPeak: 0.0,
    monthlyPeak: 0.0,
    contractCapacity: 200,
}

export const mockChartData = {
    labels: ['11:00', '17:00', '23:00', '05:00'],
    values: [180, 175, 178, 172, 176, 174],
}

export const mockDevices: Device[] = [
    {
        id: '1',
        name: '2號CNC成型機',
        category: 'cnc',
        meterCode: 'meter_05',
        phase: '單相',
        status: 'offline',
        powerKw: 0,
        ratedKw: 20,
        ratedA: 40,
        ratedV: 220,
    },
    {
        id: '2',
        name: '冷卻水塔',
        category: 'other',
        meterCode: 'meter_20',
        phase: '單相',
        status: 'offline',
        powerKw: 0,
        ratedKw: 40,
        ratedA: 70,
        ratedV: 220,
    },
    {
        id: '3',
        name: '1號射出成型機',
        category: 'injection',
        meterCode: 'meter_01',
        phase: '三相',
        status: 'producing',
        powerKw: 15.2,
        ratedKw: 25,
        ratedA: 50,
        ratedV: 380,
    },
    {
        id: '4',
        name: '空壓機',
        category: 'compressor',
        meterCode: 'meter_12',
        phase: '三相',
        status: 'standby',
        powerKw: 2.1,
        ratedKw: 15,
        ratedA: 30,
        ratedV: 380,
    },
]
