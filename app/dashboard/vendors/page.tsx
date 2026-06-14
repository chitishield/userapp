'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard, ProgressBar } from '@/components/ui'
import { VendorRiskBadge, IntegrationStatus } from '@/components/ui'
import { toast } from 'sonner'
import { 
  Building2, Shield, AlertTriangle, CheckCircle2, 
  Search, Filter, Download, Plus, ExternalLink,
  Clock, Users, Globe, Cloud, Database, MessageCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock vendor data
const VENDOR_METRICS = {
  total_vendors: 160,
  high_risk: 36,
  medium_risk: 56,
  low_risk: 68,
  reviews_in_progress: 14,
  reviews_upcoming: 3,
  recently_completed: 44,
  critical_findings: 0,
  high_findings: 20,
  medium_findings: 4,
  low_findings: 0
}

const VENDORS_BY_CATEGORY = [
  { category: 'Cloud Storage', count: 45, risk: 'high', icon: Cloud },
  { category: 'Collaboration', count: 32, risk: 'medium', icon: Users },
  { category: 'Data Analytics', count: 28, risk: 'high', icon: Database },
  { category: 'Communication', count: 22, risk: 'low', icon: MessageCircle },
  { category: 'Infrastructure', count: 18, risk: 'medium', icon: Globe },
  { category: 'Security Tools', count: 15, risk: 'low', icon: Shield },
]

const RECENT_VENDOR_REVIEWS = [
  { 
    id: 1, 
    vendor: 'JetBrains', 
    category: 'Development Tools',
    risk: 'critical',
    review_date: '2025-12-01',
    status: 'in_progress',
    findings: 3,
    owner: 'Arjun Kumar'
  },
  { 
    id: 2, 
    vendor: 'Postman', 
    category: 'API Tools',
    risk: 'critical',
    review_date: '2025-12-15',
    status: 'upcoming',
    findings: 0,
    owner: 'Priya Sharma'
  },
  { 
    id: 3, 
    vendor: 'TaskNimbus', 
    category: 'Task Management',
    risk: 'high',
    review_date: '2025-11-28',
    status: 'completed',
    findings: 2,
    owner: 'Arjun Kumar'
  },
  { 
    id: 4, 
    vendor: 'Intercom', 
    category: 'Customer Communication',
    risk: 'high',
    review_date: '2025-11-25',
    status: 'completed',
    findings: 1,
    owner: 'System'
  },
  { 
    id: 5, 
    vendor: 'Gong', 
    category: 'Sales Intelligence',
    risk: 'medium',
    review_date: '2026-01-10',
    status: 'upcoming',
    findings: 0,
    owner: 'Priya Sharma'
  },
  { 
    id: 6, 
    vendor: 'Figma', 
    category: 'Design Tools',
    risk: 'medium',
    review_date: '2025-12-05',
    status: 'in_progress',
    findings: 1,
    owner: 'System'
  },
]

export default function VendorsPage() {
  const [filterRisk, setFilterRisk] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const handleAddVendor = () => {
    toast.success('Vendor added successfully')
  }

  const handleExport = () => {
    toast.success('Vendor report exported')
  }

  return (
    <>
      <Topbar
        title="Vendor Risk Management"
        subtitle={`${VENDOR_METRICS.total_vendors} vendors monitored`}
        cta={{
          label: '+ Add Vendor',
          onClick: handleAddVendor,
          icon: <Plus size={14} />,
        }}
      />

      <div className="flex-1 overflow-y-auto p-7">
        
        {/* Vendor Stats */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <StatCard 
            label="Total Vendors" 
            value={VENDOR_METRICS.total_vendors} 
            change="↑ 1 since last week"
            changeDir="up"
            color="blue" 
            icon="🏢" 
          />
          <StatCard 
            label="High Risk Vendors" 
            value={`${Math.round((VENDOR_METRICS.high_risk / VENDOR_METRICS.total_vendors) * 100)}%`}
            change={`${VENDOR_METRICS.high_risk} vendors need attention`}
            color="red" 
            icon="⚠" 
          />
          <StatCard 
            label="Reviews In Progress" 
            value={VENDOR_METRICS.reviews_in_progress} 
            change={`${VENDOR_METRICS.reviews_upcoming} upcoming`}
            color="amber" 
            icon="⟳" 
          />
          <StatCard 
            label="Completed Reviews" 
            value={VENDOR_METRICS.recently_completed} 
            change="Last 30 days"
            changeDir="up"
            color="green" 
            icon="✓" 
          />
        </div>

        {/* Main Grid */}
        <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: '2fr 1fr' }}>
          
          {/* Vendor Reviews Progress */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>
                  Security Reviews Progress
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                  For reviews with a known due date
                </div>
              </div>
              <select 
                className="text-xs px-2 py-1 rounded border"
                style={{ borderColor: 'var(--border)' }}>
                <option>This Quarter</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>

            {/* Risk Level Distribution */}
            <div className="mb-6">
              <div className="text-[12px] font-semibold mb-3" style={{ color: 'var(--navy)' }}>
                By Risk Level
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs flex items-center gap-2" style={{ color: 'var(--red)' }}>
                      <AlertTriangle size={12} />
                      High Risk
                    </span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--navy)' }}>
                      {VENDOR_METRICS.high_risk} vendors
                    </span>
                  </div>
                  <ProgressBar 
                    value={(VENDOR_METRICS.high_risk / VENDOR_METRICS.total_vendors) * 100} 
                    color="var(--red)" 
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs flex items-center gap-2" style={{ color: 'var(--amber)' }}>
                      <AlertTriangle size={12} />
                      Medium Risk
                    </span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--navy)' }}>
                      {VENDOR_METRICS.medium_risk} vendors
                    </span>
                  </div>
                  <ProgressBar 
                    value={(VENDOR_METRICS.medium_risk / VENDOR_METRICS.total_vendors) * 100} 
                    color="var(--amber)" 
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs flex items-center gap-2" style={{ color: 'var(--green)' }}>
                      <CheckCircle2 size={12} />
                      Low Risk
                    </span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--navy)' }}>
                      {VENDOR_METRICS.low_risk} vendors
                    </span>
                  </div>
                  <ProgressBar 
                    value={(VENDOR_METRICS.low_risk / VENDOR_METRICS.total_vendors) * 100} 
                    color="var(--green)" 
                  />
                </div>
              </div>
            </div>

            {/* Findings Distribution */}
            <div>
              <div className="text-[12px] font-semibold mb-3" style={{ color: 'var(--navy)' }}>
                Discovery Results
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-[6px]" style={{ background: 'var(--red-lt)', border: '1px solid var(--red-bd)' }}>
                  <div className="text-[20px] font-bold" style={{ color: 'var(--red)' }}>
                    {VENDOR_METRICS.critical_findings}
                  </div>
                  <div className="text-[10px] font-semibold" style={{ color: 'var(--red)' }}>Critical</div>
                </div>
                <div className="p-3 rounded-[6px]" style={{ background: 'var(--amber-lt)', border: '1px solid var(--amber-bd)' }}>
                  <div className="text-[20px] font-bold" style={{ color: 'var(--amber)' }}>
                    {VENDOR_METRICS.high_findings}
                  </div>
                  <div className="text-[10px] font-semibold" style={{ color: 'var(--amber)' }}>High</div>
                </div>
                <div className="p-3 rounded-[6px]" style={{ background: 'var(--blue-lt)', border: '1px solid var(--blue-bd)' }}>
                  <div className="text-[20px] font-bold" style={{ color: 'var(--blue)' }}>
                    {VENDOR_METRICS.medium_findings}
                  </div>
                  <div className="text-[10px] font-semibold" style={{ color: 'var(--blue)' }}>Medium</div>
                </div>
                <div className="p-3 rounded-[6px]" style={{ background: 'var(--green-lt)', border: '1px solid var(--green-bd)' }}>
                  <div className="text-[20px] font-bold" style={{ color: 'var(--green)' }}>
                    {VENDOR_METRICS.low_findings}
                  </div>
                  <div className="text-[10px] font-semibold" style={{ color: 'var(--green)' }}>Low</div>
                </div>
              </div>
            </div>
          </div>

          {/* Vendor Categories */}
          <div className="space-y-5">
            <div className="card">
              <div className="text-[14px] font-[650] mb-4" style={{ color: 'var(--navy)' }}>
                Vendors by Category
              </div>
              <div className="space-y-2">
                {VENDORS_BY_CATEGORY.map(cat => {
                  const Icon = cat.icon
                  const riskColors = {
                    high: { bg: 'var(--red-lt)', color: 'var(--red)' },
                    medium: { bg: 'var(--amber-lt)', color: 'var(--amber)' },
                    low: { bg: 'var(--green-lt)', color: 'var(--green)' }
                  }
                  const riskStyle = riskColors[cat.risk as 'high' | 'medium' | 'low']
                  
                  return (
                    <div key={cat.category} 
                      className="flex items-center gap-3 px-3 py-2 rounded-[6px] hover:bg-[var(--silver)] transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: riskStyle.bg }}>
                        <Icon size={14} style={{ color: riskStyle.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>
                          {cat.category}
                        </div>
                        <div className="text-[11px]" style={{ color: 'var(--slate-lt)' }}>
                          {cat.count} vendors
                        </div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: riskStyle.bg, color: riskStyle.color }}>
                        {cat.risk.toUpperCase()}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="text-[14px] font-[650] mb-4" style={{ color: 'var(--navy)' }}>
                Actions
              </div>
              <div className="space-y-2">
                <button className="w-full btn btn-secondary text-left flex items-center gap-2 text-xs"
                  onClick={() => toast.success('Bulk assessment started')}>
                  <Shield size={14} />
                  Run Bulk Assessment
                </button>
                <button className="w-full btn btn-secondary text-left flex items-center gap-2 text-xs"
                  onClick={handleExport}>
                  <Download size={14} />
                  Export Vendor Report
                </button>
                <button className="w-full btn btn-secondary text-left flex items-center gap-2 text-xs"
                  onClick={() => toast.success('Questionnaires sent')}>
                  <ExternalLink size={14} />
                  Send Security Questionnaires
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Vendor Reviews Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>
                Recent Vendor Reviews
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                Track and manage vendor security assessments
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[13px]"
                style={{ background: 'var(--silver)', border: '1px solid var(--border)' }}>
                <Search size={13} style={{ color: 'var(--slate-lt)' }} />
                <input
                  className="bg-transparent outline-none w-48 text-[13px]"
                  placeholder="Search vendors…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ color: 'var(--navy)' }}
                />
              </div>
              <select 
                className="text-xs px-2 py-1 rounded-[6px]"
                style={{ border: '1px solid var(--border)' }}
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}>
                <option value="all">All Risks</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Vendor</th>
                  <th className="text-left py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Category</th>
                  <th className="text-left py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Risk Level</th>
                  <th className="text-left py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Review Date</th>
                  <th className="text-left py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Status</th>
                  <th className="text-left py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Findings</th>
                  <th className="text-left py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Owner</th>
                  <th className="text-right py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_VENDOR_REVIEWS.map(vendor => {
                  const riskColors: Record<string, string> = {
                    critical: 'var(--red)',
                    high: 'var(--amber)',
                    medium: 'var(--blue)',
                    low: 'var(--green)'
                  }
                  const statusColors: Record<string, { bg: string; color: string; label: string }> = {
                    in_progress: { bg: 'var(--blue-lt)', color: 'var(--blue)', label: 'In Progress' },
                    upcoming: { bg: 'var(--teal-lt)', color: 'var(--teal)', label: 'Upcoming' },
                    completed: { bg: 'var(--green-lt)', color: 'var(--green)', label: 'Completed' }
                  }
                  const status = statusColors[vendor.status]
                  
                  return (
                    <tr key={vendor.id} 
                      className="hover:bg-[var(--silver)] transition-colors"
                      style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-3 px-3">
                        <div className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>
                          {vendor.vendor}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[13px]" style={{ color: 'var(--slate)' }}>
                        {vendor.category}
                      </td>
                      <td className="py-3 px-3">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-semibold',
                          vendor.risk === 'critical' && 'bg-[var(--red-lt)] text-[var(--red)] border border-[var(--red-bd)]',
                          vendor.risk === 'high' && 'bg-[var(--amber-lt)] text-[var(--amber)] border border-[var(--amber-bd)]',
                          vendor.risk === 'medium' && 'bg-[var(--blue-lt)] text-[var(--blue)] border border-[var(--blue-bd)]'
                        )}>
                          {vendor.risk.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[13px]" style={{ color: 'var(--slate)' }}>
                        {vendor.review_date}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                          style={{ background: status.bg, color: status.color }}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {vendor.findings > 0 ? (
                          <span className="text-[13px] font-semibold" style={{ color: 'var(--red)' }}>
                            {vendor.findings} issues
                          </span>
                        ) : (
                          <span className="text-[13px]" style={{ color: 'var(--green)' }}>None</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-[13px]" style={{ color: 'var(--slate)' }}>
                        {vendor.owner}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button 
                          className="btn btn-ghost btn-sm text-[11px]"
                          style={{ color: 'var(--teal)' }}
                          onClick={() => toast.success(`Viewing ${vendor.vendor} details`)}>
                          View Details →
                        </button>
                      </td>
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