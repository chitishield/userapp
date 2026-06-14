'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard } from '@/components/ui'
import { toast } from 'sonner'
import { 
  Calendar, Clock, AlertCircle, CheckCircle2, 
  ArrowRight, Plus, Filter, Globe, Shield, 
  Building2, Stethoscope, ChevronRight
} from 'lucide-react'

interface TimelineEvent {
  id: number
  event: string
  framework: string
  type: 'audit' | 'certification' | 'deadline' | 'renewal' | 'assessment'
  date: string
  status: 'completed' | 'in_progress' | 'upcoming' | 'overdue' | 'planned'
  description: string
  owner: string
  priority: 'high' | 'medium' | 'low'
}

const UPCOMING_EVENTS: TimelineEvent[] = [
  {
    id: 1,
    event: 'GDPR Annual Audit',
    framework: 'GDPR',
    type: 'audit',
    date: '2026-01-15',
    status: 'upcoming',
    description: 'Annual third-party GDPR compliance audit',
    owner: 'Arjun Kumar',
    priority: 'high'
  },
  {
    id: 2,
    event: 'DPDPT Certification',
    framework: 'DPDPT',
    type: 'certification',
    date: '2026-03-20',
    status: 'in_progress',
    description: 'Data Protection Board of India certification',
    owner: 'Priya Sharma',
    priority: 'high'
  },
  {
    id: 3,
    event: 'SOC 2 Type II Audit Window',
    framework: 'SOC 2',
    type: 'audit',
    date: '2026-06-01',
    status: 'planned',
    description: 'SOC 2 Type II audit preparation and execution',
    owner: 'Arjun Kumar',
    priority: 'medium'
  },
  {
    id: 4,
    event: 'GDPR Certificate Renewal',
    framework: 'GDPR',
    type: 'renewal',
    date: '2025-12-31',
    status: 'overdue',
    description: 'Annual certification renewal deadline',
    owner: 'Arjun Kumar',
    priority: 'high'
  },
  {
    id: 5,
    event: 'Quarterly Risk Assessment',
    framework: 'All',
    type: 'assessment',
    date: '2026-01-05',
    status: 'upcoming',
    description: 'Quarterly compliance risk assessment review',
    owner: 'System',
    priority: 'medium'
  },
  {
    id: 6,
    event: 'HIPAA Readiness Check',
    framework: 'HIPAA',
    type: 'assessment',
    date: '2026-04-15',
    status: 'planned',
    description: 'Initial HIPAA compliance gap assessment',
    owner: 'Priya Sharma',
    priority: 'low'
  },
  {
    id: 7,
    event: 'Data Mapping Update',
    framework: 'GDPR',
    type: 'deadline',
    date: '2026-02-28',
    status: 'upcoming',
    description: 'Update data flow maps and processing activities',
    owner: 'System',
    priority: 'medium'
  },
  {
    id: 8,
    event: 'DPDPT Consent Review',
    framework: 'DPDPT',
    type: 'deadline',
    date: '2026-01-30',
    status: 'upcoming',
    description: 'Review and update consent mechanisms for DPDPT',
    owner: 'Arjun Kumar',
    priority: 'high'
  }
]

const COMPLETED_EVENTS: TimelineEvent[] = [
  {
    id: 9,
    event: 'GDPR Data Protection Impact Assessment',
    framework: 'GDPR',
    type: 'assessment',
    date: '2025-11-15',
    status: 'completed',
    description: 'Completed DPIA for biometric authentication system',
    owner: 'Priya Sharma',
    priority: 'high'
  },
  {
    id: 10,
    event: 'Security Training Program',
    framework: 'All',
    type: 'deadline',
    date: '2025-11-01',
    status: 'completed',
    description: 'Annual security awareness training for all employees',
    owner: 'System',
    priority: 'medium'
  },
  {
    id: 11,
    event: 'Vendor Risk Assessment',
    framework: 'GDPR',
    type: 'assessment',
    date: '2025-10-20',
    status: 'completed',
    description: 'Completed vendor risk assessments for 45 vendors',
    owner: 'Arjun Kumar',
    priority: 'medium'
  }
]

const MILESTONES = [
  { quarter: 'Q1 2026', events: [
    { title: 'GDPR Audit Completion', date: 'Jan 15', status: 'upcoming' },
    { title: 'DPDPT Readiness', date: 'Feb 28', status: 'upcoming' },
    { title: 'Evidence Collection Sprint', date: 'Mar 15', status: 'planned' }
  ]},
  { quarter: 'Q2 2026', events: [
    { title: 'DPDPT Certification', date: 'Apr 20', status: 'planned' },
    { title: 'SOC 2 Preparation', date: 'May 15', status: 'planned' },
    { title: 'HIPAA Gap Analysis', date: 'Jun 30', status: 'planned' }
  ]},
  { quarter: 'Q3 2026', events: [
    { title: 'SOC 2 Type II Audit', date: 'Jul 15', status: 'planned' },
    { title: 'Mid-Year Review', date: 'Aug 30', status: 'planned' }
  ]},
  { quarter: 'Q4 2026', events: [
    { title: 'Annual Compliance Review', date: 'Oct 15', status: 'planned' },
    { title: '2027 Planning', date: 'Dec 15', status: 'planned' }
  ]}
]

export default function TimelinePage() {
  const [filter, setFilter] = useState<string>('all')
  const [view, setView] = useState<'timeline' | 'calendar'>('timeline')

  const handleAddEvent = () => {
    toast.success('Event added to timeline')
  }

  const getFrameworkIcon = (framework: string) => {
    const icons: Record<string, any> = {
      'GDPR': Globe,
      'DPDPT': Shield,
      'SOC 2': Building2,
      'HIPAA': Stethoscope,
      'All': Globe
    }
    const Icon = icons[framework] || Globe
    return <Icon size={14} />
  }

  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; color: string; border: string }> = {
      completed: { bg: 'var(--green-lt)', color: 'var(--green)', border: 'var(--green-bd)' },
      in_progress: { bg: 'var(--blue-lt)', color: 'var(--blue)', border: 'var(--blue-bd)' },
      upcoming: { bg: 'var(--teal-lt)', color: 'var(--teal)', border: 'var(--teal-bd)' },
      overdue: { bg: 'var(--red-lt)', color: 'var(--red)', border: 'var(--red-bd)' },
      planned: { bg: 'var(--silver)', color: 'var(--slate)', border: 'var(--border)' }
    }
    return styles[status] || styles.planned
  }

  const getPriorityStyle = (priority: string) => {
    const styles: Record<string, string> = {
      high: 'var(--red)',
      medium: 'var(--amber)',
      low: 'var(--green)'
    }
    return styles[priority] || 'var(--slate)'
  }

  const upcomingCount = UPCOMING_EVENTS.filter(e => e.status === 'upcoming' || e.status === 'in_progress').length
  const overdueCount = UPCOMING_EVENTS.filter(e => e.status === 'overdue').length
  const completedCount = COMPLETED_EVENTS.length

  return (
    <>
      <Topbar
        title="Compliance Timeline"
        subtitle={`${upcomingCount} upcoming · ${overdueCount} overdue`}
        cta={{
          label: '+ Add Event',
          onClick: handleAddEvent,
          icon: <Plus size={14} />,
        }}
      />

      <div className="flex-1 overflow-y-auto p-7">
        
        {/* Timeline Stats */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <StatCard 
            label="Upcoming Events" 
            value={upcomingCount} 
            change="Next 90 days"
            color="blue" 
            icon="📅" 
          />
          <StatCard 
            label="Overdue" 
            value={overdueCount} 
            change="Requires immediate attention"
            color="red" 
            icon="⚠" 
          />
          <StatCard 
            label="Completed" 
            value={completedCount} 
            change="Last 90 days"
            changeDir="up"
            color="green" 
            icon="✓" 
          />
          <StatCard 
            label="Next Audit" 
            value="15 Jan" 
            change="GDPR Annual Audit"
            color="teal" 
            icon="🔍" 
          />
        </div>

        {/* Main Grid */}
        <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: '2fr 1fr' }}>
          
          {/* Timeline Events */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>
                  Upcoming & In Progress
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                  All frameworks compliance schedule
                </div>
              </div>
              <div className="flex gap-2">
                <select 
                  className="text-xs px-2 py-1 rounded-[6px]"
                  style={{ border: '1px solid var(--border)' }}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}>
                  <option value="all">All Frameworks</option>
                  <option value="GDPR">GDPR</option>
                  <option value="DPDPT">DPDPT</option>
                  <option value="SOC 2">SOC 2</option>
                  <option value="HIPAA">HIPAA</option>
                </select>
              </div>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-0.5" style={{ background: 'var(--border)' }} />

              <div className="space-y-6">
                {UPCOMING_EVENTS.filter(e => filter === 'all' || e.framework === filter).map(event => {
                  const statusStyle = getStatusStyle(event.status)
                  const priorityColor = getPriorityStyle(event.priority)
                  
                  return (
                    <div key={event.id} className="flex gap-4 relative">
                      {/* Timeline dot */}
                      <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center z-10 flex-shrink-0"
                        style={{ 
                          background: statusStyle.bg, 
                          border: `2px solid ${statusStyle.border}`,
                          boxShadow: `0 0 0 3px ${statusStyle.bg}`
                        }}>
                        {event.status === 'completed' ? (
                          <CheckCircle2 size={16} style={{ color: statusStyle.color }} />
                        ) : event.status === 'overdue' ? (
                          <AlertCircle size={16} style={{ color: statusStyle.color }} />
                        ) : (
                          <Clock size={16} style={{ color: statusStyle.color }} />
                        )}
                      </div>

                      <div className="flex-1 pb-4">
                        <div className="p-4 rounded-[8px] transition-all hover:shadow-sm"
                          style={{ 
                            border: '1px solid var(--border)',
                            background: 'white'
                          }}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="text-[13px] font-semibold flex items-center gap-2" style={{ color: 'var(--navy)' }}>
                                {event.event}
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                                  style={{ background: statusStyle.bg, color: statusStyle.color }}>
                                  {event.status.replace('_', ' ').toUpperCase()}
                                </span>
                              </div>
                              <div className="text-[11px] mt-1" style={{ color: 'var(--slate-lt)' }}>
                                {event.description}
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold flex-shrink-0 ml-2" 
                              style={{ color: priorityColor }}>
                              ● {event.priority.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                            <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--slate)' }}>
                              {getFrameworkIcon(event.framework)}
                              {event.framework}
                            </span>
                            <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--slate)' }}>
                              <Calendar size={12} />
                              {new Date(event.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </span>
                            <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--slate)' }}>
                              👤 {event.owner}
                            </span>
                            <button 
                              className="ml-auto text-[11px] flex items-center gap-1 font-medium hover:underline"
                              style={{ color: 'var(--teal)' }}
                              onClick={() => toast.success(`Viewing ${event.event} details`)}>
                              Details
                              <ChevronRight size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            
            {/* Quarterly Milestones */}
            <div className="card">
              <div className="text-[14px] font-[650] mb-4" style={{ color: 'var(--navy)' }}>
                2026 Milestones
              </div>
              <div className="space-y-3">
                {MILESTONES.map(quarter => (
                  <div key={quarter.quarter}>
                    <div className="text-[11px] font-semibold mb-2" style={{ color: 'var(--teal)' }}>
                      {quarter.quarter}
                    </div>
                    <div className="space-y-1.5">
                      {quarter.events.map((event, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px]">
                          <div className="w-1.5 h-1.5 rounded-full" 
                            style={{ 
                              background: event.status === 'upcoming' ? 'var(--blue)' : 
                                          event.status === 'planned' ? 'var(--slate)' : 
                                          'var(--green)' 
                            }} 
                          />
                          <span style={{ color: 'var(--navy)' }}>{event.title}</span>
                          <span className="ml-auto" style={{ color: 'var(--slate-lt)' }}>{event.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recently Completed */}
            <div className="card">
              <div className="text-[14px] font-[650] mb-4" style={{ color: 'var(--navy)' }}>
                Recently Completed
              </div>
              <div className="space-y-3">
                {COMPLETED_EVENTS.map(event => (
                  <div key={event.id} className="flex items-start gap-3">
                    <CheckCircle2 size={14} style={{ color: 'var(--green)', marginTop: 2 }} />
                    <div>
                      <div className="text-[12px] font-semibold" style={{ color: 'var(--navy)' }}>
                        {event.event}
                      </div>
                      <div className="text-[10px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                        {event.date} · {event.framework}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}