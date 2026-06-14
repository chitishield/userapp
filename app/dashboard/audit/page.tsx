'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Badge, FilterPills } from '@/components/ui'
import { toast } from 'sonner'
import { formatDateTime, truncateMiddle } from '@/lib/utils'

const LOGS = [
  { id: 'l1', actor_id: 'Arjun Kumar',  actor_role: 'owner',  action: 'breach.report',       resource_type: 'breach_record',  resource_id: 'BRE-001',  ip_address: '192.168.1.1', created_at: new Date(Date.now()-2*3600*1000).toISOString(),   hash: 'a3f9c2e1b84d', regulation: 'gdpr', detail: { title: 'Database Incident', risk_level: 'high' } },
  { id: 'l2', actor_id: 'System',       actor_role: 'system', action: 'assessment.run',       resource_type: 'assessment',     resource_id: 'a001',     ip_address: '',            created_at: new Date(Date.now()-2.5*3600*1000).toISOString(), hash: 'b7d3e1f92c44', regulation: 'gdpr', detail: { score: '87%', blockers: 2 } },
  { id: 'l3', actor_id: 'Priya Sharma', actor_role: 'admin',  action: 'dsr.complete',         resource_type: 'dsr_request',    resource_id: 'DSR-1024', ip_address: '10.0.0.24',  created_at: new Date(Date.now()-5*3600*1000).toISOString(),   hash: 'c9a2b8e05f31', regulation: 'gdpr', detail: { type: 'correction', subject: 'ravi.s@gmail.com' } },
  { id: 'l4', actor_id: 'System',       actor_role: 'system', action: 'consent.capture',      resource_type: 'consent_record', resource_id: 'batch_001',ip_address: '',            created_at: new Date(Date.now()-24*3600*1000).toISOString(),  hash: 'd4f8a1b39c22', regulation: 'gdpr', detail: { count: 142, purpose: 'newsletter' } },
  { id: 'l5', actor_id: 'Arjun Kumar',  actor_role: 'owner',  action: 'tenant.update',        resource_type: 'tenant',         resource_id: 't1',       ip_address: '192.168.1.1', created_at: new Date(Date.now()-28*3600*1000).toISOString(),  hash: 'e1c7d4a28b55', regulation: 'gdpr', detail: { fields: ['dpo_appointed', 'dpo_contact'] } },
  { id: 'l6', actor_id: 'Priya Sharma', actor_role: 'admin',  action: 'dsr.submit',           resource_type: 'dsr_request',    resource_id: 'DSR-1030', ip_address: '10.0.0.24',  created_at: new Date(Date.now()-36*3600*1000).toISOString(),  hash: 'f2b8c5d17e44', regulation: 'gdpr', detail: { type: 'portability', subject: 'maya.k@hotmail.com' } },
  { id: 'l7', actor_id: 'System',       actor_role: 'system', action: 'consent.withdraw',     resource_type: 'consent_record', resource_id: 'c003',     ip_address: '',            created_at: new Date(Date.now()-48*3600*1000).toISOString(),  hash: 'g3c9d6e28f55', regulation: 'gdpr', detail: { purpose: 'order_processing' } },
  { id: 'l8', actor_id: 'Arjun Kumar',  actor_role: 'owner',  action: 'certificate.issue',    resource_type: 'certificate',    resource_id: 'CERT-001', ip_address: '192.168.1.1', created_at: new Date(Date.now()-90*24*3600*1000).toISOString(),hash: 'h4d0e7f39g66', regulation: 'gdpr', detail: { cert_number: 'GDPR-2024-000001', score: '84%' } },
]

const ACTION_VARIANTS: Record<string, 'red' | 'green' | 'blue' | 'teal' | 'amber' | 'purple' | 'gray'> = {
  'breach.report':       'red',
  'breach.authority_notified': 'green',
  'dsr.submit':          'blue',
  'dsr.complete':        'green',
  'consent.capture':     'teal',
  'consent.withdraw':    'amber',
  'assessment.run':      'teal',
  'certificate.issue':   'purple',
  'tenant.update':       'gray',
}

const FILTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'consent.*', value: 'consent' },
  { label: 'dsr.*', value: 'dsr' },
  { label: 'breach.*', value: 'breach' },
  { label: 'assessment.*', value: 'assessment' },
  { label: 'cert.*', value: 'certificate' },
]

export default function AuditPage() {
  const [filter, setFilter]    = useState('all')
  const [copiedHash, setCopied] = useState<string | null>(null)

  const filtered = LOGS.filter(l => filter === 'all' || l.action.startsWith(filter))

  function copyHash(hash: string, full: string) {
    navigator.clipboard?.writeText(`SHA-256: ${full}`)
    setCopied(hash)
    setTimeout(() => setCopied(null), 2000)
    toast.success('Integrity hash copied to clipboard')
  }

  function exportLogs() {
    const json = JSON.stringify(filtered, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `audit_log_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Audit log exported')
  }

  return (
    <>
      <Topbar
        title="Audit Log"
        subtitle="Immutable Trail"
        cta={{ label: '⬇ Export Logs', onClick: exportLogs }}
      />
      <div className="flex-1 overflow-y-auto p-7">

        {/* Info banner */}
        <div className="mb-5 p-3 rounded-[8px] flex items-center gap-3 text-[12px]"
          style={{ background: 'var(--teal-lt)', border: '1px solid var(--teal-mid)', color: 'var(--teal)' }}>
          <span>🔒</span>
          <span>
            <strong>Append-only, tamper-evident.</strong> Every record carries a SHA-256 integrity hash over
            (tenant_id + actor_id + action + resource_id + created_at). Records are never updated or deleted.
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          {[
            { label: 'Total Events', value: LOGS.length, color: 'var(--navy)' },
            { label: 'Last 24h', value: LOGS.filter(l => new Date(l.created_at) > new Date(Date.now()-86400*1000)).length, color: 'var(--teal)' },
            { label: 'Unique Actors', value: [...new Set(LOGS.map(l => l.actor_id))].length, color: 'var(--blue)' },
            { label: 'Integrity', value: '100%', color: 'var(--green)' },
          ].map(s => (
            <div key={s.label} className="card text-center py-4">
              <div className="text-[24px] font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[11px] font-medium mt-1 uppercase tracking-[.4px]" style={{ color: 'var(--slate-lt)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>Event Log</div>
              <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                {filtered.length} events · SHA-256 signed · Append-only
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FilterPills options={FILTER_OPTIONS} active={filter} onChange={setFilter} />
              <button className="btn btn-secondary btn-sm" onClick={exportLogs}>⬇ Export</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>Detail</th>
                  <th>Integrity</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(log => (
                  <tr key={log.id}>
                    <td>
                      <div className="font-mono text-[11px]" style={{ color: 'var(--slate)' }}>
                        {formatDateTime(log.created_at).replace('·', '\n').split('\n').map((line, i) => (
                          <div key={i}>{line.trim()}</div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="text-[13px] font-semibold">{log.actor_id}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                        {log.actor_role}
                        {log.ip_address && ` · ${log.ip_address}`}
                      </div>
                    </td>
                    <td>
                      <Badge variant={ACTION_VARIANTS[log.action] || 'gray'}>
                        {log.action}
                      </Badge>
                    </td>
                    <td>
                      <div className="font-mono text-[11px]" style={{ color: 'var(--slate)' }}>
                        {log.resource_type}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                        {log.resource_id}
                      </div>
                    </td>
                    <td>
                      <div className="text-[11px]" style={{ color: 'var(--slate)' }}>
                        {Object.entries(log.detail).slice(0, 2).map(([k, v]) => (
                          <div key={k}><span style={{ color: 'var(--slate-lt)' }}>{k}:</span> {String(v)}</div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => copyHash(log.hash, `${log.hash}...full_hash_here`)}
                        className="chip cursor-pointer hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all"
                        style={{ fontSize: 10 }}
                        title={`SHA-256: ${log.hash}`}>
                        {copiedHash === log.hash ? '✓ Copied' : `✓ ${log.hash.slice(0, 10)}…`}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
