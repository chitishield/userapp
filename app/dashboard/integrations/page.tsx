'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard } from '@/components/ui'
import { toast } from 'sonner'
import { 
  Zap, Cloud, Database, Shield, Server, 
  RefreshCw, CheckCircle2, XCircle, AlertTriangle,
  Clock, Plus, Activity, Settings, ExternalLink
} from 'lucide-react'

interface Integration {
  id: number
  name: string
  category: 'cloud' | 'security' | 'monitoring' | 'productivity' | 'identity' | 'database'
  status: 'connected' | 'disconnected' | 'error' | 'pending'
  lastSync: string
  dataCollected: string
  framework: string[]
  icon: any
  alerts: number
}

const INTEGRATIONS: Integration[] = [
  {
    id: 1,
    name: 'AWS CloudTrail',
    category: 'cloud',
    status: 'connected',
    lastSync: '2 min ago',
    dataCollected: 'Logs, Config, Security Groups',
    framework: ['GDPR', 'SOC 2', 'HIPAA'],
    icon: Cloud,
    alerts: 0
  },
  {
    id: 2,
    name: 'GitHub Enterprise',
    category: 'productivity',
    status: 'connected',
    lastSync: '5 min ago',
    dataCollected: 'Repos, Commits, Access Logs',
    framework: ['GDPR', 'SOC 2'],
    icon: Database,
    alerts: 0
  },
  {
    id: 3,
    name: 'Jira Cloud',
    category: 'productivity',
    status: 'error',
    lastSync: '2 hours ago',
    dataCollected: 'Tickets, Workflows, Attachments',
    framework: ['GDPR', 'DPDPT'],
    icon: Activity,
    alerts: 3
  },
  {
    id: 4,
    name: 'Okta',
    category: 'identity',
    status: 'connected',
    lastSync: '1 min ago',
    dataCollected: 'Users, Groups, SSO Logs',
    framework: ['GDPR', 'SOC 2', 'HIPAA'],
    icon: Shield,
    alerts: 0
  },
  {
    id: 5,
    name: 'Slack',
    category: 'productivity',
    status: 'connected',
    lastSync: '10 min ago',
    dataCollected: 'Messages, Files, Channels',
    framework: ['GDPR', 'DPDPT'],
    icon: Zap,
    alerts: 1
  },
  {
    id: 6,
    name: 'Datadog',
    category: 'monitoring',
    status: 'disconnected',
    lastSync: 'Never',
    dataCollected: 'Metrics, Traces, Logs',
    framework: ['SOC 2'],
    icon: Activity,
    alerts: 0
  },
  {
    id: 7,
    name: 'Google Workspace',
    category: 'productivity',
    status: 'connected',
    lastSync: '3 min ago',
    dataCollected: 'Email, Drive, Admin Logs',
    framework: ['GDPR', 'DPDPT', 'HIPAA'],
    icon: Cloud,
    alerts: 0
  },
  {
    id: 8,
    name: 'LMS Platform',
    category: 'productivity',
    status: 'pending',
    lastSync: 'Pending setup',
    dataCollected: 'Training Records, Certificates',
    framework: ['GDPR', 'DPDPT', 'SOC 2', 'HIPAA'],
    icon: Settings,
    alerts: 0
  }
]

const INTEGRATION_METRICS = {
  total: 8,
  connected: 5,
  error: 1,
  disconnected: 1,
  pending: 1,
  dataPoints: '2.4M',
  uptime: '99.9%',
  lastIncident: '3 days ago'
}

export default function IntegrationsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [syncing, setSyncing] = useState<number | null>(null)

  const handleSync = async (id: number) => {
    setSyncing(id)
    await new Promise(r => setTimeout(r, 2000))
    setSyncing(null)
    toast.success('Integration synced successfully')
  }

  const handleConnect = () => {
    toast.success('New integration connected')
  }

  const handleReconnect = async (id: number) => {
    setSyncing(id)
    await new Promise(r => setTimeout(r, 2000))
    setSyncing(null)
    toast.success('Integration reconnected')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle2 size={14} style={{ color: 'var(--green)' }} />
      case 'error': return <XCircle size={14} style={{ color: 'var(--red)' }} />
      case 'disconnected': return <AlertTriangle size={14} style={{ color: 'var(--amber)' }} />
      case 'pending': return <Clock size={14} style={{ color: 'var(--slate)' }} />
      default: return null
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      cloud: 'var(--blue)',
      security: 'var(--red)',
      monitoring: 'var(--purple)',
      productivity: 'var(--teal)',
      identity: 'var(--green)',
      database: 'var(--amber)'
    }
    return colors[category] || 'var(--slate)'
  }

  return (
    <>
      <Topbar
        title="Integrations"
        subtitle={`${INTEGRATION_METRICS.connected}/${INTEGRATION_METRICS.total} connected · ${INTEGRATION_METRICS.dataPoints} data points`}
        cta={{
          label: '+ Connect New',
          onClick: handleConnect,
          icon: <Plus size={14} />,
        }}
      />

      <div className="flex-1 overflow-y-auto p-7">
        
        {/* Integration Stats */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <StatCard 
            label="Connected" 
            value={INTEGRATION_METRICS.connected} 
            change={`of ${INTEGRATION_METRICS.total} total`}
            changeDir="up"
            color="green" 
            icon="🔌" 
          />
          <StatCard 
            label="Data Points" 
            value={INTEGRATION_METRICS.dataPoints} 
            change="Collected automatically"
            color="teal" 
            icon="📊" 
          />
          <StatCard 
            label="Uptime" 
            value={INTEGRATION_METRICS.uptime} 
            change="Last 30 days"
            color="green" 
            icon="📈" 
          />
          <StatCard 
            label="Errors" 
            value={INTEGRATION_METRICS.error} 
            change={`Last incident: ${INTEGRATION_METRICS.lastIncident}`}
            color="red" 
            icon="⚠" 
          />
        </div>

        {/* Main Grid */}
        <div className="grid gap-5" style={{ gridTemplateColumns: '2fr 1fr' }}>
          
          {/* Integrations List */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>
                  Connected Services
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                  Manage your compliance data sources
                </div>
              </div>
              <select 
                className="text-xs px-2 py-1 rounded-[6px]"
                style={{ border: '1px solid var(--border)' }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="cloud">Cloud</option>
                <option value="security">Security</option>
                <option value="monitoring">Monitoring</option>
                <option value="productivity">Productivity</option>
                <option value="identity">Identity</option>
              </select>
            </div>

            <div className="space-y-3">
              {INTEGRATIONS.filter(i => categoryFilter === 'all' || i.category === categoryFilter).map(integration => {
                const Icon = integration.icon
                const categoryColor = getCategoryColor(integration.category)
                
                return (
                  <div key={integration.id} 
                    className="p-4 rounded-[8px] transition-all hover:shadow-sm"
                    style={{ border: '1px solid var(--border)' }}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${categoryColor}15`, color: categoryColor }}>
                          <Icon size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>
                              {integration.name}
                            </div>
                            {getStatusIcon(integration.status)}
                          </div>
                          <div className="text-[11px] mt-1" style={{ color: 'var(--slate-lt)' }}>
                            Collects: {integration.dataCollected}
                          </div>
                          
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                              style={{ 
                                background: `${categoryColor}15`, 
                                color: categoryColor,
                                border: `1px solid ${categoryColor}30`
                              }}>
                              {integration.category.toUpperCase()}
                            </span>
                            <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--slate)' }}>
                              <RefreshCw size={10} />
                              {integration.lastSync}
                            </span>
                            {integration.alerts > 0 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--red-lt)] text-[var(--red)] font-semibold">
                                {integration.alerts} alerts
                              </span>
                            )}
                          </div>

                          <div className="flex gap-1 mt-2">
                            {integration.framework.map(fw => (
                              <span key={fw} 
                                className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                                style={{ 
                                  background: 'var(--silver)', 
                                  color: 'var(--slate)',
                                  border: '1px solid var(--border)'
                                }}>
                                {fw}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 ml-3">
                        {integration.status === 'connected' && (
                          <button 
                            onClick={() => handleSync(integration.id)}
                            disabled={syncing === integration.id}
                            className="btn btn-ghost btn-sm flex items-center gap-1 text-[11px]"
                            style={{ color: 'var(--teal)' }}>
                            {syncing === integration.id ? (
                              <RefreshCw size={12} className="animate-spin" />
                            ) : (
                              <RefreshCw size={12} />
                            )}
                            Sync
                          </button>
                        )}
                        {integration.status === 'error' && (
                          <button 
                            onClick={() => handleReconnect(integration.id)}
                            disabled={syncing === integration.id}
                            className="btn btn-danger btn-sm flex items-center gap-1 text-[11px]">
                            {syncing === integration.id ? (
                              <RefreshCw size={12} className="animate-spin" />
                            ) : (
                              <RefreshCw size={12} />
                            )}
                            Reconnect
                          </button>
                        )}
                        {integration.status === 'disconnected' && (
                          <button 
                            onClick={() => handleReconnect(integration.id)}
                            className="btn btn-secondary btn-sm text-[11px]">
                            Connect
                          </button>
                        )}
                        {integration.status === 'pending' && (
                          <button 
                            className="btn btn-ghost btn-sm text-[11px]"
                            onClick={() => toast.success('Setup initiated')}>
                            <Settings size={12} className="mr-1" />
                            Setup
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            
            {/* Integration Health */}
            <div className="card">
              <div className="text-[14px] font-[650] mb-4" style={{ color: 'var(--navy)' }}>
                Integration Health
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: 'var(--slate)' }}>Data Sync Status</span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--green)' }}>Healthy</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--silver)' }}>
                    <div className="h-full rounded-full" style={{ width: '95%', background: 'var(--green)' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: 'var(--slate)' }}>API Response Time</span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--teal)' }}>234ms</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--silver)' }}>
                    <div className="h-full rounded-full" style={{ width: '88%', background: 'var(--teal)' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: 'var(--slate)' }}>Error Rate</span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--red)' }}>1.2%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--silver)' }}>
                    <div className="h-full rounded-full" style={{ width: '1.2%', background: 'var(--red)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Data Collection Summary */}
            <div className="card">
              <div className="text-[14px] font-[650] mb-4" style={{ color: 'var(--navy)' }}>
                Data Collection Summary
              </div>
              
              <div className="space-y-3">
                <div className="p-3 rounded-[6px]" style={{ background: 'var(--green-lt)', border: '1px solid var(--green-bd)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: 'var(--green)' }}>Automated</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--green)' }}>85%</span>
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--green)' }}>
                    Via 5 active integrations
                  </div>
                </div>
                
                <div className="p-3 rounded-[6px]" style={{ background: 'var(--amber-lt)', border: '1px solid var(--amber-bd)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: 'var(--amber)' }}>Manual Upload</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--amber)' }}>15%</span>
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--amber)' }}>
                    12 items need attention
                  </div>
                </div>
              </div>
            </div>

            {/* Available Integrations */}
            <div className="card">
              <div className="text-[14px] font-[650] mb-4" style={{ color: 'var(--navy)' }}>
                Available Integrations
              </div>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-[6px] text-[12px] flex items-center gap-2 hover:bg-[var(--silver)] transition-colors"
                  style={{ color: 'var(--navy)' }}
                  onClick={() => toast.success('Integration request submitted')}>
                  <Shield size={14} style={{ color: 'var(--blue)' }} />
                  Azure AD
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-[var(--teal-lt)] text-[var(--teal)]">New</span>
                </button>
                <button className="w-full text-left px-3 py-2 rounded-[6px] text-[12px] flex items-center gap-2 hover:bg-[var(--silver)] transition-colors"
                  style={{ color: 'var(--navy)' }}
                  onClick={() => toast.success('Integration request submitted')}>
                  <Server size={14} style={{ color: 'var(--purple)' }} />
                  PagerDuty
                </button>
                <button className="w-full text-left px-3 py-2 rounded-[6px] text-[12px] flex items-center gap-2 hover:bg-[var(--silver)] transition-colors"
                  style={{ color: 'var(--navy)' }}
                  onClick={() => toast.success('Integration request submitted')}>
                  <Database size={14} style={{ color: 'var(--amber)' }} />
                  Snowflake
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}