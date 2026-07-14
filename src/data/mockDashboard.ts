export type DeviceStatus = 'offline' | 'stopped' | 'standby' | 'producing' | 'highLoad' | 'overload'

export interface MinutePowerPoint {
    time: string // 'HH:mm'
    kw: number
}

export interface HourlyStatusPoint {
    hour: string // 'HH:mm'
    stopped: number // 0-100
    standby: number
    producing: number
    highLoad: number
    overload: number
}

export interface Device {
    id: string
    name: string
    category: string
    meterCode: string
    phase: string
    ratedKw: number
    ratedA: number
    ratedV: number
    powerKw: number
    status: DeviceStatus
    lastUpdated: string
    // --- dùng cho màn chi tiết thiết bị ---
    energyKwh?: number
    carbonKg?: number
    maxKw?: number
    minKw?: number
    agingKwh?: number
    minutePower?: MinutePowerPoint[] // rỗng/undefined => hiển thị "尚無資料"
    hourlyStatus?: HourlyStatusPoint[] // 24 điểm theo giờ
}

export interface DashboardStats {
    updatedAt: string
    todayAlerts: number
    realtimePowerKw: number
    monthlyEnergyKwh: number
    monthlyCarbonKg: number
    currentDemandKw: number
    todayPeakKw: number
    monthlyPeakKw: number
    contractCapacityKw: number
}

function buildEmptyHourlyStatus(): HourlyStatusPoint[] {
    return Array.from({ length: 24 }, (_, i) => ({
        hour: `${String(i).padStart(2, '0')}:00`,
        stopped: 0,
        standby: 0,
        producing: 0,
        highLoad: 0,
        overload: 0,
    }))
}

export const mockDevices: Device[] = [
    {
        id: '1',
        name: '2號CNC成型機',
        category: 'cnc',
        meterCode: 'meter_05',
        phase: '單相',
        ratedKw: 20,
        ratedA: 40,
        ratedV: 220,
        powerKw: 0,
        status: 'offline',
        lastUpdated: '2026/7/14 下午2:42:10',
        energyKwh: 0,
        carbonKg: 0,
        maxKw: 0,
        minKw: 0,
        agingKwh: 0,
        minutePower: [],
        hourlyStatus: buildEmptyHourlyStatus(),
    },
    {
        id: '2',
        name: '冷卻水塔',
        category: 'other',
        meterCode: 'meter_20',
        phase: '單相',
        ratedKw: 40,
        ratedA: 70,
        ratedV: 220,
        powerKw: 0,
        status: 'offline',
        lastUpdated: '2026/7/14 下午2:42:10',
        energyKwh: 0,
        carbonKg: 0,
        maxKw: 0,
        minKw: 0,
        agingKwh: 0,
        minutePower: [],
        hourlyStatus: buildEmptyHourlyStatus(),
    },
    {
        id: '3',
        name: '2號空壓機',
        category: 'compressor',
        meterCode: 'meter_02',
        phase: '單相',
        ratedKw: 45,
        ratedA: 80,
        ratedV: 220,
        powerKw: 0,
        status: 'offline',
        lastUpdated: '2026/7/14 下午2:42:10',
        energyKwh: 0,
        carbonKg: 0,
        maxKw: 0,
        minKw: 0,
        agingKwh: 0,
        minutePower: [],
        hourlyStatus: buildEmptyHourlyStatus(),
    },
    {
        id: '4',
        name: 'UPS不斷電',
        category: 'other',
        meterCode: 'meter_19',
        phase: '3相',
        ratedKw: 2,
        ratedA: 18,
        ratedV: 110,
        powerKw: 0,
        status: 'offline',
        lastUpdated: '2026/7/14 下午2:42:10',
        energyKwh: 0,
        carbonKg: 0,
        maxKw: 0,
        minKw: 0,
        agingKwh: 0,
        minutePower: [],
        hourlyStatus: buildEmptyHourlyStatus(),
    },
]

export const mockStats: DashboardStats = {
    updatedAt: '2026/7/14 下午2:42:01',
    todayAlerts: 0,
    realtimePowerKw: 0,
    monthlyEnergyKwh: 0,
    monthlyCarbonKg: 0,
    currentDemandKw: 0,
    todayPeakKw: 0,
    monthlyPeakKw: 0,
    contractCapacityKw: 0,
}
export interface ChartData {
    labels: string[]
    values: number[]
}

export const mockChartData: ChartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    values: [0, 0, 0, 0, 0, 0],
}
