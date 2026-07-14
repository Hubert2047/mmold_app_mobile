export type UserRole = 'admin' | 'customer'

// TODO: API hiện chưa trả role. Khi backend hỗ trợ, đọc role thật
// từ AuthContext (token payload hoặc response /me) thay vì hard-code.
export function useUserRole(): UserRole {
    return 'admin'
}
