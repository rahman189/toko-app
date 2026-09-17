import type {
  LoginDto,
  LoginResponse,
  RegisterDto,
  RegisterResponse,
} from '~/types/auth'

export function useAuth() {
  const api = useApi()

  async function login(payload: LoginDto) {
    return await api<LoginResponse>(
      '/auth/login',
      {
        method: 'POST',
        body: payload,
      },
    )
  }

  async function register(payload: RegisterDto) {
    return await api<RegisterResponse>(
      '/auth/register',
      {
        method: 'POST',
        body: payload,
      },
    )
  }

  async function getMe() {
    return await api('/auth/me')
  }

  return {
    login,
    register,
    getMe,
  }
}