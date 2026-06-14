'use client'

import { cn, formatDate, formatRelative } from '@/lib/utils'
import type { RuleResult, AuditLog } from '@/types'

// ── StatCard ──────────────────────────────────────────────────────────────

interface StatCardProps {
  label:   string
  value:   string | number
  change?: string
  changeDir?: 'up' | 'down' | 'neutral'
  color:   'teal' | 'green' | 'red' | 'amber' | 'blue' | 'purple'
  icon?:   React.ReactNode
}

export function StatCard({ label, value, change, changeDir = 'neutral', color, icon }: StatCardProps) {
  return (
    <div className={cn('stat-card', color)}>
      {icon && <div className="absolute right-4 top-4 opacity-10 text-2xl">{icon}</div>}
      <div className="text-[11.5px] font-medium uppercase tracking-[.4px] mb-2" style={{ color: 'var(--slate-lt)' }}>
        {label}
      </div>
      <div className="text-[28px] font-bold leading-none mb-1.5 tabular-nums" style={{ color: 'var(--navy)' }}>
        {value}
      </div>
      {change && (
        <div className={cn(
          'text-xs flex items-center gap-1',
          changeDir === 'up' && 'text-[var(--green)]',
          changeDir === 'down' && 'text-[var(--red)]',
          changeDir === 'neutral' && 'text-[var(--slate-lt)]',
        )}>
          {changeDir === 'up' && '↑'}
          {changeDir === 'down' && '↓'}
          {change}
        </div>
      )}
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────

interface BadgeProps {
  variant: 'green' | 'red' | 'amber' | 'blue' | 'purple' | 'teal' | 'gray'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span className={cn(`badge badge-${variant}`, className)}>
      {children}
    </span>
  )
}

// ── ProgressBar ───────────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number       // 0-100
  color?: string
  height?: string
}

export function ProgressBar({ value, color = 'var(--teal)', height = '6px' }: ProgressBarProps) {
  return (
    <div className="progress-bar" style={{ height }}>
      <div className="progress-fill" style={{ width: `${Math.min(100, value)}%`, background: color }} />
    </div>
  )
}

// ── GaugeRing ─────────────────────────────────────────────────────────────

interface GaugeRingProps {
  value:  number    // 0-100
  size?:  number
  stroke?: number
  color?: string
  label?: string
}

export function GaugeRing({ value, size = 120, stroke = 10, color = 'var(--teal)', label = 'Score' }: GaugeRingProps) {
  const r   = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-bold" style={{ color: 'var(--navy)' }}>{value}%</span>
        <span className="text-[10px] font-medium" style={{ color: 'var(--slate-lt)' }}>{label}</span>
      </div>
    </div>
  )
}

// ── SLATimer ──────────────────────────────────────────────────────────────

interface SLATimerProps {
  status: 'critical' | 'warning' | 'safe' | 'overdue'
  label:  string
}

export function SLATimer({ status, label }: SLATimerProps) {
  const colors = {
    critical: 'var(--red)',
    warning:  'var(--amber)',
    safe:     'var(--green)',
    overdue:  'var(--red)',
  }
  return (
    <div className="sla-timer">
      <div className={cn('sla-dot', status === 'critical' || status === 'overdue' ? 'critical' : status)} />
      <span style={{ color: colors[status] }}>{label}</span>
    </div>
  )
}

// ── GapItem ───────────────────────────────────────────────────────────────

interface GapItemProps {
  result: RuleResult
}

export function GapItem({ result }: GapItemProps) {
  if (result.passed) return null
  return (
    <div className={cn(
      'flex gap-3 p-3 rounded-[6px] border mb-2 items-start transition-all',
      result.is_blocker ? 'border-l-[3px] border-l-[var(--red)]' : 'border-l-[3px] border-l-[var(--amber)]',
    )} style={{ borderColor: 'var(--border)', borderLeftColor: result.is_blocker ? 'var(--red)' : 'var(--amber)' }}>
      <div className="flex-shrink-0 mt-0.5">
        <Badge variant={result.is_blocker ? 'red' : 'amber'}>
          {result.is_blocker ? 'BLOCKER' : result.severity.toUpperCase()}
        </Badge>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold mb-0.5" style={{ color: 'var(--navy)' }}>
          {result.rule_id.split('.').slice(-1)[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </div>
        <div className="font-mono text-[11px] mb-1" style={{ color: 'var(--slate-lt)' }}>{result.article_ref}</div>
        <div className="text-xs leading-relaxed" style={{ color: 'var(--slate)' }}>{result.gap}</div>
        {result.remediation && (
          <div className="mt-1.5 text-[11px] leading-relaxed p-2 rounded"
            style={{ background: 'var(--silver)', color: 'var(--slate)' }}>
            💡 {result.remediation}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Timeline ──────────────────────────────────────────────────────────────

const ACTION_STYLES: Record<string, { bg: string; color: string; emoji: string }> = {
  'breach.report':          { bg: 'var(--red-lt)',    color: 'var(--red)',    emoji: '⚠' },
  'dsr.submit':             { bg: 'var(--blue-lt)',   color: 'var(--blue)',   emoji: '📋' },
  'dsr.complete':           { bg: 'var(--green-lt)',  color: 'var(--green)',  emoji: '✓' },
  'consent.capture':        { bg: 'var(--teal-lt)',   color: 'var(--teal)',   emoji: '✦' },
  'consent.withdraw':       { bg: 'var(--amber-lt)',  color: 'var(--amber)',  emoji: '✕' },
  'assessment.run':         { bg: 'var(--teal-lt)',   color: 'var(--teal)',   emoji: '◈' },
  'certificate.issue':      { bg: 'var(--purple-lt)', color: 'var(--purple)', emoji: '❋' },
  'tenant.update':          { bg: 'var(--silver)',    color: 'var(--slate)',  emoji: '⚙' },
}

function getActionStyle(action: string) {
  return ACTION_STYLES[action] || { bg: 'var(--silver)', color: 'var(--slate)', emoji: '·' }
}

interface TimelineProps {
  logs: AuditLog[]
}

export function Timeline({ logs }: TimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-[15px] top-0 bottom-0 w-px" style={{ background: 'var(--border)' }} />
      {logs.map((log, i) => {
        const s = getActionStyle(log.action)
        return (
          <div key={log.id || i} className="flex gap-4 pb-4 relative">
            <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs z-10 flex-shrink-0"
              style={{ background: s.bg, color: s.color, border: '2px solid white', boxShadow: '0 0 0 2px var(--border)' }}>
              {s.emoji}
            </div>
            <div className="flex-1 pt-1">
              <div className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>
                {log.action.replace('.', ' — ').replace(/_/g, ' ')}
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                {formatRelative(log.created_at)} · {log.actor_id}
              </div>
              {log.detail && Object.keys(log.detail).length > 0 && (
                <div className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--slate)' }}>
                  {Object.entries(log.detail).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon:    string
  title:   string
  description: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-6">
      <div className="text-4xl mb-3 opacity-40">{icon}</div>
      <div className="text-[15px] font-semibold mb-1.5" style={{ color: 'var(--navy)' }}>{title}</div>
      <div className="text-[13px]" style={{ color: 'var(--slate-lt)' }}>{description}</div>
      {action && (
        <button className="btn btn-primary mt-4" onClick={action.onClick}>{action.label}</button>
      )}
    </div>
  )
}

// ── Loading Skeleton ──────────────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded', className)}
      style={{ background: 'var(--border)' }} />
  )
}

export function CardSkeleton() {
  return (
    <div className="card">
      <Skeleton className="h-5 w-40 mb-4" />
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-4 w-32" />
    </div>
  )
}

// ── Filter Pills ──────────────────────────────────────────────────────────

interface FilterPillsProps {
  options:  { label: string; value: string }[]
  active:   string
  onChange: (v: string) => void
}

export function FilterPills({ options, active, onChange }: FilterPillsProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map(opt => (
        <button key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer',
            active === opt.value
              ? 'text-white'
              : 'bg-white text-[var(--slate)] border-[var(--border-dk)] hover:border-[var(--teal)] hover:text-[var(--teal)]'
          )}
          style={active === opt.value ? { background: 'var(--teal)', borderColor: 'var(--teal)' } : {}}>
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ── InfoBox ───────────────────────────────────────────────────────────────

interface InfoBoxProps {
  type: 'info' | 'warning' | 'error' | 'success'
  children: React.ReactNode
}

const INFO_STYLES = {
  info:    { bg: 'var(--blue-lt)',   border: 'var(--blue-bd)',   color: 'var(--blue)' },
  warning: { bg: 'var(--amber-lt)',  border: 'var(--amber-bd)',  color: 'var(--amber)' },
  error:   { bg: 'var(--red-lt)',    border: 'var(--red-bd)',    color: 'var(--red)' },
  success: { bg: 'var(--green-lt)',  border: 'var(--green-bd)',  color: 'var(--green)' },
}

export function InfoBox({ type, children }: InfoBoxProps) {
  const s = INFO_STYLES[type]
  return (
    <div className="rounded-[6px] px-3 py-2.5 text-xs leading-relaxed"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      {children}
    </div>
  )
}


// ── VendorRiskBadge ───────────────────────────────────────────────────────

interface VendorRiskBadgeProps {
  risk: 'critical' | 'high' | 'medium' | 'low'
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const riskConfig = {
  critical: {
    bg: 'var(--red-lt)',
    color: 'var(--red)',
    border: 'var(--red-bd)',
    label: 'Critical',
    icon: '⚠'
  },
  high: {
    bg: 'var(--amber-lt)',
    color: 'var(--amber)',
    border: 'var(--amber-bd)',
    label: 'High',
    icon: '▲'
  },
  medium: {
    bg: 'var(--blue-lt)',
    color: 'var(--blue)',
    border: 'var(--blue-bd)',
    label: 'Medium',
    icon: '■'
  },
  low: {
    bg: 'var(--green-lt)',
    color: 'var(--green)',
    border: 'var(--green-bd)',
    label: 'Low',
    icon: '●'
  }
}

const sizeConfig = {
  sm: 'text-[9px] px-1.5 py-0.5',
  md: 'text-[10px] px-2 py-0.5',
  lg: 'text-[11px] px-2.5 py-1'
}

export function VendorRiskBadge({ risk, showIcon = true, size = 'md', className }: VendorRiskBadgeProps) {
  const config = riskConfig[risk]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-semibold',
        sizeConfig[size],
        className
      )}
      style={{
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`
      }}
    >
      {showIcon && <span>{config.icon}</span>}
      {config.label}
    </span>
  )
}

// ── IntegrationStatus ─────────────────────────────────────────────────────

interface IntegrationStatusProps {
  status: 'connected' | 'disconnected' | 'error' | 'pending' | 'syncing'
  showLabel?: boolean
  size?: 'sm' | 'md'
  className?: string
}

const statusConfig = {
  connected: {
    bg: 'var(--green-lt)',
    color: 'var(--green)',
    border: 'var(--green-bd)',
    label: 'Connected',
    icon: '✓'
  },
  disconnected: {
    bg: 'var(--silver)',
    color: 'var(--slate)',
    border: 'var(--border)',
    label: 'Disconnected',
    icon: '✗'
  },
  error: {
    bg: 'var(--red-lt)',
    color: 'var(--red)',
    border: 'var(--red-bd)',
    label: 'Error',
    icon: '⚠'
  },
  pending: {
    bg: 'var(--amber-lt)',
    color: 'var(--amber)',
    border: 'var(--amber-bd)',
    label: 'Pending',
    icon: '◷'
  },
  syncing: {
    bg: 'var(--blue-lt)',
    color: 'var(--blue)',
    border: 'var(--blue-bd)',
    label: 'Syncing',
    icon: '↻'
  }
}

export function IntegrationStatus({ status, showLabel = true, size = 'sm', className }: IntegrationStatusProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5',
        className,
        status === 'syncing' && 'animate-pulse'
      )}
      style={{
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`
      }}
    >
      <span>{config.icon}</span>
      {showLabel && config.label}
    </span>
  )
}