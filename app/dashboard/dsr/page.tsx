'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard, Badge, FilterPills, SLATimer, EmptyState } from '@/components/ui'
import { DSRModal } from '@/components/modals'
import { toast } from 'sonner'
import { formatDate, formatSLACountdown, DSR_LABELS, DSR_STATUS_LABELS } from '@/lib/utils'
import type { DSRRequest } from '@/types'

const DSRS: DSRRequest[] = [
  { id: 'dsr1', tenant_id:'t1', data_subject_id:'ds1', data_subject_email:'sarah.m@gmail.com',    type:'erasure',     status:'overdue',     regulation:'gdpr', description:'Right to be forgotten', submitted_at: new Date(Date.now()-30*86400*1000).toISOString(), due_date: new Date(Date.now()-1*86400*1000).toISOString(),                      assigned_to:'admin1', resolution_notes:'', is_overdue:true,  sla_hours_total:720, created_at: new Date(Date.now()-30*86400*1000).toISOString() },
  { id: 'dsr2', tenant_id:'t1', data_subject_id:'ds2', data_subject_email:'john.d@yahoo.com',     type:'access',      status:'overdue',     regulation:'gdpr', description:'Copy of personal data', submitted_at: new Date(Date.now()-31*86400*1000).toISOString(), due_date: new Date(Date.now()-1.5*86400*1000).toISOString(),                  assigned_to:'admin2', resolution_notes:'', is_overdue:true,  sla_hours_total:720, created_at: new Date(Date.now()-31*86400*1000).toISOString() },
  { id: 'dsr3', tenant_id:'t1', data_subject_id:'ds3', data_subject_email:'maya.k@hotmail.com',   type:'portability', status:'in_progress', regulation:'gdpr', description:'Data export request',   submitted_at: new Date(Date.now()-14*86400*1000).toISOString(), due_date: new Date(Date.now()+16*86400*1000).toISOString(),                    assigned_to:'admin1', resolution_notes:'', is_overdue:false, sla_hours_total:720, created_at: new Date(Date.now()-14*86400*1000).toISOString() },
  { id: 'dsr4', tenant_id:'t1', data_subject_id:'ds4', data_subject_email:'ravi.s@gmail.com',     type:'correction',  status:'completed',   regulation:'gdpr', description:'Update address data',   submitted_at: new Date(Date.now()-6*86400*1000).toISOString(),  due_date: new Date(Date.now()+24*86400*1000).toISOString(), completed_at: new Date(Date.now()-1*86400*1000).toISOString(), assigned_to:'admin2', resolution_notes:'Address updated in all systems.', is_overdue:false, sla_hours_total:720, created_at: new Date(Date.now()-6*86400*1000).toISOString() },
  { id: 'dsr5', tenant_id:'t1', data_subject_id:'ds5', data_subject_email:'priya.n@outlook.com',  type:'objection',   status:'pending',     regulation:'gdpr', description:'Objection to marketing', submitted_at: new Date(Date.now()-2*86400*1000).toISOString(), due_date: new Date(Date.now()+28*86400*1000).toISOString(),                  assigned_to:undefined, resolution_notes:'', is_overdue:false, sla_hours_total:720, created_at: new Date(Date.now()-2*86400*1000).toISOString() },
]

export default function DSRPage() {
  const [filter, setFilter] = useState('all')
  const [modal, setModal]   = useState(false)
  const [dsrs, setDSRs]     = useState(DSRS)

  const filtered = dsrs.filter(d => filter === 'all' || d.status === filter)

  const stats = {
    total:     dsrs.length,
    pending:   dsrs.filter(d => d.status === 'pending' || d.status === 'in_progress').length,
    overdue:   dsrs.filter(d => d.status === 'overdue').length,
    completed: dsrs.filter(d => d.status === 'completed').length,
  }

  function complete(id: string) {
    setDSRs(ds => ds.map(d => d.id === id
      ? { ...d, status: 'completed' as const, completed_at: new Date().toISOString(), is_overdue: false }
      : d))
    toast.success('DSR marked as completed — SLA clock stopped')
  }

  return (
    <>
      <Topbar
        title="DSR Requests"
        subtitle="Data Subject Rights"
        cta={{ label: '+ New Request', onClick: () => setModal(true) }}
      />
      <div className="flex-1 overflow-y-auto p-7">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <StatCard label="Total DSRs"  value={stats.total}     change="This month" color="blue" />
          <StatCard label="Pending"     value={stats.pending}   change="Awaiting action" color="amber" />
          <StatCard label="Overdue"     value={stats.overdue}   change="SLA breached" changeDir="down" color="red" />
          <StatCard label="Completed"   value={stats.completed} change={`${Math.round(stats.completed/stats.total*100)}% completion`} changeDir="up" color="green" />
        </div>

        {/* Overdue banner */}
        {stats.overdue > 0 && (
          <div className="mb-5 p-3 rounded-[8px] flex items-center gap-3"
            style={{ background: 'var(--red-lt)', border: '1px solid var(--red-bd)' }}>
            <span style={{ color: 'var(--red)' }}>⚠</span>
            <span className="text-[13px] font-semibold flex-1" style={{ color: 'var(--red)' }}>
              {stats.overdue} DSR request{stats.overdue > 1 ? 's' : ''} overdue — 30-day GDPR Art. 12 SLA breached
            </span>
            <button className="btn btn-danger btn-sm" onClick={() => setFilter('overdue')}>
              View Overdue
            </button>
          </div>
        )}

        {/* Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>Data Subject Requests</div>
              <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>30-day SLA monitored automatically · GDPR Art. 15-22</div>
            </div>
            <div className="flex items-center gap-3">
              <FilterPills
                options={[
                  { label: 'All', value: 'all' },
                  { label: `Overdue (${stats.overdue})`, value: 'overdue' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'In Progress', value: 'in_progress' },
                  { label: 'Completed', value: 'completed' },
                ]}
                active={filter}
                onChange={setFilter}
              />
              <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}>+ New</button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon="📋" title="No requests" description="No DSR requests match the current filter." />
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Data Subject</th>
                    <th>Submitted</th>
                    <th>Due Date</th>
                    <th>SLA</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(dsr => {
                    const sla = dsr.due_date ? formatSLACountdown(dsr.due_date) : null
                    const typeInfo = DSR_LABELS[dsr.type] || { label: dsr.type, color: 'badge-gray' }
                    const isOverdue = dsr.status === 'overdue'
                    return (
                      <tr key={dsr.id} style={isOverdue ? { background: 'var(--red-lt)' } : {}}>
                        <td className="font-mono text-xs text-[var(--slate)]">
                          #DSR-{dsr.id.slice(-4).toUpperCase()}
                        </td>
                        <td>
                          <Badge variant={
                            dsr.type === 'erasure' ? 'red' :
                            dsr.type === 'access' ? 'blue' :
                            dsr.type === 'portability' ? 'purple' :
                            dsr.type === 'correction' ? 'teal' : 'amber'
                          }>
                            {typeInfo.label.toUpperCase()}
                          </Badge>
                        </td>
                        <td>
                          <div className="text-[13px]">{dsr.data_subject_email}</div>
                          <div className="text-[11px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                            {dsr.description.slice(0, 40)}
                          </div>
                        </td>
                        <td className="text-[12px]" style={{ color: 'var(--slate)' }}>
                          {formatDate(dsr.submitted_at)}
                        </td>
                        <td>
                          <span className="text-[12px] font-medium" style={{
                            color: isOverdue ? 'var(--red)' : sla?.status === 'warning' ? 'var(--amber)' : 'var(--slate-lt)'
                          }}>
                            {dsr.due_date ? formatDate(dsr.due_date) : '—'}
                          </span>
                        </td>
                        <td>
                          {sla && dsr.status !== 'completed' && dsr.status !== 'rejected' ? (
                            <SLATimer status={sla.status === 'overdue' ? 'critical' : sla.status} label={sla.label} />
                          ) : dsr.status === 'completed' ? (
                            <span className="text-[12px]" style={{ color: 'var(--green)' }}>✓ Resolved</span>
                          ) : '—'}
                        </td>
                        <td>
                          <Badge variant={
                            dsr.status === 'completed' ? 'green' :
                            dsr.status === 'overdue' ? 'red' :
                            dsr.status === 'in_progress' ? 'blue' :
                            dsr.status === 'rejected' ? 'gray' : 'amber'
                          }>
                            ● {dsr.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td>
                          {isOverdue || dsr.status === 'pending' || dsr.status === 'in_progress' ? (
                            <button
                              className={isOverdue ? 'btn btn-danger btn-sm' : 'btn btn-secondary btn-sm'}
                              onClick={() => complete(dsr.id)}>
                              {isOverdue ? 'Resolve Now' : 'Complete'}
                            </button>
                          ) : (
                            <button className="btn btn-ghost btn-sm">View</button>
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
      <DSRModal open={modal} onClose={() => setModal(false)} />
    </>
  )
}
