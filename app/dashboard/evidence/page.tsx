'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard, ProgressBar } from '@/components/ui'
import { toast } from 'sonner'
import { 
  FileCheck, Clock, AlertCircle, CheckCircle2,
  Upload, Download, RefreshCw, Shield, Database,
  Users, Globe, Lock, FileText
} from 'lucide-react'

/* ================= TYPES ================= */

type Status = 'on_track' | 'at_risk' | 'behind' | 'not_started'

type Framework = {
  framework: string
  controls: number
  collected: number
  automated: number
  status: Status
}

type EvidenceStatus = 'collected' | 'automated' | 'expired' | 'pending'

type Evidence = {
  id: number
  control: string
  framework: string
  type: string
  status: EvidenceStatus
  date: string
  source: string
}

/* ================= DATA ================= */

const EVIDENCE_METRICS = {
  total_controls: 142,
  evidence_collected: 118,
  automated: 85,
  manual_needed: 12,
  expired: 3,
  pending_review: 8,
  compliance_score: 83
}

const EVIDENCE_BY_FRAMEWORK: Framework[] = [
  { framework: 'GDPR', controls: 45, collected: 42, automated: 35, status: 'on_track' },
  { framework: 'DPDPT', controls: 38, collected: 30, automated: 25, status: 'at_risk' },
  { framework: 'SOC 2', controls: 35, collected: 28, automated: 20, status: 'behind' },
  { framework: 'HIPAA', controls: 24, collected: 18, automated: 5, status: 'not_started' },
]

const RECENT_EVIDENCE: Evidence[] = [
  { id: 1, control: 'Access Control Policy', framework: 'GDPR', type: 'Document', status: 'collected', date: '2025-12-01', source: 'Manual Upload' },
  { id: 2, control: 'Encryption Standards', framework: 'SOC 2', type: 'Configuration', status: 'automated', date: '2025-12-01', source: 'AWS Integration' },
  { id: 3, control: 'Data Processing Agreement', framework: 'GDPR', type: 'Contract', status: 'expired', date: '2025-11-15', source: 'Manual Upload' },
  { id: 4, control: 'Employee Training Records', framework: 'DPDPT', type: 'Certificate', status: 'pending', date: '2025-12-05', source: 'LMS Integration' },
  { id: 5, control: 'Incident Response Plan', framework: 'HIPAA', type: 'Document', status: 'collected', date: '2025-11-28', source: 'Manual Upload' },
]

/* ================= STATUS COLORS ================= */

const statusColors: Record<Status, {
  bg: string
  color: string
  border: string
}> = {
  on_track: {
    bg: 'rgba(16,185,129,.1)',
    color: 'var(--green)',
    border: 'rgba(16,185,129,.3)'
  },
  at_risk: {
    bg: 'rgba(245,158,11,.1)',
    color: 'var(--amber)',
    border: 'rgba(245,158,11,.3)'
  },
  behind: {
    bg: 'rgba(239,68,68,.1)',
    color: 'var(--red)',
    border: 'rgba(239,68,68,.3)'
  },
  not_started: {
    bg: 'rgba(148,163,184,.1)',
    color: 'var(--slate)',
    border: 'rgba(148,163,184,.3)'
  },
}

/* ================= COMPONENT ================= */

export default function EvidencePage() {
  const [activeFramework, setActiveFramework] = useState('all')

  const handleCollectEvidence = () => {
    toast.success('Evidence collection initiated')
  }

  return (
    <>
      <Topbar
        title="Evidence Collection"
        subtitle={`${EVIDENCE_METRICS.evidence_collected}/${EVIDENCE_METRICS.total_controls} controls documented`}
        cta={{
          label: '+ Collect Evidence',
          onClick: handleCollectEvidence,
          icon: <Upload size={14} />,
        }}
      />

      <div className="flex-1 overflow-y-auto p-7">

        {/* Evidence Stats */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <StatCard 
            label="Evidence Collected" 
            value={`${EVIDENCE_METRICS.evidence_collected}/${EVIDENCE_METRICS.total_controls}`}
            change={`${Math.round((EVIDENCE_METRICS.evidence_collected / EVIDENCE_METRICS.total_controls) * 100)}% complete`}
            changeDir="up"
            color="green" 
            icon="✓" 
          />
          <StatCard 
            label="Automated Collection" 
            value={`${EVIDENCE_METRICS.automated}%`}
            change="Via integrations"
            color="teal" 
            icon="🤖" 
          />
          <StatCard 
            label="Manual Evidence Needed" 
            value={EVIDENCE_METRICS.manual_needed} 
            change={`${EVIDENCE_METRICS.expired} expired`}
            color="amber" 
            icon="⚠" 
          />
          <StatCard 
            label="Pending Review" 
            value={EVIDENCE_METRICS.pending_review} 
            change="Awaiting validation"
            color="blue" 
            icon="⟳" 
          />
        </div>

        {/* Framework Progress */}
        <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: '2fr 1fr' }}>
          
          <div className="card">
            <div className="text-[14px] font-[650] mb-5" style={{ color: 'var(--navy)' }}>
              Evidence Collection by Framework
            </div>

            <div className="space-y-4">
              {EVIDENCE_BY_FRAMEWORK.map(fw => {
                const percentage = Math.round((fw.collected / fw.controls) * 100)
                const status = statusColors[fw.status]

                return (
                  <div key={fw.framework} className="p-4 rounded-[8px]" style={{ border: '1px solid var(--border)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>
                          {fw.framework}
                        </div>
                        <div className="text-[11px]" style={{ color: 'var(--slate-lt)' }}>
                          {fw.collected}/{fw.controls} controls · {fw.automated} automated
                        </div>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{
                          background: status.bg,
                          color: status.color,
                          border: `1px solid ${status.border}`
                        }}
                      >
                        {percentage}%
                      </span>
                    </div>

                    <ProgressBar value={percentage} color={status.color} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right side unchanged */}
        </div>

        {/* Table unchanged except typing works */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {RECENT_EVIDENCE.map(evidence => {
                  const statusColors: Record<EvidenceStatus, string> = {
                    collected: 'var(--green)',
                    automated: 'var(--teal)',
                    expired: 'var(--red)',
                    pending: 'var(--amber)'
                  }

                  return (
                    <tr key={evidence.id}>
                      <td>{evidence.control}</td>
                      <td>{evidence.framework}</td>
                      <td>{evidence.type}</td>
                      <td style={{ color: statusColors[evidence.status] }}>
                        {evidence.status.toUpperCase()}
                      </td>
                      <td>{evidence.date}</td>
                      <td>{evidence.source}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  )
}