'use client'

import { useState, useEffect } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard, Badge, ProgressBar, EmptyState } from '@/components/ui'
import { BreachModal, NotifyAuthorityModal } from '@/components/modals'
import { toast } from 'sonner'
import { formatDate, formatDateTime, formatBreachCountdown, BREACH_RISK_COLORS } from '@/lib/utils'
import type { BreachRecord } from '@/types'

const BREACHES: BreachRecord[] = [
  {
    id: 'b1', tenant_id: 't1', title: 'Database Incident', description: 'SQL injection via unpatched endpoint exposed user records.',
    status: 'detected', risk_level: 'high', regulation: 'gdpr',
    detected_at: new Date(Date.now() - 2*3600*1000).toISOString(),
    reported_by: 'Arjun Kumar',
    sa_notified: false, subjects_notified: false, dpbi_notified: false,
    notification_deadline: new Date(Date.now() + 70*3600*1000).toISOString(),
    hours_since_awareness: 2, affected_records_count: 2400,
    data_categories_affected: ['email', 'hashed_password', 'ip_address'],
    containment_measures: 'Endpoint patched and taken offline. Passwords force-reset.',
    root_cause: 'SQL injection via unpatched login endpoint',
    resolved_at: undefined, created_at: new Date(Date.now() - 2*3600*1000).toISOString(),
  },
  {
    id: 'b2', tenant_id: 't1', title: 'Email Phishing Incident', description: '3 employee accounts compromised via targeted phishing.',
    status: 'resolved', risk_level: 'medium', regulation: 'gdpr',
    detected_at: new Date(Date.now() - 170*24*3600*1000).toISOString(),
    reported_by: 'Priya Sharma',
    sa_notified: true, sa_notified_at: new Date(Date.now() - 170*24*3600*1000 + 14*3600*1000).toISOString(),
    subjects_notified: false, dpbi_notified: false,
    notification_deadline: new Date(Date.now() - 170*24*3600*1000 + 72*3600*1000).toISOString(),
    hours_since_awareness: 14, affected_records_count: 3,
    data_categories_affected: ['email', 'internal_credentials'],
    containment_measures: 'Accounts disabled, passwords reset, MFA enforced.',
    root_cause: 'Targeted spear-phishing campaign',
    resolved_at: new Date(Date.now() - 169*24*3600*1000).toISOString(),
    created_at: new Date(Date.now() - 170*24*3600*1000).toISOString(),
  },
  {
    id: 'b3', tenant_id: 't1', title: 'API Key Exposed in Repository', description: 'Read-only API key committed to public GitHub repo.',
    status: 'resolved', risk_level: 'low', regulation: 'gdpr',
    detected_at: new Date(Date.now() - 238*24*3600*1000).toISOString(),
    reported_by: 'Dev Team',
    sa_notified: false, subjects_notified: false, dpbi_notified: false,
    notification_deadline: new Date(Date.now() - 238*24*3600*1000 + 72*3600*1000).toISOString(),
    hours_since_awareness: 2, affected_records_count: 0,
    data_categories_affected: [],
    containment_measures: 'Key rotated immediately. Repo history cleaned.',
    root_cause: 'Developer accidentally committed .env file',
    resolved_at: new Date(Date.now() - 237*24*3600*1000).toISOString(),
    created_at: new Date(Date.now() - 238*24*3600*1000).toISOString(),
  },
]

export default function BreachPage() {
  const [modal, setModal]       = useState(false)
  const [notifyModal, setNotify] = useState(false)
  const [selectedBreachId, setSelectedBreachId] = useState<string>()
  const [breaches, setBreaches] = useState(BREACHES)
  const [, tick]                = useState(0)

  // Live countdown tick
  useEffect(() => {
    const t = setInterval(() => tick(n => n + 1), 60_000)
    return () => clearInterval(t)
  }, [])

  const active  = breaches.filter(b => b.status !== 'resolved')
  const resolved = breaches.filter(b => b.status === 'resolved')
  const avgResponse = 18 // hours

  function openNotify(id: string) {
    setSelectedBreachId(id)
    setNotify(true)
  }

  return (
    <>
      <Topbar
        title="Breach Management"
        subtitle="72hr SLA Tracking"
        cta={{ label: '+ Report Breach', onClick: () => setModal(true) }}
      />
      <div className="flex-1 overflow-y-auto p-7">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <StatCard label="Active Breaches"     value={active.length}  change="72hr SLA active" changeDir="down" color="red" />
          <StatCard label="Avg Response"        value={`${avgResponse}h`} change="Below 72hr limit" changeDir="up" color="amber" />
          <StatCard label="Resolved (YTD)"      value={resolved.length} change="100% within SLA" changeDir="up" color="green" />
          <StatCard label="Authority Notified"  value={breaches.filter(b=>b.sa_notified).length} change="GDPR Art.33" color="blue" />
        </div>

        {/* Active breach cards */}
        {active.map(breach => {
          const countdown = breach.notification_deadline
            ? formatBreachCountdown(breach.notification_deadline)
            : null
          const timerColor = countdown?.status === 'critical' ? 'var(--red)' :
                             countdown?.status === 'urgent'   ? 'var(--amber)' :
                             countdown?.status === 'warning'  ? 'var(--amber)' : 'var(--green)'

          return (
            <div key={breach.id} className="card mb-5" style={{ border: '1.5px solid var(--red-bd)', background: 'linear-gradient(135deg,#fffafa,#fff)' }}>
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🚨</span>
                <div className="flex-1">
                  <div className="text-[15px] font-[650]" style={{ color: 'var(--red)' }}>
                    ACTIVE — {breach.title}
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                    Breach ID: BRE-{breach.id.toUpperCase()} · Reported {breach.hours_since_awareness}h ago ·{' '}
                    <Badge variant="red">{breach.risk_level.toUpperCase()} RISK</Badge>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  {!breach.sa_notified && (
                    <Badge variant="red" className="text-[12px] px-3 py-1">⚠ AUTHORITY NOT NOTIFIED</Badge>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => openNotify(breach.id)}>
                    Notify DPA →
                  </button>
                </div>
              </div>

              {/* 72hr countdown bar */}
              {countdown && (
                <div className="p-4 rounded-[8px] mb-4"
                  style={{ background: 'var(--red-lt)', border: '1px solid var(--red-bd)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-semibold" style={{ color: 'var(--red)' }}>
                      72-Hour Notification SLA (GDPR Art. 33)
                    </span>
                    <span className="font-mono text-[22px] font-bold" style={{ color: timerColor }}>
                      {countdown.label}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${countdown.pct}%`, background: timerColor }} />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[11px]" style={{ color: 'var(--slate-lt)' }}>
                      Detected: {formatDateTime(breach.detected_at)}
                    </span>
                    {breach.notification_deadline && (
                      <span className="text-[11px] font-semibold" style={{ color: 'var(--red)' }}>
                        Deadline: {formatDateTime(breach.notification_deadline)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <div className="text-[12px] font-semibold mb-3" style={{ color: 'var(--navy)' }}>Breach Details</div>
                  <div className="space-y-2">
                    {[
                      { label: 'Records Affected', value: `~${breach.affected_records_count.toLocaleString()}` },
                      { label: 'Data Categories', value: breach.data_categories_affected.join(', ') || '—' },
                      { label: 'Root Cause', value: breach.root_cause || '—' },
                      { label: 'Containment', value: breach.containment_measures || '—' },
                    ].map(row => (
                      <div key={row.label} className="flex gap-3">
                        <span className="text-[12px] flex-shrink-0 w-32" style={{ color: 'var(--slate-lt)' }}>{row.label}</span>
                        <span className="text-[12px]" style={{ color: 'var(--navy)' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] font-semibold mb-3" style={{ color: 'var(--navy)' }}>Notification Status</div>
                  <div className="space-y-3">
                    {[
                      { icon: '🏛', label: 'ICO / Supervisory Authority', sub: 'GDPR Art. 33 — within 72hr', notified: breach.sa_notified, at: breach.sa_notified_at },
                      { icon: '👥', label: 'Data Subjects', sub: `~${breach.affected_records_count.toLocaleString()} affected — Art. 34`, notified: breach.subjects_notified, at: breach.subjects_notified_at },
                    ].map(n => (
                      <div key={n.label} className="flex items-center gap-3 p-2.5 rounded-[6px]"
                        style={{ background: n.notified ? 'var(--green-lt)' : 'var(--red-lt)', border: `1px solid ${n.notified ? 'var(--green-bd)' : 'var(--red-bd)'}` }}>
                        <span className="text-xl">{n.icon}</span>
                        <div className="flex-1">
                          <div className="text-[12px] font-semibold" style={{ color: 'var(--navy)' }}>{n.label}</div>
                          <div className="text-[11px]" style={{ color: 'var(--slate-lt)' }}>{n.sub}</div>
                        </div>
                        <Badge variant={n.notified ? 'green' : 'red'}>
                          {n.notified ? `✓ Notified` : 'Not Notified'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {active.length === 0 && (
          <div className="card mb-5 text-center py-8">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-semibold text-[15px]" style={{ color: 'var(--green)' }}>No active breaches</div>
            <div className="text-[13px] mt-1" style={{ color: 'var(--slate-lt)' }}>All breaches have been resolved and notified.</div>
          </div>
        )}

        {/* History table */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>Breach History</div>
            <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}>+ Report Breach</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Description</th><th>Risk</th><th>Detected</th><th>Response</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {breaches.map(b => (
                  <tr key={b.id}>
                    <td className="font-mono text-xs text-[var(--slate)]">BRE-{b.id.toUpperCase()}</td>
                    <td>
                      <div className="font-semibold text-[13px]">{b.title}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                        {b.affected_records_count > 0 ? `~${b.affected_records_count.toLocaleString()} records` : 'No records affected'}
                      </div>
                    </td>
                    <td><Badge variant={b.risk_level === 'high' ? 'red' : b.risk_level === 'medium' ? 'amber' : 'blue'}>{b.risk_level.toUpperCase()}</Badge></td>
                    <td className="text-[12px]" style={{ color: 'var(--slate)' }}>{formatDate(b.detected_at)}</td>
                    <td>
                      {b.status === 'resolved'
                        ? <span className="font-mono text-[12px]" style={{ color: 'var(--green)' }}>{b.hours_since_awareness}h {Math.floor((b.hours_since_awareness%1)*60)}m</span>
                        : <span style={{ color: 'var(--amber)', fontFamily: 'var(--mono)', fontSize: 12 }}>Active ↓</span>
                      }
                    </td>
                    <td>
                      <Badge variant={b.status === 'resolved' ? 'green' : 'red'}>
                        ● {b.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <BreachModal open={modal} onClose={() => setModal(false)} />
      <NotifyAuthorityModal
        open={notifyModal}
        onClose={() => setNotify(false)}
        breachId={selectedBreachId}
        hoursRemaining={70}
      />
    </>
  )
}
