export interface Equipment {
    id: string
    name: string
    category: string
    meterId: string
    phase: string
    kw: number
    a: number
    v: number
}

export const CATEGORY_OPTIONS: { value: string; label: string }[] = [
    { value: 'cnc', label: 'CNC成型機' },
    { value: 'compressor', label: '空壓機' },
    { value: 'other', label: '其他' },
]

export const PHASE_OPTIONS = ['單相', '3相']

let equipmentList: Equipment[] = [
    { id: '1', name: '2號CNC成型機', category: 'cnc', meterId: 'meter_05', phase: '單相', kw: 20, a: 40, v: 220 },
    { id: '2', name: '冷卻水塔', category: 'other', meterId: 'meter_20', phase: '單相', kw: 40, a: 70, v: 220 },
    { id: '3', name: '2號空壓機', category: 'compressor', meterId: 'meter_02', phase: '單相', kw: 45, a: 80, v: 220 },
    { id: '4', name: 'UPS不斷電', category: 'other', meterId: 'meter_19', phase: '3相', kw: 2, a: 18, v: 110 },
    { id: '5', name: '3號CNC成型機', category: 'cnc', meterId: 'meter_06', phase: '3相', kw: 13, a: 28, v: 220 },
    { id: '6', name: '4號CNC成型機', category: 'cnc', meterId: 'meter_07', phase: '3相', kw: 18, a: 35, v: 220 },
    { id: '7', name: '飲水機/咖啡機', category: 'other', meterId: 'meter_16', phase: '單相', kw: 2.2, a: 20, v: 110 },
]

let nextId = 8

export function getEquipmentList(): Equipment[] {
    return equipmentList
}

export function getEquipmentById(id: string): Equipment | undefined {
    return equipmentList.find((e) => e.id === id)
}

export function addEquipment(data: Omit<Equipment, 'id'>): Equipment {
    const newItem: Equipment = { id: String(nextId++), ...data }
    equipmentList = [...equipmentList, newItem]
    return newItem
}

export function updateEquipment(id: string, data: Omit<Equipment, 'id'>): void {
    equipmentList = equipmentList.map((e) => (e.id === id ? { id, ...data } : e))
}

export function deleteEquipment(id: string): void {
    equipmentList = equipmentList.filter((e) => e.id !== id)
}
