// lib/api.ts — Typed API client for the FastAPI backend

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import type {
  TokenPair, AssessmentResult, ConsentRecord, ConsentStats,
  DSRRequest, DSRType, BreachRecord, BreachRiskLevel,
  Certificate, AuditLog, Processor, PaginatedResponse,
} from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ── Axios instance ─────────────────────────────────────────────────────────

const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

// ── Request interceptor — attach token ─────────────────────────────────────

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response interceptor — handle 401, refresh ────────────────────────────

let refreshing = false
let refreshQueue: Array<(token: string) => void> = []

api.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      if (refreshing) {
        return new Promise(resolve => {
          refreshQueue.push((token: string) => {
            original.headers.Authorization = `Bearer ${token}`
            resolve(api(original))
          })
        })
      }
      refreshing = true
      try {
        const refresh = Cookies.get('refresh_token')
        if (!refresh) throw new Error('No refresh token')
        const { data } = await axios.post<TokenPair>(
          `${BASE_URL}/api/v1/auth/refresh`,
          { refresh_token: refresh }
        )
        Cookies.set('access_token', data.access_token, { expires: 1/48 }) // 30min
        Cookies.set('refresh_token', data.refresh_token, { expires: 7 })
        refreshQueue.forEach(cb => cb(data.access_token))
        refreshQueue = []
        original.headers.Authorization = `Bearer ${data.access_token}`
        return api(original)
      } catch {
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')
        window.location.href = '/auth/login'
        return Promise.reject(error)
      } finally {
        refreshing = false
      }
    }
    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post<TokenPair>('/auth/login', { email, password }),

  logout: () =>
    api.post('/auth/logout'),

  refresh: (refresh_token: string) =>
    api.post<TokenPair>('/auth/refresh', { refresh_token }),
}

// ── Assessments ───────────────────────────────────────────────────────────

export const assessmentApi = {
  run: () =>
    api.post<AssessmentResult>('/assessments/run'),

  getLatest: () =>
    api.get<AssessmentResult>('/assessments/latest'),

  getHistory: (limit = 10) =>
    api.get<{ items: AssessmentResult[]; count: number }>(`/assessments/history?limit=${limit}`),

  invalidateCache: () =>
    api.post('/assessments/invalidate-cache'),
}

// ── Consent ───────────────────────────────────────────────────────────────

export const consentApi = {
  list: (skip = 0, limit = 50) =>
    api.get<{ items: ConsentRecord[]; total: number }>(`/consent/?skip=${skip}&limit=${limit}`),

  capture: (data: {
    data_subject_id: string
    purpose: string
    lawful_basis: string
    consent_text_version?: string
    ip_address?: string
    metadata?: Record<string, unknown>
  }) => api.post<{ consent_id: string; status: string }>('/consent/', data),

  withdraw: (consent_id: string) =>
    api.delete<{ message: string }>(`/consent/${consent_id}`),

  stats: () =>
    api.get<ConsentStats>('/consent/stats'),
}

// ── DSR ───────────────────────────────────────────────────────────────────

export const dsrApi = {
  list: (skip = 0, limit = 50) =>
    api.get<{ items: DSRRequest[] }>(`/dsr/?skip=${skip}&limit=${limit}`),

  getOverdue: () =>
    api.get<{ items: DSRRequest[]; count: number }>('/dsr/overdue'),

  submit: (data: {
    data_subject_id:    string
    data_subject_email: string
    type:               DSRType
    description?:       string
  }) => api.post<{ dsr_id: string; status: string; due_date: string }>('/dsr/', data),

  complete: (dsr_id: string, notes?: string) =>
    api.patch<{ message: string }>(`/dsr/${dsr_id}/complete`, { notes }),
}

// ── Breaches ──────────────────────────────────────────────────────────────

export const breachApi = {
  list: (skip = 0, limit = 50) =>
    api.get<{ items: BreachRecord[] }>(`/breaches/?skip=${skip}&limit=${limit}`),

  report: (data: {
    title:            string
    description:      string
    risk_level:       BreachRiskLevel
    affected_count?:  number
    data_categories?: string[]
    contact_email:    string
  }) => api.post<{ breach_id: string; notification_deadline: string }>('/breaches/', data),

  markAuthorityNotified: (breach_id: string) =>
    api.patch<{ message: string }>(`/breaches/${breach_id}/notify-authority`),
}

// ── Certificates ──────────────────────────────────────────────────────────

export const certificateApi = {
  list: (skip = 0, limit = 10) =>
    api.get<{ items: Certificate[] }>(`/certificates/?skip=${skip}&limit=${limit}`),

  issue: (assessment_id: string) =>
    api.post<Certificate>('/certificates/issue', { assessment_id }),

  verify: (cert_number: string) =>
    api.get<{
      valid: boolean
      certificate_number: string
      regulation: string
      compliance_pct: number
      issued_at: string
      expires_at: string
      status: string
    }>(`/certificates/verify/${cert_number}`),

  downloadReport: (assessment_id: string, format: 'json' | 'html' | 'pdf') =>
    api.get(`/certificates/report/${assessment_id}?format=${format}`, { responseType: 'blob' }),
}

// ── Audit ─────────────────────────────────────────────────────────────────

export const auditApi = {
  list: (skip = 0, limit = 50, filters?: { action?: string; resource_type?: string }) => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) })
    if (filters?.action) params.append('action', filters.action)
    if (filters?.resource_type) params.append('resource_type', filters.resource_type)
    return api.get<{ items: AuditLog[]; total: number }>(`/audit/?${params}`)
  },
  export: () =>
    api.get('/audit/export', { responseType: 'blob' }),
}

// ── Data Map ──────────────────────────────────────────────────────────────

export const dataMapApi = {
  get: () =>
    api.get('/data-map/'),

  listProcessors: () =>
    api.get<{ items: Processor[]; count: number }>('/data-map/processors'),

  addProcessor: (data: Partial<Processor>) =>
    api.post<{ processor_id: string; name: string }>('/data-map/processors', data),

  processorsNoDPA: () =>
    api.get<{ items: Processor[]; count: number }>('/data-map/processors/no-dpa'),

  scanPII: (fields: string[]) =>
    api.post<{
      detected_pii: string[]
      special_categories: string[]
      risk_level: string
      has_special: boolean
    }>('/data-map/scan', fields),
}

// ── Billing ───────────────────────────────────────────────────────────────

export const billingApi = {
  getPlan: () =>
    api.get<{ plan: string; limits: Record<string, number> }>('/billing/plan'),

  getUsage: () =>
    api.get<{ usage: Record<string, number> }>('/billing/usage'),
}

export default api
