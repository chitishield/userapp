'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Badge, InfoBox } from '@/components/ui'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

const CERT = {
  certificate_number: 'GDPR-2024-000001',
  regulation: 'gdpr',
  compliance_pct: 84.0,
  status: 'issued' as const,
  issued_at: '2024-12-01T00:00:00Z',
  expires_at: '2025-12-01T00:00:00Z',
  assessment_id: 'a_prev',
  tenant_name: 'Acme Technologies',
}

export default function CertificatesPage() {
  const [verifyInput, setVerifyInput] = useState('')
  const [verifyResult, setVerifyResult] = useState<null | { valid: boolean; detail: string }>(null)

  function verify() {
    if (!verifyInput.trim()) { toast.error('Enter a certificate number'); return }
    if (verifyInput.trim() === CERT.certificate_number) {
      setVerifyResult({ valid: true, detail: `${CERT.tenant_name} · GDPR · ${CERT.compliance_pct}% · Issued ${formatDate(CERT.issued_at)} · Expires ${formatDate(CERT.expires_at)}` })
    } else {
      setVerifyResult({ valid: false, detail: `No certificate found for "${verifyInput}". Try: GDPR-2024-000001` })
    }
  }

  return (
    <>
      <Topbar title="Certificates" subtitle="Issue & Verify" cta={{ label: '⬇ Download Report', onClick: () => toast.success('Report generated') }} />
      <div className="flex-1 overflow-y-auto p-7">
        <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 2fr' }}>

          {/* Certificate display */}
          <div>
            {/* Cert card */}
            <div className="rounded-[10px] p-6 mb-4 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg,var(--navy) 0%,var(--navy-mid) 100%)', boxShadow: '0 12px 32px rgba(0,0,0,.15)' }}>
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10" style={{ border: '30px solid var(--teal)', transform: 'translate(40px,-40px)' }} />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-5" style={{ border: '20px solid white', transform: 'translate(-20px,20px)' }} />
              <div className="relative">
                <div className="absolute top-0 right-0">
                  <Badge variant="teal">✓ ISSUED</Badge>
                </div>
                <div className="font-mono text-[12px] mb-3" style={{ color: 'var(--teal-mid)' }}>
                  {CERT.certificate_number}
                </div>
                <div className="text-white text-[19px] font-bold mb-1">GDPR Compliance Certificate</div>
                <div className="text-[13px] mb-5" style={{ color: 'rgba(255,255,255,.5)' }}>
                  General Data Protection Regulation (EU) 2016/679
                </div>
                <div className="flex items-end gap-2 mb-5">
                  <span className="text-[42px] font-bold leading-none" style={{ color: 'var(--teal-glow)' }}>
                    {CERT.compliance_pct}
                  </span>
                  <span className="text-[18px] mb-1" style={{ color: 'rgba(255,255,255,.4)' }}>%</span>
                  <span className="text-[13px] mb-1.5" style={{ color: 'rgba(255,255,255,.4)' }}>Compliance Score</span>
                </div>
                <div className="flex gap-5">
                  {[
                    { label: 'Issued', value: formatDate(CERT.issued_at) },
                    { label: 'Expires', value: formatDate(CERT.expires_at) },
                    { label: 'Issued By', value: 'ChitiShield' },
                  ].map(m => (
                    <div key={m.label}>
                      <div className="text-[10px] uppercase tracking-[.5px]" style={{ color: 'rgba(255,255,255,.35)' }}>{m.label}</div>
                      <div className="text-[12px] font-medium text-white">{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Download buttons */}
            <div className="flex gap-2 mb-5">
              <button className="btn btn-primary flex-1 justify-center" onClick={() => toast.success('Certificate PDF downloaded')}>
                ⬇ Download PDF
              </button>
              <button className="btn btn-secondary" onClick={() => { navigator.clipboard?.writeText(`https://verify.ChitiShield.io/cert/${CERT.certificate_number}`); toast.success('Public link copied') }}>
                🔗 Copy Link
              </button>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">

            {/* Eligibility */}
            <div className="card" style={{ border: '1.5px solid var(--amber-bd)', background: 'var(--amber-lt)' }}>
              <div className="flex gap-3">
                <span className="text-2xl">⚠</span>
                <div>
                  <div className="text-[14px] font-[650] mb-1" style={{ color: 'var(--amber)' }}>Not Eligible for Renewal Yet</div>
                  <div className="text-[12px] leading-relaxed" style={{ color: 'var(--slate)' }}>
                    Current score is <strong>87%</strong> but <strong>2 active blockers</strong> prevent certificate issuance.
                    Resolve GDPR Art.32 (security measures) and Art.35 (DPIA) gaps to become eligible.
                  </div>
                  <div className="flex gap-2 mt-3">
                    <a href="/dashboard/assessment" className="btn btn-secondary btn-sm">View Gaps →</a>
                    <a href="/dashboard/assessment" className="btn btn-primary btn-sm">Run Assessment →</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Verify */}
            <div className="card">
              <div className="text-[14px] font-[650] mb-3" style={{ color: 'var(--navy)' }}>Verify a Certificate</div>
              <div className="mb-3">
                <label className="form-label">Certificate Number</label>
                <input
                  className="form-input"
                  placeholder="e.g. GDPR-2024-000001"
                  value={verifyInput}
                  onChange={e => { setVerifyInput(e.target.value); setVerifyResult(null) }}
                  onKeyDown={e => e.key === 'Enter' && verify()}
                />
              </div>
              <button className="btn btn-secondary w-full justify-center" onClick={verify}>🔍 Verify Certificate</button>
              {verifyResult && (
                <div className="mt-3 p-3 rounded-[6px]"
                  style={{
                    background: verifyResult.valid ? 'var(--green-lt)' : 'var(--red-lt)',
                    border: `1px solid ${verifyResult.valid ? 'var(--green-bd)' : 'var(--red-bd)'}`,
                  }}>
                  <div className="font-semibold text-[13px] mb-1" style={{ color: verifyResult.valid ? 'var(--green)' : 'var(--red)' }}>
                    {verifyResult.valid ? '✓ Valid Certificate' : '✕ Not Found'}
                  </div>
                  <div className="text-[12px]" style={{ color: 'var(--slate)' }}>{verifyResult.detail}</div>
                </div>
              )}
            </div>

            {/* Evidence pack downloads */}
            <div className="card">
              <div className="text-[14px] font-[650] mb-3" style={{ color: 'var(--navy)' }}>Evidence Pack & Reports</div>
              <div className="flex flex-col gap-2">
                {[
                  { icon: '📄', title: 'Full Assessment Report', sub: 'PDF · All 17 rules · Evidence', format: 'pdf' },
                  { icon: '📊', title: 'Compliance JSON Export', sub: 'Machine-readable · API integration', format: 'json' },
                  { icon: '🌐', title: 'HTML Preview Report', sub: 'Browser-viewable · Share with team', format: 'html' },
                  { icon: '📋', title: 'Audit Log Export', sub: 'Full immutable trail · CSV/JSON', format: 'audit' },
                ].map(r => (
                  <div key={r.title} className="flex items-center gap-3 p-2.5 rounded-[6px]" style={{ border: '1px solid var(--border)' }}>
                    <span className="text-xl">{r.icon}</span>
                    <div className="flex-1">
                      <div className="text-[12px] font-semibold" style={{ color: 'var(--navy)' }}>{r.title}</div>
                      <div className="text-[11px]" style={{ color: 'var(--slate-lt)' }}>{r.sub}</div>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => toast.success(`${r.title} downloaded`)}>
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate history */}
            <div className="card">
              <div className="text-[14px] font-[650] mb-3" style={{ color: 'var(--navy)' }}>Certificate History</div>
              <table className="data-table">
                <thead><tr><th>Number</th><th>Score</th><th>Issued</th><th>Status</th></tr></thead>
                <tbody>
                  <tr>
                    <td className="font-mono text-xs text-[var(--slate)]">GDPR-2024-000001</td>
                    <td><span className="font-semibold" style={{ color: 'var(--teal)' }}>84%</span></td>
                    <td className="text-[12px]" style={{ color: 'var(--slate)' }}>Dec 1, 2024</td>
                    <td><Badge variant="green">● Issued</Badge></td>
                  </tr>
                  <tr>
                    <td className="font-mono text-xs text-[var(--slate)]">GDPR-2023-000001</td>
                    <td><span className="font-semibold" style={{ color: 'var(--amber)' }}>76%</span></td>
                    <td className="text-[12px]" style={{ color: 'var(--slate)' }}>Dec 1, 2023</td>
                    <td><Badge variant="gray">● Expired</Badge></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
