'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { GaugeRing, Badge, FilterPills, GapItem, ProgressBar, EmptyState } from '@/components/ui'
import { toast } from 'sonner'
import { cn, formatDateTime, getScoreColor } from '@/lib/utils'
import type { RuleResult } from '@/types'

const ASSESSMENT = {
  assessment_id: 'a001',
  regulation:    'gdpr',
  compliance_pct: 87.2,
  total_score:    139.2,
  max_score:      160.0,
  passed:         false,
  certificate_eligible: false,
  blocker_count:  2,
  failure_count:  3,
  created_at:     new Date(Date.now() - 2*3600*1000).toISOString(),
  results: [
    { rule_id: 'gdpr.art6.lawful_basis',       article_ref: 'GDPR Art. 6',   passed: true,  score: 15, weighted_score: 15, is_blocker: true,  severity: 'critical', gap: '', remediation: '', evidence: {} },
    { rule_id: 'gdpr.art7.consent_conditions', article_ref: 'GDPR Art. 7',   passed: true,  score: 15, weighted_score: 15, is_blocker: true,  severity: 'critical', gap: '', remediation: '', evidence: {} },
    { rule_id: 'gdpr.art8.child_consent',      article_ref: 'GDPR Art. 8',   passed: true,  score: 10, weighted_score: 10, is_blocker: true,  severity: 'critical', gap: '', remediation: '', evidence: {} },
    { rule_id: 'gdpr.art13.transparency',      article_ref: 'GDPR Art. 13/14', passed: true, score: 10, weighted_score: 10, is_blocker: false, severity: 'high',     gap: '', remediation: '', evidence: {} },
    { rule_id: 'gdpr.art15.right_to_access',   article_ref: 'GDPR Art. 15',  passed: true,  score: 10, weighted_score: 10, is_blocker: true,  severity: 'critical', gap: '', remediation: '', evidence: {} },
    { rule_id: 'gdpr.art17.right_to_erasure',  article_ref: 'GDPR Art. 17',  passed: true,  score: 12, weighted_score: 12, is_blocker: true,  severity: 'critical', gap: '', remediation: '', evidence: {} },
    { rule_id: 'gdpr.art20.portability',       article_ref: 'GDPR Art. 20',  passed: true,  score:  8, weighted_score:  8, is_blocker: false, severity: 'high',     gap: '', remediation: '', evidence: {} },
    { rule_id: 'gdpr.art21.right_to_object',   article_ref: 'GDPR Art. 21',  passed: true,  score:  8, weighted_score:  8, is_blocker: false, severity: 'high',     gap: '', remediation: '', evidence: {} },
    { rule_id: 'gdpr.art22.automated_decisions', article_ref: 'GDPR Art. 22', passed: true, score:  8, weighted_score:  8, is_blocker: false, severity: 'high',     gap: '', remediation: '', evidence: {} },
    { rule_id: 'gdpr.art25.data_by_design',    article_ref: 'GDPR Art. 25',  passed: true,  score: 10, weighted_score: 10, is_blocker: false, severity: 'high',     gap: '', remediation: '', evidence: {} },
    { rule_id: 'gdpr.art28.processor_agreement', article_ref: 'GDPR Art. 28', passed: true, score: 10, weighted_score: 10, is_blocker: true,  severity: 'critical', gap: '', remediation: '', evidence: {} },
    { rule_id: 'gdpr.art33.breach_notify_sa',  article_ref: 'GDPR Art. 33',  passed: true,  score: 15, weighted_score: 15, is_blocker: true,  severity: 'critical', gap: '', remediation: '', evidence: {} },
    { rule_id: 'gdpr.art33.breach_register',   article_ref: 'GDPR Art. 33(5)', passed: true, score: 8, weighted_score:  8, is_blocker: false, severity: 'high',     gap: '', remediation: '', evidence: {} },
    { rule_id: 'gdpr.art34.breach_notify_subjects', article_ref: 'GDPR Art. 34', passed: true, score: 10, weighted_score: 10, is_blocker: true, severity: 'critical', gap: '', remediation: '', evidence: {} },
    { rule_id: 'gdpr.art32.security_measures', article_ref: 'GDPR Art. 32',  passed: false, score: 12, weighted_score:  0, is_blocker: true,  severity: 'critical', gap: 'Security measures incomplete — regular security testing and employee training required.', remediation: 'Implement annual pen tests, AES-256 encryption at rest, and GDPR-specific staff training.', evidence: { missing: ['regular_security_testing', 'employee_training'] } },
    { rule_id: 'gdpr.art35.dpia_required',     article_ref: 'GDPR Art. 35',  passed: false, score: 10, weighted_score:  0, is_blocker: true,  severity: 'critical', gap: 'High-risk activity "biometric_auth" does not have a completed DPIA.', remediation: 'Conduct a DPIA before biometric processing begins. Consult supervisory authority if residual risk is high.', evidence: { missing_dpia: ['biometric_auth'] } },
    { rule_id: 'gdpr.art37.dpo_appointment',   article_ref: 'GDPR Art. 37',  passed: false, score:  8, weighted_score:  0, is_blocker: false, severity: 'high',     gap: 'DPO contact details not published on website or privacy notice.', remediation: 'Publish DPO contact information in your privacy notice and register with your supervisory authority.', evidence: {} },
    { rule_id: 'gdpr.art44.international_transfers', article_ref: 'GDPR Art. 44-49', passed: true, score: 10, weighted_score: 10, is_blocker: true, severity: 'critical', gap: '', remediation: '', evidence: {} },
  ] as RuleResult[],
}

const HISTORY = [
  { date: '2025-04-29', score: 87, passed: false },
  { date: '2025-04-15', score: 83, passed: false },
  { date: '2025-04-01', score: 79, passed: false },
  { date: '2025-03-15', score: 72, passed: false },
  { date: '2025-03-01', score: 65, passed: false },
]

export default function AssessmentPage() {
  const [filter, setFilter] = useState('all')
  const [running, setRunning] = useState(false)

  const filtered = ASSESSMENT.results.filter(r => {
    if (filter === 'all')     return true
    if (filter === 'blocker') return !r.passed && r.is_blocker
    if (filter === 'fail')    return !r.passed && !r.is_blocker
    if (filter === 'pass')    return r.passed
    return true
  })

  async function runAssessment() {
    setRunning(true)
    await new Promise(r => setTimeout(r, 2000))
    setRunning(false)
    toast.success('Assessment complete — Score: 87.2% · 5 gaps found')
  }

  const scoreColor = getScoreColor(ASSESSMENT.compliance_pct)

  return (
    <>
      <Topbar
        title="Assessment"
        subtitle="GDPR Compliance"
        cta={{ label: running ? 'Running…' : '⚡ Run Assessment', onClick: runAssessment }}
      />
      <div className="flex-1 overflow-y-auto p-7">

        <div className="flex gap-5 mb-5">

          {/* Score card */}
          <div className="card w-72 flex-shrink-0">
            <div className="text-[14px] font-[650] mb-4" style={{ color: 'var(--navy)' }}>GDPR Score</div>
            <div className="flex flex-col items-center gap-4">
              <GaugeRing value={Math.round(ASSESSMENT.compliance_pct)} size={150} stroke={12} color={scoreColor} />
              <div className="grid grid-cols-3 gap-3 w-full">
                {[
                  { val: ASSESSMENT.blocker_count, label: 'BLOCKERS', color: 'var(--red)' },
                  { val: ASSESSMENT.failure_count, label: 'WARNINGS', color: 'var(--amber)' },
                  { val: ASSESSMENT.results.filter(r => r.passed).length, label: 'PASSING', color: 'var(--green)' },
                ].map(s => (
                  <div key={s.label} className="text-center p-2 rounded-[6px]" style={{ background: 'var(--silver)' }}>
                    <div className="text-xl font-bold" style={{ color: s.color }}>{s.val}</div>
                    <div className="text-[10px] font-semibold mt-0.5" style={{ color: s.color }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="w-full">
                {ASSESSMENT.certificate_eligible
                  ? <Badge variant="green" className="w-full justify-center py-1.5">✓ Certificate Eligible</Badge>
                  : <Badge variant="amber" className="w-full justify-center py-1.5">⚠ Not Certificate Eligible</Badge>
                }
              </div>
              <div className="w-full text-center text-[11px]" style={{ color: 'var(--slate-lt)' }}>
                {ASSESSMENT.total_score.toFixed(1)} / {ASSESSMENT.max_score.toFixed(1)} points · {ASSESSMENT.results.length} rules
              </div>
              <button className="btn btn-primary w-full justify-center" onClick={runAssessment} disabled={running}>
                {running
                  ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Running…</>
                  : <>⚡ Run Fresh Assessment</>
                }
              </button>
            </div>
          </div>

          {/* History + score breakdown */}
          <div className="flex-1 flex flex-col gap-5">

            {/* History mini chart */}
            <div className="card">
              <div className="text-[14px] font-[650] mb-3" style={{ color: 'var(--navy)' }}>Score History</div>
              <div className="flex items-end gap-3 h-16">
                {HISTORY.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[10px] font-semibold" style={{ color: getScoreColor(h.score) }}>{h.score}%</div>
                    <div className="w-full rounded-t-sm transition-all"
                      style={{ height: `${(h.score / 100) * 48}px`, background: i === 0 ? scoreColor : 'var(--border)' }} />
                    <div className="text-[9px]" style={{ color: 'var(--slate-lt)' }}>{h.date.slice(5)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category scores */}
            <div className="card flex-1">
              <div className="text-[14px] font-[650] mb-4" style={{ color: 'var(--navy)' }}>By Category</div>
              {[
                { label: 'Consent & Transparency', rules: ['art6', 'art7', 'art8', 'art13'], pct: 100 },
                { label: 'Data Subject Rights',    rules: ['art15', 'art17', 'art20', 'art21', 'art22'], pct: 100 },
                { label: 'Security & Privacy',     rules: ['art25', 'art32', 'art35'], pct: 42 },
                { label: 'Breach Management',      rules: ['art33', 'art34'], pct: 100 },
                { label: 'Governance & Transfers', rules: ['art28', 'art37', 'art44'], pct: 72 },
              ].map(cat => (
                <div key={cat.label} className="flex items-center gap-3 mb-3">
                  <div className="text-xs w-44 flex-shrink-0" style={{ color: 'var(--slate)' }}>{cat.label}</div>
                  <div className="flex-1">
                    <ProgressBar value={cat.pct}
                      color={cat.pct === 100 ? 'var(--green)' : cat.pct >= 70 ? 'var(--amber)' : 'var(--red)'} />
                  </div>
                  <div className="text-xs font-semibold w-9 text-right" style={{ color: 'var(--navy)' }}>{cat.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rules table */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>Rule Results — GDPR</div>
              <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                {ASSESSMENT.results.length} rules evaluated · {formatDateTime(ASSESSMENT.created_at)}
              </div>
            </div>
            <FilterPills
              options={[
                { label: 'All', value: 'all' },
                { label: `Blockers (${ASSESSMENT.blocker_count})`, value: 'blocker' },
                { label: `Failures (${ASSESSMENT.failure_count})`, value: 'fail' },
                { label: `Passing (${ASSESSMENT.results.filter(r=>r.passed).length})`, value: 'pass' },
              ]}
              active={filter}
              onChange={setFilter}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rule</th>
                  <th>Article</th>
                  <th>Weight</th>
                  <th>Score</th>
                  <th>Severity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.rule_id} style={!r.passed && r.is_blocker ? { background: 'var(--red-lt)' } : {}}>
                    <td>
                      <div className="font-semibold text-[13px]">
                        {r.rule_id.split('.').slice(-1)[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      {r.gap && <div className="text-[11px] mt-0.5 text-[var(--slate-lt)] line-clamp-1">{r.gap}</div>}
                    </td>
                    <td><span className="font-mono text-xs text-[var(--slate)]">{r.article_ref}</span></td>
                    <td><span className="chip">{r.score}</span></td>
                    <td>
                      <span className="font-semibold" style={{ color: r.passed ? 'var(--green)' : 'var(--red)' }}>
                        {r.passed ? r.weighted_score : 0} / {r.score}
                      </span>
                    </td>
                    <td>
                      <Badge variant={r.severity === 'critical' ? 'red' : r.severity === 'high' ? 'amber' : 'blue'}>
                        {r.severity.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      {r.passed
                        ? <Badge variant="green">✓ Passing</Badge>
                        : r.is_blocker
                          ? <Badge variant="red">● Blocker</Badge>
                          : <Badge variant="amber">● Failure</Badge>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Gap details for failures */}
          {(filter === 'all' || filter === 'blocker' || filter === 'fail') && (
            <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="text-[13px] font-[650] mb-3" style={{ color: 'var(--navy)' }}>Gap Details & Remediations</div>
              {filtered.filter(r => !r.passed).map(r => <GapItem key={r.rule_id} result={r} />)}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
