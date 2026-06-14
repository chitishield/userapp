'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Badge, InfoBox } from '@/components/ui'
import { toast } from 'sonner'

const ACTIVITIES = [
  { name: 'Marketing Emails',  basis: 'consent',   categories: ['email', 'first_name'],                   retention: 365,  risk: 'low',      dpia: false, transfer: false },
  { name: 'Order Fulfilment',  basis: 'contract',  categories: ['name', 'address', 'payment_info'],       retention: 2555, risk: 'medium',   dpia: false, transfer: true  },
  { name: 'Biometric Auth',   basis: 'consent',   categories: ['fingerprint', 'facial_recognition'],     retention: 0,    risk: 'critical', dpia: false, transfer: false },
  { name: 'Analytics',        basis: 'consent',   categories: ['ip_address', 'device_id', 'page_views'], retention: 90,   risk: 'low',      dpia: false, transfer: true  },
]

const PROCESSORS = [
  { id: 'p1', name: 'Amazon Web Services',  country: 'Ireland (EU)',  service: 'Infrastructure',      dpa: true,  sccs: false, categories: ['all'] },
  { id: 'p2', name: 'SendGrid',             country: 'USA',           service: 'Email delivery',      dpa: true,  sccs: true,  categories: ['email'] },
  { id: 'p3', name: 'AnalyticsCo',         country: 'USA',           service: 'Analytics',           dpa: false, sccs: false, categories: ['ip_address'] },
  { id: 'p4', name: 'Stripe',              country: 'Ireland (EU)',  service: 'Payment processing',   dpa: true,  sccs: false, categories: ['payment_info'] },
]

const PII_MAP: Record<string, { category: string; risk: 'critical' | 'high' | 'medium' | 'low' }> = {
  email: { category: 'EMAIL', risk: 'medium' },
  phone: { category: 'PHONE', risk: 'medium' },
  aadhaar: { category: 'NATIONAL_ID', risk: 'critical' },
  fingerprint: { category: 'BIOMETRIC', risk: 'critical' },
  facial: { category: 'BIOMETRIC', risk: 'critical' },
  diagnosis: { category: 'HEALTH', risk: 'critical' },
  ip_address: { category: 'IP_ADDRESS', risk: 'low' },
  name: { category: 'NAME', risk: 'low' },
  address: { category: 'ADDRESS', risk: 'medium' },
  dob: { category: 'DATE_OF_BIRTH', risk: 'medium' },
  password: { category: 'CREDENTIAL', risk: 'high' },
  payment: { category: 'FINANCIAL', risk: 'high' },
  card: { category: 'FINANCIAL', risk: 'high' },
  religion: { category: 'RELIGION', risk: 'critical' },
  race: { category: 'RACIAL_ETHNIC', risk: 'critical' },
}

const RISK_COLORS: Record<string, 'red' | 'amber' | 'blue' | 'gray'> = {
  critical: 'red', high: 'red', medium: 'amber', low: 'blue',
}

export default function DataMapPage() {
  const [piiInput, setPiiInput] = useState('')
  const [piiResult, setPiiResult] = useState<null | { found: { field: string; category: string; risk: string }[]; riskLevel: string }>(null)

  function scanPII() {
    if (!piiInput.trim()) { toast.error('Enter field names to scan'); return }
    const fields = piiInput.toLowerCase().split(/[\s,]+/).filter(Boolean)
    const found: { field: string; category: string; risk: string }[] = []
    fields.forEach(f => {
      for (const [key, val] of Object.entries(PII_MAP)) {
        if (f.includes(key) && !found.find(x => x.category === val.category)) {
          found.push({ field: f, category: val.category, risk: val.risk })
        }
      }
    })
    const hasSpecial = found.some(f => f.risk === 'critical')
    const riskLevel = hasSpecial ? 'critical' : found.length >= 3 ? 'high' : found.length >= 1 ? 'medium' : 'none'
    setPiiResult({ found, riskLevel })
  }

  const noDPA = PROCESSORS.filter(p => !p.dpa)

  return (
    <>
      <Topbar title="Data Map" subtitle="Inventory & Lineage" cta={{ label: '+ Add Activity', onClick: () => toast.info('Activity form — coming soon') }} />
      <div className="flex-1 overflow-y-auto p-7">

        {/* No-DPA warning */}
        {noDPA.length > 0 && (
          <div className="mb-5 p-3 rounded-[8px] flex items-center gap-3"
            style={{ background: 'var(--red-lt)', border: '1px solid var(--red-bd)' }}>
            <span style={{ color: 'var(--red)' }}>⚠</span>
            <span className="text-[13px] font-semibold flex-1" style={{ color: 'var(--red)' }}>
              {noDPA.length} processor{noDPA.length > 1 ? 's' : ''} without a signed DPA: {noDPA.map(p => p.name).join(', ')}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-5 mb-5">

          {/* Processing activities */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>Processing Activities</div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>GDPR Art. 30 — Record of processing operations</div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => toast.info('Add activity form coming soon')}>+ Add</button>
            </div>
            <div className="flex flex-col gap-3">
              {ACTIVITIES.map(a => (
                <div key={a.name} className="p-3 rounded-[6px]"
                  style={{
                    border: `1px solid ${a.risk === 'critical' ? 'var(--red-bd)' : 'var(--border)'}`,
                    borderLeft: `3px solid ${a.risk === 'critical' ? 'var(--red)' : a.risk === 'medium' ? 'var(--amber)' : 'var(--green)'}`,
                    background: a.risk === 'critical' ? 'var(--red-lt)' : 'white',
                  }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>{a.name}</span>
                    <Badge variant={a.basis === 'consent' ? 'teal' : a.basis === 'contract' ? 'blue' : 'purple'}>
                      {a.basis}
                    </Badge>
                  </div>
                  <div className="text-[11px] mb-2" style={{ color: 'var(--slate-lt)' }}>
                    Categories: {a.categories.join(', ')} · Retention: {a.retention ? `${a.retention}d` : 'Session only'} ·{' '}
                    {a.transfer ? '🌍 Cross-border' : '🏠 Local'}
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {a.categories.map(c => {
                      const pii = Object.entries(PII_MAP).find(([k]) => c.toLowerCase().includes(k))
                      if (!pii) return <span key={c} className="chip" style={{ fontSize: 10 }}>{c}</span>
                      return (
                        <span key={c} className="chip" style={{
                          fontSize: 10,
                          background: pii[1].risk === 'critical' ? 'var(--red-lt)' : 'var(--amber-lt)',
                          borderColor: pii[1].risk === 'critical' ? 'var(--red-bd)' : 'var(--amber-bd)',
                          color: pii[1].risk === 'critical' ? 'var(--red)' : 'var(--amber)',
                        }}>
                          {c} ⚠
                        </span>
                      )
                    })}
                    {a.risk === 'critical' && !a.dpia && (
                      <span className="chip" style={{ fontSize: 10, background: 'var(--red-lt)', borderColor: 'var(--red-bd)', color: 'var(--red)', fontWeight: 600 }}>
                        DPIA Required
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-processors + PII scanner */}
          <div className="flex flex-col gap-5">

            {/* Processors */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>Sub-Processors</div>
                  <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>GDPR Art. 28 — DPA required for all</div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => toast.info('Add processor form coming soon')}>+ Add</button>
              </div>
              <div className="flex flex-col gap-2">
                {PROCESSORS.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-[6px]"
                    style={{
                      border: `1px solid ${p.dpa ? 'var(--border)' : 'var(--red-bd)'}`,
                      background: p.dpa ? 'white' : 'var(--red-lt)',
                    }}>
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>{p.name}</div>
                      <div className="text-[11px]" style={{ color: 'var(--slate-lt)' }}>
                        {p.service} · {p.country}
                        {!p.dpa && ' · ⚠ No DPA!'}
                        {p.sccs && ' · SCCs ✓'}
                      </div>
                    </div>
                    <Badge variant={p.dpa ? 'green' : 'red'}>
                      {p.dpa ? 'DPA ✓' : 'No DPA ⚠'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* PII Scanner */}
            <div className="card">
              <div className="text-[14px] font-[650] mb-3" style={{ color: 'var(--navy)' }}>PII Scanner</div>
              <p className="text-[12px] mb-3" style={{ color: 'var(--slate-lt)' }}>
                Enter field names to detect PII categories and assess GDPR/DPDPA obligations.
              </p>
              <div className="mb-3">
                <label className="form-label">Field Names</label>
                <input
                  className="form-input"
                  placeholder="email, full_name, aadhaar_number, fingerprint…"
                  value={piiInput}
                  onChange={e => { setPiiInput(e.target.value); setPiiResult(null) }}
                  onKeyDown={e => e.key === 'Enter' && scanPII()}
                />
                <p className="form-hint">Comma or space separated</p>
              </div>
              <button className="btn btn-secondary w-full justify-center" onClick={scanPII}>
                🔍 Scan for PII
              </button>

              {piiResult && (
                <div className="mt-3 p-3 rounded-[6px]"
                  style={{
                    background: piiResult.found.length === 0 ? 'var(--green-lt)' : piiResult.riskLevel === 'critical' ? 'var(--red-lt)' : 'var(--amber-lt)',
                    border: `1px solid ${piiResult.found.length === 0 ? 'var(--green-bd)' : piiResult.riskLevel === 'critical' ? 'var(--red-bd)' : 'var(--amber-bd)'}`,
                  }}>
                  {piiResult.found.length === 0 ? (
                    <div className="text-[13px] font-semibold" style={{ color: 'var(--green)' }}>✓ No PII categories detected</div>
                  ) : (
                    <>
                      <div className="text-[13px] font-semibold mb-2" style={{ color: piiResult.riskLevel === 'critical' ? 'var(--red)' : 'var(--amber)' }}>
                        {piiResult.riskLevel === 'critical' ? '🚨 Special Category PII Detected' : '⚠ PII Detected'}
                        <span className="font-mono text-[11px] ml-2 font-normal">Risk: {piiResult.riskLevel.toUpperCase()}</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {piiResult.found.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-[12px]">
                            <span className="font-mono text-[var(--slate)]">{f.field}</span>
                            <span className="mx-1">→</span>
                            <Badge variant={f.risk === 'critical' || f.risk === 'high' ? 'red' : 'amber'}>
                              {f.category}
                            </Badge>
                            {f.risk === 'critical' && (
                              <span className="text-[11px]" style={{ color: 'var(--red)' }}>
                                DPIA required — GDPR Art.35
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data flow summary */}
        <div className="card">
          <div className="text-[14px] font-[650] mb-4" style={{ color: 'var(--navy)' }}>International Transfer Summary</div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'EEA Transfers', count: 2, detail: 'AWS Ireland, Stripe Ireland', color: 'var(--green)', safe: true },
              { label: 'Non-EEA with SCCs', count: 1, detail: 'SendGrid USA — SCCs signed', color: 'var(--amber)', safe: true },
              { label: 'Non-EEA No Safeguard', count: 1, detail: 'AnalyticsCo USA — no SCCs!', color: 'var(--red)', safe: false },
            ].map(t => (
              <div key={t.label} className="p-4 rounded-[8px]"
                style={{ background: t.safe ? 'var(--green-lt)' : 'var(--red-lt)', border: `1px solid ${t.safe ? 'var(--green-bd)' : 'var(--red-bd)'}` }}>
                <div className="text-[22px] font-bold mb-1" style={{ color: t.color }}>{t.count}</div>
                <div className="text-[12px] font-semibold mb-1" style={{ color: 'var(--navy)' }}>{t.label}</div>
                <div className="text-[11px]" style={{ color: 'var(--slate-lt)' }}>{t.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
