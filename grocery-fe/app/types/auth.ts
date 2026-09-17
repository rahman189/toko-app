export type UserRole = 'ADMIN' | 'STAFF'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  name: string
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: AuthUser
}

export interface RegisterResponse {
  accessToken: string
  user: AuthUser
}