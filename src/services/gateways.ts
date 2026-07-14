import { IGateway } from '../type'
import { apiFetch } from './api'

function mapGateway(raw: any): IGateway {
    return {
        id: raw.id,
        name: raw.name,
        maxDevices: raw.max_devices,
        active: raw.is_active,
        lastOnline: raw.last_seen_at,
        deviceCount: raw.device_count,
        organizationId: raw.organization_id,
        createdAt: raw.created_at,
    }
}

export async function getGateWays(organizationId: string): Promise<IGateway[]> {
    const data = await apiFetch(`/organizations/${organizationId}/gateways`, { method: 'GET' })

    const list = Array.isArray(data) ? data : (data?.gateways ?? data?.items ?? [])

    return list.map(mapGateway)
}
