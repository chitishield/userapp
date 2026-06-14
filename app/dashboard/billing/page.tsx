'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { toast } from 'sonner'
import { CreditCard, Check, Zap, Download, ArrowUpRight, Clock } from 'lucide-react'

const CURRENT_PLAN = {
  name: 'Business Plan',
  price: '€299',
  billing_cycle: 'monthly',
  next_billing: 'Dec 15, 2025',
  features: [
    'Up to 50,000 consents/month',
    'Unlimited DSR requests',
    'Full breach management',
    'DPIA automation',
    'Priority support',
    'Custom integrations',
    'Audit log retention (7 years)',
    'Multi-user access (up to 10)'
  ]
}

const PAYMENT_METHOD = {
  type: 'visa',
  last4: '4242',
  expiry: '12/26',
  name: 'Arjun Kumar'
}

const INVOICES = [
  { id: 'INV-2025-001', date: 'Nov 15, 2025', amount: '€299.00', status: 'paid' },
  { id: 'INV-2025-002', date: 'Oct 15, 2025', amount: '€299.00', status: 'paid' },
  { id: 'INV-2025-003', date: 'Sep 15, 2025', amount: '€299.00', status: 'paid' },
  { id: 'INV-2025-004', date: 'Aug 15, 2025', amount: '€249.00', status: 'paid' },
]

const USAGE = {
  consents_used: 12847,
  consents_limit: 50000,
  dsrs_used: 42,
  dsrs_limit: -1, // unlimited
  storage_used: 2.4,
  storage_limit: 10, // GB
  users_active: 7,
  users_limit: 10
}

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleAction(action: string) {
    setLoading(action)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(null)
    toast.success(`${action} completed successfully`)
  }

  return (
    <>
      <Topbar
        title="Billing"
        subtitle="Manage your plan and payment methods"
      />

      <div className="flex-1 overflow-y-auto p-7">
        
        {/* Current Plan */}
        <div className="grid grid-cols-3 gap-5 mb-5">
          <div className="card col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>Current Plan</div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>
                  Next billing: {CURRENT_PLAN.next_billing}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  style={{ background: 'var(--green-lt)', color: 'var(--green)', border: '1px solid var(--green-bd)' }}>
                  Active
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-[28px] font-bold" style={{ color: 'var(--navy)' }}>{CURRENT_PLAN.price}</span>
              <span className="text-[13px]" style={{ color: 'var(--slate-lt)' }}>/month</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {CURRENT_PLAN.features.slice(0, 8).map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check size={14} style={{ color: 'var(--green)' }} />
                  <span className="text-[13px]" style={{ color: 'var(--slate)' }}>{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => handleAction('Upgrade requested')}
                disabled={loading === 'Upgrade requested'}
                className="btn btn-primary flex items-center gap-2">
                {loading === 'Upgrade requested' ? (
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowUpRight size={14} />
                )}
                Upgrade Plan
              </button>
              <button 
                onClick={() => handleAction('Plan cancelled')}
                disabled={loading === 'Plan cancelled'}
                className="btn btn-secondary">
                Cancel Plan
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card">
            <div className="text-[14px] font-[650] mb-4" style={{ color: 'var(--navy)' }}>Payment Method</div>
            
            <div className="p-4 rounded-[8px] mb-4" style={{ background: 'var(--navy)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-white/60">Credit Card</div>
                <div className="w-8 h-6 rounded bg-white/20 flex items-center justify-center text-[8px] font-bold text-white">
                  VISA
                </div>
              </div>
              <div className="text-lg font-mono text-white tracking-wider mb-4">
                •••• •••• •••• {PAYMENT_METHOD.last4}
              </div>
              <div className="flex items-center justify-between text-[11px] text-white/60">
                <span>{PAYMENT_METHOD.name}</span>
                <span>Expires {PAYMENT_METHOD.expiry}</span>
              </div>
            </div>

            <button 
              onClick={() => handleAction('Payment method updated')}
              disabled={loading === 'Payment method updated'}
              className="w-full btn btn-ghost flex items-center justify-center gap-2 text-[13px]"
              style={{ color: 'var(--teal)' }}>
              <CreditCard size={14} />
              Update Payment Method
            </button>
          </div>
        </div>

        {/* Usage Section */}
        <div className="card mb-5">
          <div className="text-[14px] font-[650] mb-5" style={{ color: 'var(--navy)' }}>Usage This Month</div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px]" style={{ color: 'var(--slate)' }}>Consents</span>
                <span className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>
                  {USAGE.consents_used.toLocaleString()} / {USAGE.consents_limit.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2 rounded-full mb-4" style={{ background: 'var(--silver)' }}>
                <div className="h-full rounded-full transition-all" 
                  style={{ 
                    width: `${(USAGE.consents_used / USAGE.consents_limit) * 100}%`,
                    background: 'var(--teal)'
                  }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px]" style={{ color: 'var(--slate)' }}>DSR Requests</span>
                <span className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>
                  {USAGE.dsrs_used} / Unlimited
                </span>
              </div>
              <div className="w-full h-2 rounded-full mb-4" style={{ background: 'var(--silver)' }}>
                <div className="h-full rounded-full" 
                  style={{ 
                    width: '15%',
                    background: 'var(--green)'
                  }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px]" style={{ color: 'var(--slate)' }}>Storage</span>
                <span className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>
                  {USAGE.storage_used} GB / {USAGE.storage_limit} GB
                </span>
              </div>
              <div className="w-full h-2 rounded-full mb-4" style={{ background: 'var(--silver)' }}>
                <div className="h-full rounded-full" 
                  style={{ 
                    width: `${(USAGE.storage_used / USAGE.storage_limit) * 100}%`,
                    background: 'var(--blue)'
                  }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px]" style={{ color: 'var(--slate)' }}>Active Users</span>
                <span className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>
                  {USAGE.users_active} / {USAGE.users_limit}
                </span>
              </div>
              <div className="w-full h-2 rounded-full mb-4" style={{ background: 'var(--silver)' }}>
                <div className="h-full rounded-full" 
                  style={{ 
                    width: `${(USAGE.users_active / USAGE.users_limit) * 100}%`,
                    background: 'var(--amber)'
                  }} />
              </div>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>Billing History</div>
              <div className="text-[12px] mt-0.5" style={{ color: 'var(--slate-lt)' }}>View and download past invoices</div>
            </div>
            <button className="btn btn-ghost btn-sm flex items-center gap-2" style={{ color: 'var(--teal)' }}>
              <Download size={14} />
              Export All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Invoice</th>
                  <th className="text-left py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Date</th>
                  <th className="text-left py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Amount</th>
                  <th className="text-left py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Status</th>
                  <th className="text-right py-2 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--slate-lt)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-[var(--silver)] transition-colors" 
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-3 px-3 text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>{invoice.id}</td>
                    <td className="py-3 px-3 text-[13px]" style={{ color: 'var(--slate)' }}>{invoice.date}</td>
                    <td className="py-3 px-3 text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>{invoice.amount}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ 
                          background: 'var(--green-lt)', 
                          color: 'var(--green)',
                          border: '1px solid var(--green-bd)'
                        }}>
                        {invoice.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button 
                        onClick={() => handleAction(`Invoice ${invoice.id} downloaded`)}
                        className="btn btn-ghost btn-sm text-[11px]"
                        style={{ color: 'var(--teal)' }}>
                        <Download size={12} className="inline mr-1" />
                        PDF
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