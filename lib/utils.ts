// lib/utils.ts

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, differenceInHours, differenceInDays } from 'date-fns'

// ── Tailwind class merger ──────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Date formatters ───────────────────────────────────────────────────────
export function formatDate(date: string | Date, fmt = 'MMM d, yyyy') {
  return format(new Date(date), fmt)
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), "MMM d, yyyy · HH:mm 'UTC'")
}

export function formatRelative(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function hoursUntil(date: string | Date): number {
  return differenceInHours(new Date(date), new Date())
}

export function daysUntil(date: string | Date): number {
  return differenceInDays(new Date(date), new Date())
}

export function formatSLACountdown(dueDate: string): {
  label:    string
  status:   'critical' | 'warning' | 'safe' | 'overdue'
  hours:    number
} {
  const hours = hoursUntil(dueDate)
  if (hours < 0)  return { label: 'OVERDUE',           status: 'critical', hours }
  if (hours < 24) return { label: `${Math.floor(hours)}h left`,  status: 'critical', hours }
  if (hours < 72) return { label: `${Math.floor(hours/24)}d ${Math.floor(hours%24)}h left`, status: 'warning', hours }
  return { label: `${Math.floor(hours/24)}d left`, status: 'safe', hours }
}

export function formatBreachCountdown(deadline: string): {
  label:   string
  pct:     number  // 0-100, how much of 72hr has elapsed
  status:  'safe' | 'warning' | 'urgent' | 'critical'
} {
  const hoursLeft    = hoursUntil(deadline)
  const elapsed      = 72 - hoursLeft
  const pct          = Math.min(100, Math.max(0, (elapsed / 72) * 100))
  const h            = Math.max(0, Math.floor(hoursLeft))
  const m            = Math.max(0, Math.floor((hoursLeft % 1) * 60))
  const label        = hoursLeft <= 0 ? 'OVERDUE' : `${h}h ${m}m remaining`
  const status       = pct > 90 ? 'critical' : pct > 70 ? 'urgent' : pct > 45 ? 'warning' : 'safe'
  return { label, pct, status }
}

// ── Number formatters ─────────────────────────────────────────────────────
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n)
}

export function formatPct(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`
}

// ── Score helpers ─────────────────────────────────────────────────────────
export function getScoreColor(pct: number): string {
  if (pct >= 90) return 'var(--green)'
  if (pct >= 80) return 'var(--teal)'
  if (pct >= 60) return 'var(--amber)'
  return 'var(--red)'
}

export function getScoreLabel(pct: number): string {
  if (pct >= 90) return 'Excellent'
  if (pct >= 80) return 'Good'
  if (pct >= 60) return 'Needs Work'
  return 'Critical'
}

// ── DSR type labels ───────────────────────────────────────────────────────
export const DSR_LABELS: Record<string, { label: string; color: string }> = {
  access:      { label: 'Access',      color: 'badge-blue' },
  erasure:     { label: 'Erasure',     color: 'badge-red' },
  portability: { label: 'Portability', color: 'badge-purple' },
  correction:  { label: 'Correction',  color: 'badge-teal' },
  objection:   { label: 'Objection',   color: 'badge-amber' },
  restriction: { label: 'Restriction', color: 'badge-gray' },
}

export const DSR_STATUS_LABELS: Record<string, string> = {
  pending:     'badge-amber',
  in_progress: 'badge-blue',
  completed:   'badge-green',
  rejected:    'badge-gray',
  overdue:     'badge-red',
}

export const BREACH_RISK_COLORS: Record<string, string> = {
  high:   'badge-red',
  medium: 'badge-amber',
  low:    'badge-blue',
}

// ── Truncate ──────────────────────────────────────────────────────────────
export function truncate(str: string, n = 40): string {
  return str.length > n ? str.slice(0, n) + '…' : str
}

export function truncateMiddle(str: string, n = 16): string {
  if (str.length <= n) return str
  const half = Math.floor(n / 2)
  return `${str.slice(0, half)}…${str.slice(-half)}`
}
