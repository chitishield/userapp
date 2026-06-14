// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { Zap, AlertCircle, FileText, ShieldAlert, CheckCircle } from 'lucide-react'
// import { Topbar } from '@/components/layout/Topbar'
// import { StatCard, GaugeRing, ProgressBar, GapItem, Badge, InfoBox } from '@/components/ui'
// import { DSRModal, BreachModal, ConsentModal } from '@/components/modals'
// import { toast } from 'sonner'
// import { formatRelative } from '@/lib/utils'

// // ── Mock data (replace with API calls via useSWR / React Query) ────────────

// const METRICS = {
//   compliance_pct:  87,
//   active_gaps:     5,
//   blocker_count:   2,
//   failure_count:   3,
//   overdue_dsrs:    3,
//   active_breaches: 1,
//   total_consents:  12847,
//   certificate_status: 'issued' as const,
// }

// const BREAKDOWN = [
//   { label: 'Consent Management',    pct: 95, color: 'var(--green)' },
//   { label: 'Data Subject Rights',   pct: 78, color: 'var(--amber)' },
//   { label: 'Security Measures',     pct: 65, color: 'var(--red)' },
//   { label: 'Breach Management',     pct: 92, color: 'var(--green)' },
//   { label: 'International Transfers', pct: 100, color: 'var(--teal)' },
// ]

// const GAP_RESULTS = [
//   { rule_id: 'gdpr.art32.security_measures', article_ref: 'GDPR Art. 32', passed: false, score: 12, weighted_score: 0,
//     is_blocker: true, severity: 'critical' as const, gap: 'Security measures incomplete — regular security testing and employee training required.',
//     remediation: 'Implement annual pen tests and GDPR-specific staff training programme.', evidence: {} },
//   { rule_id: 'gdpr.art35.dpia_required', article_ref: 'GDPR Art. 35', passed: false, score: 10, weighted_score: 0,
//     is_blocker: true, severity: 'critical' as const, gap: 'High-risk activity "biometric_auth" does not have a completed DPIA.',
//     remediation: 'Conduct a DPIA before biometric processing begins. Consult SA if residual risk is high.', evidence: {} },
//   { rule_id: 'gdpr.art37.dpo_appointment', article_ref: 'GDPR Art. 37', passed: false, score: 8, weighted_score: 0,
//     is_blocker: false, severity: 'high' as const, gap: 'DPO contact details not published on website or privacy notice.',
//     remediation: 'Publish DPO contact information in your privacy notice and register with your supervisory authority.', evidence: {} },
// ]

// const RECENT_ACTIVITY = [
//   { id: '1', action: 'breach.report',    actor_id: 'Arjun Kumar', actor_role: 'owner', created_at: new Date(Date.now() - 2*3600*1000).toISOString(), resource_type: 'breach_record', resource_id: 'BRE-001', tenant_id: 't1', ip_address: '', user_agent: '', regulation: 'gdpr', detail: { title: 'DB incident' } },
//   { id: '2', action: 'dsr.complete',     actor_id: 'Priya Sharma', actor_role: 'admin', created_at: new Date(Date.now() - 5*3600*1000).toISOString(), resource_type: 'dsr_request', resource_id: 'DSR-1024', tenant_id: 't1', ip_address: '', user_agent: '', regulation: 'gdpr', detail: {} },
//   { id: '3', action: 'assessment.run',   actor_id: 'System', actor_role: 'system', created_at: new Date(Date.now() - 2*3600*1000).toISOString(), resource_type: 'assessment', resource_id: 'a001', tenant_id: 't1', ip_address: '', user_agent: '', regulation: 'gdpr', detail: { score: '87%' } },
//   { id: '4', action: 'consent.capture',  actor_id: 'System', actor_role: 'system', created_at: new Date(Date.now() - 24*3600*1000).toISOString(), resource_type: 'consent_record', resource_id: 'batch', tenant_id: 't1', ip_address: '', user_agent: '', regulation: 'gdpr', detail: { count: '142' } },
// ]

// const QUICK_ACTIONS = [
//   { icon: '📋', label: 'Submit DSR Request',   desc: 'Log a data subject request',      bg: 'var(--blue-lt)',   modal: 'dsr' },
//   { icon: '🚨', label: 'Report Data Breach',   desc: 'Start 72hr SLA clock',            bg: 'var(--red-lt)',    modal: 'breach' },
//   { icon: '✅', label: 'Capture Consent',       desc: 'Record new consent event',        bg: 'var(--green-lt)',  modal: 'consent' },
//   { icon: '⚡', label: 'Run Fresh Assessment',  desc: 'Get latest compliance score',     bg: 'var(--teal-lt)',   modal: 'assessment' },
// ]

// // ── Component ──────────────────────────────────────────────────────────────

// export default function DashboardPage() {
//   const [modal, setModal] = useState<string | null>(null)
//   const [running, setRunning] = useState(false)

//   async function runAssessment() {
//     setRunning(true)
//     await new Promise(r => setTimeout(r, 1800))
//     setRunning(false)
//     toast.success('Assessment complete — Score: 87% · 5 gaps found')
//   }

//   return (
//     <>
//       <Topbar
//         title="Dashboard"
//         subtitle="Overview"
//         cta={{
//           label: running ? 'Running…' : '⚡ Run Assessment',
//           onClick: runAssessment,
//           icon: running ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : undefined,
//         }}
//       />

//       <div className="flex-1 overflow-y-auto p-7">

//         {/* Active breach alert banner */}
//         {METRICS.active_breaches > 0 && (
//           <div className="mb-5 p-3 rounded-[8px] flex items-center gap-3"
//             style={{ background: 'var(--red-lt)', border: '1px solid var(--red-bd)' }}>
//             <AlertCircle size={16} style={{ color: 'var(--red)', flexShrink: 0 }} />
//             <span className="text-[13px] font-semibold flex-1" style={{ color: 'var(--red)' }}>
//               Active breach — 54h 22m remaining to notify supervisory authority
//             </span>
//             <Link href="/dashboard/breaches">
//               <button className="btn btn-danger btn-sm">View Breach →</button>
//             </Link>
//           </div>
//         )}

//         {/* Stat cards */}
//         <div className="grid grid-cols-4 gap-4 mb-5">
//           <StatCard label="Compliance Score" value={`${METRICS.compliance_pct}%`} change="↑ 4% from last run" changeDir="up" color="teal" icon="◈" />
//           <StatCard label="Active Gaps" value={METRICS.active_gaps} change={`${METRICS.blocker_count} blockers · ${METRICS.failure_count} warnings`} color="red" icon="⚠" />
//           <StatCard label="Overdue DSRs" value={METRICS.overdue_dsrs} change="SLA breached — action needed" changeDir="down" color="amber" icon="⟳" />
//           <StatCard label="Certificate" value="ACTIVE" change="Expires Dec 2025" changeDir="up" color="green" icon="❋" />
//         </div>

//         {/* Main grid — 2/3 + 1/3 */}
//         <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: '2fr 1fr' }}>

//           {/* Compliance overview */}
//           <div className="card">
//             <div className="flex items-center justify-between mb-5">
//               <div>
//                 <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>Compliance Overview</div>
//                 <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>GDPR · Last assessed 2 hours ago</div>
//               </div>
//               <Link href="/dashboard/assessment">
//                 <button className="btn btn-secondary btn-sm">View Details →</button>
//               </Link>
//             </div>
//             <div className="flex items-center gap-6">
//               <GaugeRing value={METRICS.compliance_pct} size={130} />
//               <div className="flex-1">
//                 {BREAKDOWN.map(b => (
//                   <div key={b.label} className="flex items-center gap-3 mb-2.5">
//                     <div className="text-xs w-40 flex-shrink-0" style={{ color: 'var(--slate)' }}>{b.label}</div>
//                     <div className="flex-1"><ProgressBar value={b.pct} color={b.color} /></div>
//                     <div className="text-xs font-semibold w-9 text-right" style={{ color: 'var(--navy)' }}>{b.pct}%</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Quick actions */}
//           <div className="card">
//             <div className="text-[14px] font-[650] mb-4" style={{ color: 'var(--navy)' }}>Quick Actions</div>
//             {QUICK_ACTIONS.map(a => (
//               <button key={a.label}
//                 onClick={() => a.modal === 'assessment' ? runAssessment() : setModal(a.modal)}
//                 className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[6px] border transition-all text-left mb-2 cursor-pointer hover:border-[var(--teal)] hover:bg-[var(--teal-lt)]"
//                 style={{ background: 'white', borderColor: 'var(--border)' }}>
//                 <div className="w-8 h-8 rounded-[7px] flex items-center justify-center text-base flex-shrink-0"
//                   style={{ background: a.bg }}>
//                   {a.icon}
//                 </div>
//                 <div className="flex-1">
//                   <div className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>{a.label}</div>
//                   <div className="text-[11px]" style={{ color: 'var(--slate-lt)' }}>{a.desc}</div>
//                 </div>
//                 <span style={{ color: 'var(--slate-lt)' }}>›</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Bottom grid — 1/2 + 1/2 */}
//         <div className="grid grid-cols-2 gap-5">

//           {/* Critical gaps */}
//           <div className="card">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>Critical Gaps</div>
//                 <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>Requires immediate attention</div>
//               </div>
//               <Link href="/dashboard/assessment">
//                 <button className="btn btn-ghost btn-sm" style={{ color: 'var(--teal)' }}>View all →</button>
//               </Link>
//             </div>
//             {GAP_RESULTS.map(r => <GapItem key={r.rule_id} result={r} />)}
//           </div>

//           {/* Recent activity */}
//           <div className="card">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>Recent Activity</div>
//                 <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>Audit trail — last 24 hours</div>
//               </div>
//               <Link href="/dashboard/audit">
//                 <button className="btn btn-ghost btn-sm" style={{ color: 'var(--teal)' }}>Full log →</button>
//               </Link>
//             </div>
//             <div className="relative">
//               <div className="absolute left-[15px] top-0 bottom-0 w-px" style={{ background: 'var(--border)' }} />
//               {RECENT_ACTIVITY.map((log, i) => {
//                 const styles: Record<string, { bg: string; color: string; emoji: string }> = {
//                   'breach.report':   { bg: 'var(--red-lt)',   color: 'var(--red)',   emoji: '⚠' },
//                   'dsr.complete':    { bg: 'var(--green-lt)', color: 'var(--green)', emoji: '✓' },
//                   'assessment.run':  { bg: 'var(--teal-lt)',  color: 'var(--teal)',  emoji: '◈' },
//                   'consent.capture': { bg: 'var(--blue-lt)',  color: 'var(--blue)',  emoji: '✦' },
//                 }
//                 const s = styles[log.action] || { bg: 'var(--silver)', color: 'var(--slate)', emoji: '·' }
//                 return (
//                   <div key={log.id} className="flex gap-4 pb-4 relative">
//                     <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs z-10 flex-shrink-0"
//                       style={{ background: s.bg, color: s.color, border: '2px solid white', boxShadow: '0 0 0 2px var(--border)' }}>
//                       {s.emoji}
//                     </div>
//                     <div className="flex-1 pt-1">
//                       <div className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>
//                         {log.action.replace('.', ' — ')}
//                       </div>
//                       <div className="text-[11px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
//                         {formatRelative(log.created_at)} · {log.actor_id}
//                       </div>
//                       {Object.keys(log.detail).length > 0 && (
//                         <div className="text-xs mt-1" style={{ color: 'var(--slate)' }}>
//                           {Object.entries(log.detail).map(([k, v]) => `${k}: ${v}`).join(' · ')}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       <DSRModal    open={modal === 'dsr'}     onClose={() => setModal(null)} />
//       <BreachModal open={modal === 'breach'}  onClose={() => setModal(null)} />
//       <ConsentModal open={modal === 'consent'} onClose={() => setModal(null)} />
//     </>
//   )
// }


'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard, GaugeRing, ProgressBar, GapItem } from '@/components/ui'
import { DSRModal, BreachModal, ConsentModal } from '@/components/modals'
import { toast } from 'sonner'
import { 
  AlertCircle, Globe, Shield, Stethoscope, Building2,
  ArrowUpRight, CheckCircle2, AlertTriangle, Clock 
} from 'lucide-react'
import { formatRelative } from '@/lib/utils'

// Multi-regulation compliance data
const REGULATION_METRICS: Record<string, {
  compliance_pct: number
  active_gaps: number
  overdue_dsrs: number
  certificate: string
  certificate_expiry: string | null
  color: string
  icon: any
  flag: string
}> = {
  gdpr: {
    compliance_pct: 87,
    active_gaps: 5,
    overdue_dsrs: 3,
    certificate: 'ACTIVE',
    certificate_expiry: 'Dec 2025',
    color: 'var(--blue)',
    icon: Globe,
    flag: '🇪🇺'
  },
  dpdpt: {
    compliance_pct: 72,
    active_gaps: 12,
    overdue_dsrs: 1,
    certificate: 'IN PROGRESS',
    certificate_expiry: null,
    color: 'var(--amber)',
    icon: Shield,
    flag: '🇮🇳'
  },
  soc2: {
    compliance_pct: 45,
    active_gaps: 28,
    overdue_dsrs: 0,
    certificate: 'NOT STARTED',
    certificate_expiry: null,
    color: 'var(--purple)',
    icon: Building2,
    flag: '🇺🇸'
  },
  hipaa: {
    compliance_pct: 0,
    active_gaps: 42,
    overdue_dsrs: 0,
    certificate: 'PLANNED',
    certificate_expiry: null,
    color: 'var(--red)',
    icon: Stethoscope,
    flag: '🇺🇸'
  }
}

const BREAKDOWN_BY_REGULATION: Record<string, Array<{ label: string; pct: number; color: string }>> = {
  gdpr: [
    { label: 'Consent Management', pct: 95, color: 'var(--green)' },
    { label: 'Data Subject Rights', pct: 78, color: 'var(--amber)' },
    { label: 'Security Measures', pct: 65, color: 'var(--red)' },
    { label: 'Breach Management', pct: 92, color: 'var(--green)' },
    { label: 'International Transfers', pct: 100, color: 'var(--teal)' },
  ],
  dpdpt: [
    { label: 'Consent Management', pct: 82, color: 'var(--amber)' },
    { label: 'Data Fiduciary Obligations', pct: 60, color: 'var(--red)' },
    { label: 'Cross-Border Transfer', pct: 45, color: 'var(--red)' },
    { label: "Children's Data", pct: 70, color: 'var(--amber)' },
    { label: 'Grievance Redressal', pct: 85, color: 'var(--green)' },
  ],
  soc2: [
    { label: 'Security Controls', pct: 55, color: 'var(--red)' },
    { label: 'Availability', pct: 70, color: 'var(--amber)' },
    { label: 'Processing Integrity', pct: 40, color: 'var(--red)' },
    { label: 'Confidentiality', pct: 50, color: 'var(--red)' },
    { label: 'Privacy Controls', pct: 35, color: 'var(--red)' },
  ],
  hipaa: [
    { label: 'Privacy Rule', pct: 0, color: 'var(--red)' },
    { label: 'Security Rule', pct: 0, color: 'var(--red)' },
    { label: 'Breach Notification', pct: 0, color: 'var(--red)' },
    { label: 'Enforcement Rule', pct: 0, color: 'var(--red)' },
    { label: 'Omnibus Rule', pct: 0, color: 'var(--red)' },
  ],
}

const GAP_RESULTS: Record<string, Array<{
  rule_id: string
  article_ref: string
  passed: boolean
  score: number
  weighted_score: number
  is_blocker: boolean
  severity: 'critical' | 'high'
  gap: string
  remediation: string
  evidence: {}
}>> = {
  gdpr: [
    { 
      rule_id: 'gdpr.art32.security_measures', 
      article_ref: 'GDPR Art. 32', 
      passed: false, 
      score: 12, 
      weighted_score: 0,
      is_blocker: true, 
      severity: 'critical' as const, 
      gap: 'Security measures incomplete — regular security testing and employee training required.',
      remediation: 'Implement annual pen tests and GDPR-specific staff training programme.', 
      evidence: {} 
    },
    { 
      rule_id: 'gdpr.art35.dpia_required', 
      article_ref: 'GDPR Art. 35', 
      passed: false, 
      score: 10, 
      weighted_score: 0,
      is_blocker: true, 
      severity: 'critical' as const, 
      gap: 'High-risk activity "biometric_auth" does not have a completed DPIA.',
      remediation: 'Conduct a DPIA before biometric processing begins. Consult SA if residual risk is high.', 
      evidence: {} 
    },
    { 
      rule_id: 'gdpr.art37.dpo_appointment', 
      article_ref: 'GDPR Art. 37', 
      passed: false, 
      score: 8, 
      weighted_score: 0,
      is_blocker: false, 
      severity: 'high' as const, 
      gap: 'DPO contact details not published on website or privacy notice.',
      remediation: 'Publish DPO contact information in your privacy notice and register with your supervisory authority.', 
      evidence: {} 
    },
  ],
  dpdpt: [
    { 
      rule_id: 'dpdpt.s4.consent_mechanism', 
      article_ref: 'DPDPT Sec. 4', 
      passed: false, 
      score: 8, 
      weighted_score: 0,
      is_blocker: true, 
      severity: 'critical' as const, 
      gap: 'Consent mechanism does not meet DPDPT standards for informed consent.',
      remediation: 'Update consent collection to include purpose specification and notice requirements.', 
      evidence: {} 
    },
    { 
      rule_id: 'dpdpt.s8.data_fiduciary', 
      article_ref: 'DPDPT Sec. 8', 
      passed: false, 
      score: 6, 
      weighted_score: 0,
      is_blocker: false, 
      severity: 'high' as const, 
      gap: 'Data fiduciary obligations not fully documented.',
      remediation: 'Create comprehensive data fiduciary compliance documentation.', 
      evidence: {} 
    },
  ],
  soc2: [
    { 
      rule_id: 'soc2.cc5.security', 
      article_ref: 'SOC 2 CC5', 
      passed: false, 
      score: 4, 
      weighted_score: 0,
      is_blocker: true, 
      severity: 'critical' as const, 
      gap: 'Security control environment not established.',
      remediation: 'Implement SOC 2 control framework starting with CC5 security controls.', 
      evidence: {} 
    },
  ],
  hipaa: [
    { 
      rule_id: 'hipaa.164.308', 
      article_ref: 'HIPAA §164.308', 
      passed: false, 
      score: 0, 
      weighted_score: 0,
      is_blocker: true, 
      severity: 'critical' as const, 
      gap: 'Administrative safeguards not implemented.',
      remediation: 'Begin HIPAA compliance program with administrative safeguards.', 
      evidence: {} 
    },
  ],
}

const RECENT_ACTIVITY = [
  { 
    id: '1', 
    type: 'breach', 
    regulation: 'gdpr',
    title: 'Database breach reported',
    time: '2 hours ago',
    severity: 'critical' as const,
    actor: 'Arjun Kumar'
  },
  { 
    id: '2', 
    type: 'certificate',
    regulation: 'dpdpt',
    title: 'DPDPT assessment completed',
    time: '5 hours ago',
    severity: 'info' as const,
    actor: 'System'
  },
  { 
    id: '3', 
    type: 'dsr',
    regulation: 'gdpr',
    title: 'DSR-1024 marked as completed',
    time: '8 hours ago',
    severity: 'success' as const,
    actor: 'Priya Sharma'
  },
  { 
    id: '4', 
    type: 'assessment',
    regulation: 'soc2',
    title: 'SOC 2 readiness check initiated',
    time: '1 day ago',
    severity: 'info' as const,
    actor: 'System'
  },
]

const QUICK_ACTIONS = [
  { icon: '📋', label: 'Submit DSR Request',   desc: 'Log a data subject request',      bg: 'var(--blue-lt)',   modal: 'dsr' as const },
  { icon: '🚨', label: 'Report Data Breach',   desc: 'Start 72hr SLA clock',            bg: 'var(--red-lt)',    modal: 'breach' as const },
  { icon: '✅', label: 'Capture Consent',       desc: 'Record new consent event',        bg: 'var(--green-lt)',  modal: 'consent' as const },
  { icon: '⚡', label: 'Run Fresh Assessment',  desc: 'Get latest compliance score',     bg: 'var(--teal-lt)',   modal: 'assessment' as const },
]

export default function DashboardPage() {
  const [activeRegulation, setActiveRegulation] = useState<'gdpr' | 'dpdpt' | 'soc2' | 'hipaa'>('gdpr')
  const [modal, setModal] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  async function runAssessment() {
    setRunning(true)
    await new Promise(r => setTimeout(r, 1800))
    setRunning(false)
    toast.success(`Assessment complete — Score: ${REGULATION_METRICS[activeRegulation].compliance_pct}% · ${REGULATION_METRICS[activeRegulation].active_gaps} gaps found`)
  }

  const currentMetrics = REGULATION_METRICS[activeRegulation]
  const currentBreakdown = BREAKDOWN_BY_REGULATION[activeRegulation] || []
  const currentGaps = GAP_RESULTS[activeRegulation] || []
  const Icon = currentMetrics.icon

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle="Multi-Regulation Overview"
        cta={{
          label: running ? 'Running…' : '⚡ Run Assessment',
          onClick: runAssessment,
          icon: running ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : undefined,
        }}
      />

      <div className="flex-1 overflow-y-auto p-7">
        
        {/* Regulation Tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {Object.entries(REGULATION_METRICS).map(([key, reg]) => {
            const RegulationIcon = reg.icon
            return (
              <button
                key={key}
                onClick={() => setActiveRegulation(key as any)}
                className="flex items-center gap-2 px-4 py-2 rounded-[8px] text-[13px] font-semibold transition-all"
                style={{
                  background: activeRegulation === key ? 'white' : 'var(--silver)',
                  color: activeRegulation === key ? 'var(--navy)' : 'var(--slate)',
                  border: activeRegulation === key 
                    ? `2px solid ${reg.color}` 
                    : '2px solid transparent',
                  boxShadow: activeRegulation === key ? '0 2px 8px rgba(0,0,0,.08)' : 'none'
                }}>
                <span>{reg.flag}</span>
                {key.toUpperCase()}
                {reg.compliance_pct > 0 && (
                  <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{ 
                      background: reg.compliance_pct > 80 ? 'var(--green-lt)' : 
                                  reg.compliance_pct > 60 ? 'var(--amber-lt)' : 
                                  'var(--red-lt)',
                      color: reg.compliance_pct > 80 ? 'var(--green)' : 
                             reg.compliance_pct > 60 ? 'var(--amber)' : 
                             'var(--red)'
                    }}>
                    {reg.compliance_pct}%
                  </span>
                )}
                {reg.compliance_pct === 0 && (
                  <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{ 
                      background: 'var(--silver)',
                      color: 'var(--slate)'
                    }}>
                    New
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Active breach alert - multi regulation aware */}
        {activeRegulation === 'gdpr' && (
          <div className="mb-5 p-3 rounded-[8px] flex items-center gap-3"
            style={{ background: 'var(--red-lt)', border: '1px solid var(--red-bd)' }}>
            <AlertCircle size={16} style={{ color: 'var(--red)', flexShrink: 0 }} />
            <span className="text-[13px] font-semibold flex-1" style={{ color: 'var(--red)' }}>
              🇪🇺 GDPR Active breach — 54h 22m remaining to notify supervisory authority
            </span>
            <Link href="/dashboard/breaches">
              <button className="btn btn-danger btn-sm">View Breach →</button>
            </Link>
          </div>
        )}

        {/* Stat cards with regulation context */}
<div className="grid grid-cols-4 gap-4 mb-5">
  <StatCard 
    label="Compliance Score" 
    value={`${currentMetrics.compliance_pct}%`} 
    change={`${currentMetrics.flag} ${activeRegulation.toUpperCase()}`}
    changeDir={currentMetrics.compliance_pct > 0 ? "up" : "neutral"} 
    color="teal"
    icon="◈"
  />
  <StatCard 
    label="Active Gaps" 
    value={currentMetrics.active_gaps} 
    change={`Across all ${activeRegulation.toUpperCase()} controls`}
    color="red" 
    icon="⚠" 
  />
  <StatCard 
    label="Overdue DSRs" 
    value={currentMetrics.overdue_dsrs} 
    change={currentMetrics.overdue_dsrs > 0 ? 'SLA breached — action needed' : 'All within SLA'}
    changeDir={currentMetrics.overdue_dsrs > 0 ? 'down' : 'up'} 
    color={currentMetrics.overdue_dsrs > 0 ? 'red' : 'green'} 
    icon="⟳" 
  />
  <StatCard 
    label="Certificate" 
    value={currentMetrics.certificate} 
    change={currentMetrics.certificate_expiry || 'Start certification process'}
    changeDir={currentMetrics.certificate === 'ACTIVE' ? 'up' : 'neutral'} 
    color={currentMetrics.certificate === 'ACTIVE' ? 'green' : 'amber'} 
    icon="❋" 
  />
</div>
        {/* Main grid — 2/3 + 1/3 */}
        <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: '2fr 1fr' }}>

          {/* Compliance Overview */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[14px] font-[650] flex items-center gap-2" style={{ color: 'var(--navy)' }}>
                  <span>{currentMetrics.flag}</span>
                  {activeRegulation.toUpperCase()} Compliance Overview
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                  Last assessed 2 hours ago
                </div>
              </div>
              <Link href="/dashboard/assessment">
                <button className="btn btn-secondary btn-sm">View Details →</button>
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <GaugeRing value={currentMetrics.compliance_pct} size={130} />
              <div className="flex-1">
                {currentBreakdown.length > 0 ? (
                  currentBreakdown.map(b => (
                    <div key={b.label} className="flex items-center gap-3 mb-2.5">
                      <div className="text-xs w-40 flex-shrink-0" style={{ color: 'var(--slate)' }}>{b.label}</div>
                      <div className="flex-1"><ProgressBar value={b.pct} color={b.color} /></div>
                      <div className="text-xs font-semibold w-9 text-right" style={{ color: 'var(--navy)' }}>{b.pct}%</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-[13px] mb-2" style={{ color: 'var(--slate)' }}>
                      No assessment data available
                    </div>
                    <button 
                      onClick={runAssessment}
                      className="btn btn-primary btn-sm">
                      Start Assessment →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick actions & Cross-Regulation Comparison */}
          <div className="space-y-5">
            {/* Quick Actions */}
            <div className="card">
              <div className="text-[14px] font-[650] mb-4" style={{ color: 'var(--navy)' }}>Quick Actions</div>
              {QUICK_ACTIONS.map(a => (
                <button key={a.label}
                  onClick={() => a.modal === 'assessment' ? runAssessment() : setModal(a.modal)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[6px] border transition-all text-left mb-2 cursor-pointer hover:border-[var(--teal)] hover:bg-[var(--teal-lt)]"
                  style={{ background: 'white', borderColor: 'var(--border)' }}>
                  <div className="w-8 h-8 rounded-[7px] flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: a.bg }}>
                    {a.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>{a.label}</div>
                    <div className="text-[11px]" style={{ color: 'var(--slate-lt)' }}>{a.desc}</div>
                  </div>
                  <span style={{ color: 'var(--slate-lt)' }}>›</span>
                </button>
              ))}
            </div>

            {/* Cross-Regulation Comparison */}
            <div className="card">
              <div className="text-[14px] font-[650] mb-4" style={{ color: 'var(--navy)' }}>
                Regulation Coverage
              </div>
              <div className="space-y-3">
                {Object.entries(REGULATION_METRICS).map(([key, reg]) => {
                  const RegIcon = reg.icon
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <RegIcon size={14} style={{ color: reg.color }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[12px] font-semibold" style={{ color: 'var(--navy)' }}>
                            {reg.flag} {key.toUpperCase()}
                          </span>
                          <span className="text-[11px] font-medium" style={{ color: reg.color }}>
                            {reg.compliance_pct}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--silver)' }}>
                          <div 
                            className="h-full rounded-full transition-all" 
                            style={{ 
                              width: `${Math.max(reg.compliance_pct, 2)}%`,
                              background: reg.color 
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Certification Progress */}
              <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="text-[12px] font-semibold mb-3" style={{ color: 'var(--navy)' }}>
                  Certification Status
                </div>
                <div className="space-y-2">
                  {Object.entries(REGULATION_METRICS).map(([key, reg]) => (
                    <div key={key} className="flex items-center gap-2 text-[11px]">
                      {reg.certificate === 'ACTIVE' ? (
                        <CheckCircle2 size={12} style={{ color: 'var(--green)' }} />
                      ) : reg.certificate === 'IN PROGRESS' ? (
                        <Clock size={12} style={{ color: 'var(--amber)' }} />
                      ) : (
                        <AlertTriangle size={12} style={{ color: 'var(--slate-lt)' }} />
                      )}
                      <span style={{ color: 'var(--slate)' }}>
                        {reg.flag} {key.toUpperCase()}: {reg.certificate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom grid — 1/2 + 1/2 */}
        <div className="grid grid-cols-2 gap-5">

          {/* Critical gaps */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>
                  Critical Gaps — {currentMetrics.flag} {activeRegulation.toUpperCase()}
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                  {currentGaps.length > 0 ? 'Requires immediate attention' : 'No critical gaps found'}
                </div>
              </div>
              <Link href="/dashboard/assessment">
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--teal)' }}>View all →</button>
              </Link>
            </div>
            {currentGaps.length > 0 ? (
              currentGaps.map(r => <GapItem key={r.rule_id} result={r} />)
            ) : (
              <div className="text-center py-6">
                <CheckCircle2 size={32} className="mx-auto mb-2" style={{ color: 'var(--green)' }} />
                <div className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>
                  All clear!
                </div>
                <div className="text-[11px]" style={{ color: 'var(--slate-lt)' }}>
                  Run assessment to check for new gaps
                </div>
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>Recent Activity</div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>All compliance events — last 24 hours</div>
              </div>
              <Link href="/dashboard/audit">
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--teal)' }}>Full log →</button>
              </Link>
            </div>
            <div className="space-y-2">
              {RECENT_ACTIVITY.map(activity => {
                const reg = REGULATION_METRICS[activity.regulation]
                const severityColors = {
                  critical: { bg: 'var(--red-lt)', color: 'var(--red)', border: 'var(--red-bd)', emoji: '⚠' },
                  info: { bg: 'var(--blue-lt)', color: 'var(--blue)', border: 'var(--blue-bd)', emoji: 'ℹ' },
                  success: { bg: 'var(--green-lt)', color: 'var(--green)', border: 'var(--green-bd)', emoji: '✓' },
                }
                const severity = severityColors[activity.severity]
                
                return (
                  <div key={activity.id} 
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] transition-all hover:bg-[var(--silver)]"
                    style={{ border: '1px solid var(--border)' }}>
                    <span className="text-sm">{reg?.flag || '🏳'}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold"
                      style={{ 
                        background: severity.bg, 
                        color: severity.color,
                        border: `1px solid ${severity.border}`
                      }}>
                      {activity.type.toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <div className="text-[13px]" style={{ color: 'var(--navy)' }}>
                        {activity.title}
                      </div>
                      <div className="text-[10px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                        {activity.time} · {activity.actor}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DSRModal    open={modal === 'dsr'}     onClose={() => setModal(null)} />
      <BreachModal open={modal === 'breach'}  onClose={() => setModal(null)} />
      <ConsentModal open={modal === 'consent'} onClose={() => setModal(null)} />
    </>
  )
}