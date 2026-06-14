// lib/auth.ts

import Cookies from 'js-cookie'
import { decodeJwt } from 'jose'
import type { TokenPayload, UserRole } from '@/types'

export function getAccessToken(): string | undefined {
  return Cookies.get('access_token')
}

export function setTokens(accessToken: string, refreshToken: string) {
  Cookies.set('access_token',  accessToken,  { expires: 1/48, sameSite: 'strict' })
  Cookies.set('refresh_token', refreshToken, { expires: 7,    sameSite: 'strict' })
}

export function clearTokens() {
  Cookies.remove('access_token')
  Cookies.remove('refresh_token')
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return decodeJwt(token) as TokenPayload
  } catch {
    return null
  }
}

export function getCurrentUser(): TokenPayload | null {
  const token = getAccessToken()
  if (!token) return null
  return decodeToken(token)
}

export function isAuthenticated(): boolean {
  const token = getAccessToken()
  if (!token) return false
  const payload = decodeToken(token)
  if (!payload) return false
  return payload.exp * 1000 > Date.now()
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
  owner:   4,
  admin:   3,
  member:  2,
  auditor: 1,
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[requiredRole] ?? 0)
}

export function isAdmin(role: UserRole): boolean {
  return hasRole(role, 'admin')
}

export function isOwner(role: UserRole): boolean {
  return role === 'owner'
}
