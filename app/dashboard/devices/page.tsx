'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard, ProgressBar, VendorRiskBadge } from '@/components/ui'
import { toast } from 'sonner'
import { 
  Monitor, Laptop, Shield, HardDrive, Key, 
  ShieldAlert, CheckCircle2, AlertTriangle, XCircle,
  Search, Filter, Download, RefreshCw, Plus,
  Apple, MonitorIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Device {
  id: number
  name: string
  owner: string
  os: string
  osVersion: string
  status: 'monitored' | 'unmonitored'
  monitoringBy: string
  passwordCompliant: boolean
  hardDriveEncrypted: boolean
  antivirusActive: boolean
  screenLockEnabled: boolean
  lastCheck: string
  riskScore: number
}

const DEVICE_METRICS = {
  total_devices: 42,
  monitored: 35,
  unmonitored: 7,
  compliant: 30,
  non_compliant: 12,
  critical_issues: 5,
  avg_risk_score: 72
}

const DEVICES: Device[] = [
  {
    id: 1,
    name: 'Neil-MacBook-Pro',
    owner: 'Neil',
    os: 'macOS',
    osVersion: '11.7.7',
    status: 'monitored',
    monitoringBy: 'Hexnode UEM',
    passwordCompliant: true,
    hardDriveEncrypted: true,
    antivirusActive: true,
    screenLockEnabled: true,
    lastCheck: '2 min ago',
    riskScore: 15
  },
  {
    id: 2,
    name: 'Liza-MacBook-Air',
    owner: 'Liza',
    os: 'macOS',
    osVersion: '13.5',
    status: 'monitored',
    monitoringBy: 'Vanta Agent',
    passwordCompliant: true,
    hardDriveEncrypted: true,
    antivirusActive: false,
    screenLockEnabled: true,
    lastCheck: '5 min ago',
    riskScore: 35
  },
  {
    id: 3,
    name: 'John-ThinkPad',
    owner: 'John',
    os: 'Windows',
    osVersion: '11 Pro',
    status: 'monitored',
    monitoringBy: 'Vanta Agent',
    passwordCompliant: true,
    hardDriveEncrypted: true,
    antivirusActive: true,
    screenLockEnabled: false,
    lastCheck: '1 min ago',
    riskScore: 25
  },
  {
    id: 4,
    name: 'Chris-MacBook-Pro',
    owner: 'Chris',
    os: 'macOS',
    osVersion: '13.5',
    status: 'monitored',
    monitoringBy: 'Hexnode UEM',
    passwordCompliant: false,
    hardDriveEncrypted: true,
    antivirusActive: true,
    screenLockEnabled: true,
    lastCheck: '8 min ago',
    riskScore: 60
  },
  {
    id: 5,
    name: 'Emma-MacBook-Air',
    owner: 'Emma',
    os: 'macOS',
    osVersion: '12.6.3',
    status: 'monitored',
    monitoringBy: 'Vanta Agent',
    passwordCompliant: true,
    hardDriveEncrypted: false,
    antivirusActive: true,
    screenLockEnabled: true,
    lastCheck: '3 min ago',
    riskScore: 70
  },
  {
    id: 6,
    name: 'Chloé-MacBook-Pro',
    owner: 'Chloé',
    os: 'macOS',
    osVersion: '13.6',
    status: 'unmonitored',
    monitoringBy: 'None',
    passwordCompliant: false,
    hardDriveEncrypted: false,
    antivirusActive: false,
    screenLockEnabled: false,
    lastCheck: 'Never',
    riskScore: 95
  },
  {
    id: 7,
    name: 'Shawn-Desktop',
    owner: 'Shawn',
    os: 'macOS',
    osVersion: '14.0',
    status: 'monitored',
    monitoringBy: 'Vanta Agent',
    passwordCompliant: true,
    hardDriveEncrypted: true,
    antivirusActive: true,
    screenLockEnabled: true,
    lastCheck: '1 min ago',
    riskScore: 5
  },
]

export default function DevicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterOS, setFilterOS] = useState<string>('all')
  const [syncing, setSyncing] = useState(false)

  const handleSync = async () => {
    setSyncing(true)
    await new Promise(r => setTimeout(r, 2000))
    setSyncing(false)
    toast.success('Devices synced successfully')
  }

  const handleExport = () => {
    toast.success('Device report exported')
  }

  const handleBulkReminder = () => {
    toast.success('Reminders sent to unmonitored device owners')
  }

  const getRiskLevel = (score: number): 'critical' | 'high' | 'medium' | 'low' => {
    if (score >= 80) return 'critical'
    if (score >= 50) return 'high'
    if (score >= 25) return 'medium'
    return 'low'
  }

  return (
    <>
      <Topbar
        title="Device & Asset Management"
        subtitle={`${DEVICE_METRICS.monitored} monitored · ${DEVICE_METRICS.unmonitored} unmonitored`}
        cta={{
          label: syncing ? 'Syncing…' : 'Sync Devices',
          onClick: handleSync,
          icon: syncing ? 
            <RefreshCw size={14} className="animate-spin" /> : 
            <RefreshCw size={14} />,
        }}
      />

      <div className="flex-1 overflow-y-auto p-7">
        
        {/* Device Stats */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <StatCard 
            label="Total Devices" 
            value={DEVICE_METRICS.total_devices} 
            change={`${DEVICE_METRICS.monitored} monitored`}
            changeDir="up"
            color="blue" 
            icon="💻" 
          />
          <StatCard 
            label="Compliant Devices" 
            value={`${Math.round((DEVICE_METRICS.compliant / DEVICE_METRICS.total_devices) * 100)}%`}
            change={`${DEVICE_METRICS.non_compliant} need attention`}
            color={DEVICE_METRICS.non_compliant > 5 ? 'red' : 'green'} 
            icon="✓" 
          />
          <StatCard 
            label="Critical Issues" 
            value={DEVICE_METRICS.critical_issues} 
            change="Requires immediate action"
            color="red" 
            icon="⚠" 
          />
          <StatCard 
            label="Avg Risk Score" 
            value={`${DEVICE_METRICS.avg_risk_score}/100`} 
            change="Lower is better"
            changeDir={DEVICE_METRICS.avg_risk_score < 50 ? 'up' : 'down'}
            color={DEVICE_METRICS.avg_risk_score < 50 ? 'green' : 'amber'} 
            icon="📊" 
          />
        </div>

        {/* Device Compliance Overview */}
        <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: '2fr 1fr' }}>
          
          {/* Security Controls Overview */}
          <div className="card">
            <div className="text-[14px] font-[650] mb-5" style={{ color: 'var(--navy)' }}>
              Security Controls Compliance
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs flex items-center gap-2" style={{ color: 'var(--slate)' }}>
                    <Key size={12} />
                    Password Policy
                  </span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--green)' }}>
                    {Math.round((DEVICES.filter(d => d.passwordCompliant).length / DEVICES.length) * 100)}%
                  </span>
                </div>
                <ProgressBar 
                  value={(DEVICES.filter(d => d.passwordCompliant).length / DEVICES.length) * 100} 
                  color="var(--green)" 
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs flex items-center gap-2" style={{ color: 'var(--slate)' }}>
                    <HardDrive size={12} />
                    Hard Drive Encryption
                  </span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--amber)' }}>
                    {Math.round((DEVICES.filter(d => d.hardDriveEncrypted).length / DEVICES.length) * 100)}%
                  </span>
                </div>
                <ProgressBar 
                  value={(DEVICES.filter(d => d.hardDriveEncrypted).length / DEVICES.length) * 100} 
                  color="var(--amber)" 
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs flex items-center gap-2" style={{ color: 'var(--slate)' }}>
                    <Shield size={12} />
                    Antivirus Active
                  </span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--green)' }}>
                    {Math.round((DEVICES.filter(d => d.antivirusActive).length / DEVICES.length) * 100)}%
                  </span>
                </div>
                <ProgressBar 
                  value={(DEVICES.filter(d => d.antivirusActive).length / DEVICES.length) * 100} 
                  color="var(--green)" 
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs flex items-center gap-2" style={{ color: 'var(--slate)' }}>
                    <Monitor size={12} />
                    Screen Lock Enabled
                  </span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--green)' }}>
                    {Math.round((DEVICES.filter(d => d.screenLockEnabled).length / DEVICES.length) * 100)}%
                  </span>
                </div>
                <ProgressBar 
                  value={(DEVICES.filter(d => d.screenLockEnabled).length / DEVICES.length) * 100} 
                  color="var(--green)" 
                />
              </div>
            </div>
          </div>

          {/* Quick Stats & Actions */}
          <div className="space-y-5">
            <div className="card">
              <div className="text-[14px] font-[650] mb-4" style={{ color: 'var(--navy)' }}>
                Device Distribution
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--slate)' }}>macOS</span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--navy)' }}>
                    {DEVICES.filter(d => d.os === 'macOS').length} devices
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--slate)' }}>Windows</span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--navy)' }}>
                    {DEVICES.filter(d => d.os === 'Windows').length} devices
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--slate)' }}>Linux</span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--navy)' }}>
                    {DEVICES.filter(d => d.os === 'Linux').length} devices
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="text-[12px] font-semibold mb-3" style={{ color: 'var(--navy)' }}>
                  Monitoring Method
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--slate)' }}>Vanta Agent</span>
                    <span style={{ color: 'var(--navy)' }}>28 devices</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--slate)' }}>Hexnode UEM</span>
                    <span style={{ color: 'var(--navy)' }}>7 devices</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--red)' }}>Unmonitored</span>
                    <span style={{ color: 'var(--red)' }}>7 devices</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="text-[14px] font-[650] mb-4" style={{ color: 'var(--navy)' }}>
                Actions
              </div>
              <div className="space-y-2">
                <button 
                  className="w-full btn btn-secondary text-left flex items-center gap-2 text-xs"
                  onClick={handleBulkReminder}>
                  <ShieldAlert size={14} />
                  Send Bulk Reminder
                </button>
                <button 
                  className="w-full btn btn-secondary text-left flex items-center gap-2 text-xs"
                  onClick={handleExport}>
                  <Download size={14} />
                  Export Device Report
                </button>
                <button 
                  className="w-full btn btn-secondary text-left flex items-center gap-2 text-xs"
                  onClick={() => toast.success('Agent deployment initiated')}>
                  <Plus size={14} />
                  Deploy Vanta Agent
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Devices Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>
                All Devices
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                Use MDM or Vanta Agent to track devices
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[13px]"
                style={{ background: 'var(--silver)', border: '1px solid var(--border)' }}>
                <Search size={13} style={{ color: 'var(--slate-lt)' }} />
                <input
                  className="bg-transparent outline-none w-48 text-[13px]"
                  placeholder="Search devices…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ color: 'var(--navy)' }}
                />
              </div>
              <select 
                className="text-xs px-2 py-1 rounded-[6px]"
                style={{ border: '1px solid var(--border)' }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="monitored">Monitored</option>
                <option value="unmonitored">Unmonitored</option>
              </select>
              <select 
                className="text-xs px-2 py-1 rounded-[6px]"
                style={{ border: '1px solid var(--border)' }}
                value={filterOS}
                onChange={(e) => setFilterOS(e.target.value)}>
                <option value="all">All OS</option>
                <option value="macOS">macOS</option>
                <option value="Windows">Windows</option>
                <option value="Linux">Linux</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Device</th>
                  <th className="text-left py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Owner</th>
                  <th className="text-left py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>OS</th>
                  <th className="text-left py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Status</th>
                  <th className="text-center py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>PW</th>
                  <th className="text-center py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>HD</th>
                  <th className="text-center py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>AV</th>
                  <th className="text-center py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>SL</th>
                  <th className="text-left py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Risk</th>
                  <th className="text-left py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Last Check</th>
                  <th className="text-right py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {DEVICES.filter(d => {
                  if (filterStatus !== 'all' && d.status !== filterStatus) return false
                  if (filterOS !== 'all' && d.os !== filterOS) return false
                  if (searchTerm && !d.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
                      !d.owner.toLowerCase().includes(searchTerm.toLowerCase())) return false
                  return true
                }).map(device => (
                  <tr key={device.id} 
                    className="hover:bg-[var(--silver)] transition-colors"
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {device.os === 'macOS' ? 
                          <Apple size={14} style={{ color: 'var(--slate)' }} /> : 
                          <MonitorIcon size={14} style={{ color: 'var(--slate)' }} />
                        }
                        <div className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>
                          {device.name}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[13px]" style={{ color: 'var(--slate)' }}>
                      {device.owner}
                    </td>
                    <td className="py-3 px-3 text-[13px]" style={{ color: 'var(--slate)' }}>
                      {device.os} {device.osVersion}
                    </td>
                    <td className="py-3 px-3">
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-medium',
                        device.status === 'monitored' 
                          ? 'bg-[var(--green-lt)] text-[var(--green)] border border-[var(--green-bd)]'
                          : 'bg-[var(--red-lt)] text-[var(--red)] border border-[var(--red-bd)]'
                      )}>
                        {device.status === 'monitored' ? 'Monitored' : 'Unmonitored'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {device.passwordCompliant ? 
                        <CheckCircle2 size={14} style={{ color: 'var(--green)' }} /> : 
                        <XCircle size={14} style={{ color: 'var(--red)' }} />
                      }
                    </td>
                    <td className="py-3 px-3 text-center">
                      {device.hardDriveEncrypted ? 
                        <CheckCircle2 size={14} style={{ color: 'var(--green)' }} /> : 
                        <XCircle size={14} style={{ color: 'var(--red)' }} />
                      }
                    </td>
                    <td className="py-3 px-3 text-center">
                      {device.antivirusActive ? 
                        <CheckCircle2 size={14} style={{ color: 'var(--green)' }} /> : 
                        <XCircle size={14} style={{ color: 'var(--red)' }} />
                      }
                    </td>
                    <td className="py-3 px-3 text-center">
                      {device.screenLockEnabled ? 
                        <CheckCircle2 size={14} style={{ color: 'var(--green)' }} /> : 
                        <XCircle size={14} style={{ color: 'var(--red)' }} />
                      }
                    </td>
                    <td className="py-3 px-3">
                      <VendorRiskBadge risk={getRiskLevel(device.riskScore)} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-[12px]" style={{ color: 'var(--slate-lt)' }}>
                      {device.lastCheck}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button 
                        className="btn btn-ghost btn-sm text-[11px]"
                        style={{ color: 'var(--teal)' }}
                        onClick={() => toast.success(`Viewing ${device.name} details`)}>
                        Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}