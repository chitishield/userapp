'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard, Badge, FilterPills, EmptyState } from '@/components/ui'
import { ConsentModal } from '@/components/modals'
import { toast } from 'sonner'
import { formatDateTime, formatDate, daysUntil } from '@/lib/utils'
import type { ConsentRecord } from '@/types'

const CONSENTS: ConsentRecord[] = [
  { id: 'c1', tenant_id: 't1', data_subject_id: 'a3b8f2c91d', purpose: 'newsletter', lawful_basis: 'consent', status: 'active', regulation: 'gdpr', consent_text_version: '2.1', ip_address: '192.168.1.1', source: 'web_form', given_at: new Date(Date.now()-2*86400*1000).toISOString(), expires_at: new Date(Date.now()+365*86400*1000).toISOString(), is_child_data: false, parental_consent_verified: false, metadata: {}, created_at: new Date(Date.now()-2*86400*1000).toISOString() },
  { id: 'c2', tenant_id: 't1', data_subject_id: 'd7e4a1f02b', purpose: 'analytics', lawful_basis: 'consent', status: 'active', regulation: 'gdpr', consent_text_version: '2.1', ip_address: '10.0.0.5', source: 'api', given_at: new Date(Date.now()-3*86400*1000).toISOString(), is_child_data: false, parental_consent_verified: false, metadata: {}, created_at: new Date(Date.now()-3*86400*1000).toISOString() },
  { id: 'c3', tenant_id: 't1', data_subject_id: 'b2c5d9a17e', purpose: 'order_processing', lawful_basis: 'contract', status: 'withdrawn', regulation: 'gdpr', consent_text_version: '2.0', ip_address: '192.168.2.4', source: 'web_form', given_at: new Date(Date.now()-10*86400*1000).toISOString(), withdrawn_at: new Date(Date.now()-1*86400*1000).toISOString(), is_child_data: false, parental_consent_verified: false, metadata: {}, created_at: new Date(Date.now()-10*86400*1000).toISOString() },
  { id: 'c4', tenant_id: 't1', data_subject_id: 'f9a3c6e84d', purpose: 'profiling', lawful_basis: 'consent', status: 'active', regulation: 'gdpr', consent_text_version: '1.0', ip_address: '10.0.0.12', source: 'import', given_at: new Date(Date.now()-50*86400*1000).toISOString(), expires_at: new Date(Date.now()+3*86400*1000).toISOString(), is_child_data: false, parental_consent_verified: false, metadata: {}, created_at: new Date(Date.now()-50*86400*1000).toISOString() },
  { id: 'c5', tenant_id: 't1', data_subject_id: 'e1d7b3c822', purpose: 'marketing', lawful_basis: 'legitimate_interests', status: 'expired', regulation: 'gdpr', consent_text_version: '1.0', ip_address: '10.0.0.8', source: 'api', given_at: new Date(Date.now()-400*86400*1000).toISOString(), expires_at: new Date(Date.now()-35*86400*1000).toISOString(), is_child_data: false, parental_consent_verified: false, metadata: {}, created_at: new Date(Date.now()-400*86400*1000).toISOString() },
]

const LAWFUL_BASIS_COLORS: Record<string, 'teal'|'blue'|'purple'|'gray'> = {
  consent: 'teal', contract: 'blue', legal_obligation: 'purple', legitimate_interests: 'gray',
}

export default function ConsentPage() {
  const [filter, setFilter]   = useState('all')
  const [modal, setModal]     = useState(false)
  const [records, setRecords] = useState(CONSENTS)

  const filtered = records.filter(r => filter === 'all' || r.status === filter)

  const stats = {
    total:     records.length,
    active:    records.filter(r => r.status === 'active').length,
    expiring:  records.filter(r => r.status === 'active' && r.expires_at && daysUntil(r.expires_at) <= 7 && daysUntil(r.expires_at) > 0).length,
    withdrawn: records.filter(r => r.status === 'withdrawn').length,
  }

  function withdraw(id: string) {
    setRecords(rs => rs.map(r => r.id === id ? { ...r, status: 'withdrawn' as const, withdrawn_at: new Date().toISOString() } : r))
    toast.success('Consent withdrawn and recorded in audit log')
  }

  function getExpiryDisplay(record: ConsentRecord) {
    if (!record.expires_at) return { text: 'No expiry', color: 'var(--slate-lt)', warn: false }
    const days = daysUntil(record.expires_at)
    if (days < 0)  return { text: `Expired ${Math.abs(days)}d ago`, color: 'var(--red)', warn: true }
    if (days <= 7) return { text: `${days}d — Expiring ⚠`, color: 'var(--red)', warn: true }
    if (days <= 30) return { text: `${days}d remaining`, color: 'var(--amber)', warn: false }
    return { text: formatDate(record.expires_at), color: 'var(--slate-lt)', warn: false }
  }

  return (
    <>
      <Topbar
        title="Consent Management"
        subtitle="Capture & Withdraw"
        cta={{ label: '+ Capture Consent', onClick: () => setModal(true) }}
      />
      <div className="flex-1 overflow-y-auto p-7">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <StatCard label="Total Consents"  value={stats.total.toLocaleString()} change="↑ 142 today" changeDir="up" color="teal" />
          <StatCard label="Active"          value={stats.active.toLocaleString()} change={`${Math.round(stats.active/stats.total*100)}% of total`} color="green" />
          <StatCard label="Expiring (7d)"   value={stats.expiring} change="Re-consent needed" color="amber" />
          <StatCard label="Withdrawn"       value={stats.withdrawn.toLocaleString()} change={`${Math.round(stats.withdrawn/stats.total*100)}% rate`} color="red" />
        </div>

        {/* Records table */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>Consent Records</div>
              <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                All consent events — timestamped, versioned, audited
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FilterPills
                options={[
                  { label: 'All', value: 'all' },
                  { label: 'Active', value: 'active' },
                  { label: 'Withdrawn', value: 'withdrawn' },
                  { label: 'Expired', value: 'expired' },
                ]}
                active={filter}
                onChange={setFilter}
              />
              <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}>+ Capture</button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon="✅" title="No records" description="No consent records match the current filter." />
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Data Subject</th>
                    <th>Purpose</th>
                    <th>Lawful Basis</th>
                    <th>Version</th>
                    <th>Given At</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(record => {
                    const expiry = getExpiryDisplay(record)
                    return (
                      <tr key={record.id}>
                        <td>
                          <span className="font-mono text-[12px]" style={{ color: 'var(--slate)' }}>
                            {record.data_subject_id.slice(0, 10)}…
                          </span>
                          <div className="text-[11px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                            via {record.source}
                          </div>
                        </td>
                        <td>
                          <span className="chip">{record.purpose}</span>
                        </td>
                        <td>
                          <Badge variant={LAWFUL_BASIS_COLORS[record.lawful_basis] || 'gray'}>
                            {record.lawful_basis}
                          </Badge>
                        </td>
                        <td>
                          <span className="font-mono text-xs" style={{ color: 'var(--slate)' }}>
                            v{record.consent_text_version}
                          </span>
                        </td>
                        <td>
                          <div className="text-[12px]" style={{ color: 'var(--slate)' }}>
                            {formatDateTime(record.given_at).split('·')[0].trim()}
                          </div>
                        </td>
                        <td>
                          <span className="text-[12px] font-medium" style={{ color: expiry.color }}>
                            {expiry.text}
                          </span>
                        </td>
                        <td>
                          {record.status === 'active'    && <Badge variant="green">● Active</Badge>}
                          {record.status === 'withdrawn' && <Badge variant="red">● Withdrawn</Badge>}
                          {record.status === 'expired'   && <Badge variant="gray">● Expired</Badge>}
                        </td>
                        <td>
  {record.status === 'active' ? (
    <div className="flex items-center gap-2">
      <button
        className="btn btn-ghost btn-sm"
        style={{ color: 'var(--red)' }}
        onClick={() => withdraw(record.id)}
      >
        Withdraw
      </button>

      {expiry.warn && (
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => toast.success('Re-consent request sent')}
        >
          Re-ask
        </button>
      )}
    </div>
  ) : (
    <span
      className="text-[12px]"
      style={{ color: 'var(--slate-lt)' }}
    >
      {record.withdrawn_at
        ? formatDate(record.withdrawn_at)
        : '—'}
    </span>
  )}
</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConsentModal open={modal} onClose={() => setModal(false)} />
    </>
  )
}
