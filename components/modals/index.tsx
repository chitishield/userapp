'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InfoBox } from '@/components/ui'
import { toast } from 'sonner'

// ── Base Modal ────────────────────────────────────────────────────────────

interface ModalProps {
  open:     boolean
  onClose:  () => void
  title:    string
  children: React.ReactNode
  footer?:  React.ReactNode
  width?:   string
}

export function Modal({ open, onClose, title, children, footer, width = '480px' }: ModalProps) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(13,27,42,.55)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div
        className="bg-white rounded-xl overflow-hidden"
        style={{ width, maxWidth: '95vw', boxShadow: '0 24px 64px rgba(0,0,0,.2)', animation: 'slideUp .2s cubic-bezier(.34,1.56,.64,1)' }}>
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-[15px] font-[650]" style={{ color: 'var(--navy)' }}>{title}</h2>
          <button onClick={onClose} className="p-1 rounded transition-all hover:bg-[var(--silver)]" style={{ color: 'var(--slate-lt)' }}>
            <X size={16} />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 flex gap-2 justify-end" style={{ borderTop: '1px solid var(--border)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Form helpers ──────────────────────────────────────────────────────────

function FormGroup({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="form-label">{label}</label>
      {children}
      {hint && <p className="form-hint">{hint}</p>}
    </div>
  )
}

// ── Submit DSR Modal ──────────────────────────────────────────────────────

interface DSRModalProps { open: boolean; onClose: () => void; onSubmit?: (data: unknown) => void }

export function DSRModal({ open, onClose, onSubmit }: DSRModalProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    type: 'access', data_subject_email: '', data_subject_id: '', description: '',
  })

  async function handleSubmit() {
    if (!form.data_subject_email) { toast.error('Email is required'); return }
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 800))
      toast.success('DSR submitted — 30-day SLA clock started')
      onSubmit?.(form)
      onClose()
      setForm({ type: 'access', data_subject_email: '', data_subject_id: '', description: '' })
    } finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Submit DSR Request"
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting…' : 'Submit Request'}
        </button>
      </>}>
      <FormGroup label="Request Type *">
        <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
          <option value="access">Access — Art. 15 (copy of personal data)</option>
          <option value="erasure">Erasure / RTBF — Art. 17</option>
          <option value="portability">Portability — Art. 20 (machine-readable export)</option>
          <option value="correction">Correction — Art. 16</option>
          <option value="restriction">Restriction — Art. 18</option>
          <option value="objection">Objection — Art. 21</option>
        </select>
      </FormGroup>
      <FormGroup label="Data Subject Email *">
        <input className="form-input" type="email" placeholder="user@example.com"
          value={form.data_subject_email} onChange={e => setForm(f => ({ ...f, data_subject_email: e.target.value }))} />
      </FormGroup>
      <FormGroup label="Data Subject ID" hint="Leave blank to auto-derive from email hash.">
        <input className="form-input" placeholder="Internal ID or hashed identifier"
          value={form.data_subject_id} onChange={e => setForm(f => ({ ...f, data_subject_id: e.target.value }))} />
      </FormGroup>
      <FormGroup label="Description">
        <textarea className="form-textarea" placeholder="Describe the request…"
          value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      </FormGroup>
      <InfoBox type="info">
        ⏱ 30-day SLA clock starts automatically on submission (GDPR Art. 12)
      </InfoBox>
    </Modal>
  )
}

// ── Report Breach Modal ───────────────────────────────────────────────────

interface BreachModalProps { open: boolean; onClose: () => void; onSubmit?: (data: unknown) => void }

export function BreachModal({ open, onClose, onSubmit }: BreachModalProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', risk_level: 'high',
    affected_count: '', data_categories: '', contact_email: '',
  })

  async function handleSubmit() {
    if (!form.title || !form.description) { toast.error('Title and description are required'); return }
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 800))
      toast.error('Breach reported — 72hr SLA clock started', { style: { borderLeft: '3px solid var(--red)' } })
      onSubmit?.(form)
      onClose()
    } finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="🚨 Report Data Breach"
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-danger" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Reporting…' : 'Report Breach'}
        </button>
      </>}>
      <InfoBox type="error">
        <strong>72-hour SLA clock starts immediately.</strong> GDPR Art.33 requires supervisory authority notification within 72 hours of becoming aware of a breach.
      </InfoBox>
      <div className="mt-4">
        <FormGroup label="Breach Title *">
          <input className="form-input" placeholder="e.g. Database unauthorised access"
            value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        </FormGroup>
        <FormGroup label="Risk Level *">
          <select className="form-select" value={form.risk_level} onChange={e => setForm(f => ({ ...f, risk_level: e.target.value }))}>
            <option value="high">High — notify data subjects required (Art. 34)</option>
            <option value="medium">Medium — authority notification only</option>
            <option value="low">Low — internal record only</option>
          </select>
        </FormGroup>
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Records Affected (approx.)">
            <input className="form-input" type="number" placeholder="0"
              value={form.affected_count} onChange={e => setForm(f => ({ ...f, affected_count: e.target.value }))} />
          </FormGroup>
          <FormGroup label="DPO Contact Email *">
            <input className="form-input" type="email" placeholder="dpo@company.com"
              value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} />
          </FormGroup>
        </div>
        <FormGroup label="Data Categories Affected">
          <input className="form-input" placeholder="email, phone, address, health…"
            value={form.data_categories} onChange={e => setForm(f => ({ ...f, data_categories: e.target.value }))} />
        </FormGroup>
        <FormGroup label="Description *">
          <textarea className="form-textarea" placeholder="Describe what happened, when, and what data was involved…"
            value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </FormGroup>
      </div>
    </Modal>
  )
}

// ── Capture Consent Modal ─────────────────────────────────────────────────

interface ConsentModalProps { open: boolean; onClose: () => void; onSubmit?: (data: unknown) => void }

export function ConsentModal({ open, onClose, onSubmit }: ConsentModalProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    data_subject_id: '', purpose: 'newsletter', lawful_basis: 'consent',
    consent_text_version: '1.0', ip_address: '',
  })

  async function handleSubmit() {
    if (!form.data_subject_id) { toast.error('Data Subject ID is required'); return }
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 600))
      toast.success('Consent captured and recorded')
      onSubmit?.(form)
      onClose()
    } finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Capture Consent"
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Capturing…' : 'Capture Consent'}
        </button>
      </>}>
      <FormGroup label="Data Subject ID *" hint="Hashed email or internal user identifier.">
        <input className="form-input" placeholder="e.g. a3b8f2c91d or user@example.com"
          value={form.data_subject_id} onChange={e => setForm(f => ({ ...f, data_subject_id: e.target.value }))} />
      </FormGroup>
      <div className="grid grid-cols-2 gap-3">
        <FormGroup label="Purpose *">
          <select className="form-select" value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}>
            <option value="newsletter">newsletter</option>
            <option value="analytics">analytics</option>
            <option value="marketing">marketing</option>
            <option value="profiling">profiling</option>
            <option value="order_processing">order_processing</option>
          </select>
        </FormGroup>
        <FormGroup label="Lawful Basis *">
          <select className="form-select" value={form.lawful_basis} onChange={e => setForm(f => ({ ...f, lawful_basis: e.target.value }))}>
            <option value="consent">consent — Art. 6(1)(a)</option>
            <option value="contract">contract — Art. 6(1)(b)</option>
            <option value="legal_obligation">legal obligation — Art. 6(1)(c)</option>
            <option value="legitimate_interests">legitimate interests — Art. 6(1)(f)</option>
          </select>
        </FormGroup>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormGroup label="Consent Text Version">
          <input className="form-input" placeholder="1.0" value={form.consent_text_version}
            onChange={e => setForm(f => ({ ...f, consent_text_version: e.target.value }))} />
        </FormGroup>
        <FormGroup label="IP Address">
          <input className="form-input" placeholder="192.168.1.100" value={form.ip_address}
            onChange={e => setForm(f => ({ ...f, ip_address: e.target.value }))} />
        </FormGroup>
      </div>
    </Modal>
  )
}

// ── Notify Authority Modal ────────────────────────────────────────────────

interface NotifyModalProps {
  open: boolean; onClose: () => void
  breachId?: string; hoursRemaining?: number
}

export function NotifyAuthorityModal({ open, onClose, breachId, hoursRemaining }: NotifyModalProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    reference: '', notified_at: '', subjects_notified: 'yes', notes: '',
  })

  async function handleSubmit() {
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 800))
      toast.success('Authority notification recorded — SLA clock stopped')
      onClose()
    } finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Notify Supervisory Authority"
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Recording…' : 'Confirm Notification'}
        </button>
      </>}>
      {hoursRemaining !== undefined && (
        <InfoBox type="warning">
          <strong>{Math.max(0, Math.floor(hoursRemaining))}h {Math.floor((hoursRemaining % 1) * 60)}m remaining.</strong> Confirm you have notified the ICO (UK) or relevant DPA via their official portal.
        </InfoBox>
      )}
      <div className="mt-4">
        <FormGroup label="DPA Reference Number" hint="Reference number from the supervisory authority's portal.">
          <input className="form-input" placeholder="e.g. ICO-2025-04290001"
            value={form.reference} onChange={e => setForm(f => ({ ...f, reference: e.target.value }))} />
        </FormGroup>
        <FormGroup label="Notification Submitted At">
          <input className="form-input" type="datetime-local"
            value={form.notified_at} onChange={e => setForm(f => ({ ...f, notified_at: e.target.value }))} />
        </FormGroup>
        <FormGroup label="Data Subjects Notified?">
          <select className="form-select" value={form.subjects_notified}
            onChange={e => setForm(f => ({ ...f, subjects_notified: e.target.value }))}>
            <option value="yes">Yes — all affected subjects notified via email</option>
            <option value="no">No — risk assessed as not requiring subject notification</option>
            <option value="in_progress">In progress — notifications being sent</option>
          </select>
        </FormGroup>
        <FormGroup label="Notes">
          <textarea className="form-textarea" placeholder="Any additional notes about the notification process…"
            value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </FormGroup>
      </div>
    </Modal>
  )
}
