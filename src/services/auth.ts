import { apiFetch } from './api'

export type UserProfile = {
    id: string
    username: string
    name: string
    organizationId: string
    organizationName: string
    organizationInviteCode: string
    isPlatformAdmin: boolean
    canManageUsers: boolean
    canManageDevices: boolean
    isApproved: boolean
    isActive: boolean
    createdAt: string
}

function mapUserProfile(raw: any): UserProfile {
    return {
        id: raw.id,
        username: raw.username,
        name: raw.name,
        organizationId: raw.organization_id,
        organizationName: raw.organization_name,
        organizationInviteCode: raw.organization_invite_code,
        isPlatformAdmin: raw.is_platform_admin,
        canManageUsers: raw.can_manage_users,
        canManageDevices: raw.can_manage_devices,
        isApproved: raw.is_approved,
        isActive: raw.is_active,
        createdAt: raw.created_at,
    }
}

export async function getMe(): Promise<UserProfile> {
    const data = await apiFetch('/auth/me', { method: 'GET' })
    return mapUserProfile(data)
}
