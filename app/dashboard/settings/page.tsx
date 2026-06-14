'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { toast } from 'sonner'
import { Save, Mail, User, Building, Globe, Shield, Bell, Key } from 'lucide-react'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  
  const [profile, setProfile] = useState({
    name: 'Arjun Kumar',
    email: 'arjun@acmetech.com',
    company: 'Acme Technologies',
    website: 'https://acmetech.com',
    role: 'Data Protection Officer',
    phone: '+31 6 1234 5678'
  })

  const [notifications, setNotifications] = useState({
    breach_alerts: true,
    dsr_deadline: true,
    assessment_reminder: true,
    weekly_report: false,
    consent_expiry: true
  })

  const [security, setSecurity] = useState({
    mfa_enabled: true,
    session_timeout: '30',
    ip_whitelisting: false
  })

  async function handleSave() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    toast.success('Settings saved successfully')
  }

  return (
    <>
      <Topbar
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      <div className="flex-1 overflow-y-auto p-7">
        
        {/* Profile Section */}
        <div className="card mb-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
              style={{ background: 'var(--blue-lt)' }}>
              <User size={16} style={{ color: 'var(--blue)' }} />
            </div>
            <div>
              <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>Profile Information</div>
              <div className="text-[12px]" style={{ color: 'var(--slate-lt)' }}>Update your personal and company details</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--navy)' }}>Full Name</label>
              <input 
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 rounded-[6px] text-[13px] outline-none focus:ring-2 focus:ring-[var(--teal)] focus:border-transparent"
                style={{ border: '1px solid var(--border)', color: 'var(--navy)' }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--navy)' }}>Email</label>
              <input 
                type="email"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 rounded-[6px] text-[13px] outline-none focus:ring-2 focus:ring-[var(--teal)] focus:border-transparent"
                style={{ border: '1px solid var(--border)', color: 'var(--navy)' }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--navy)' }}>Company</label>
              <input 
                type="text"
                value={profile.company}
                onChange={e => setProfile({ ...profile, company: e.target.value })}
                className="w-full px-3 py-2 rounded-[6px] text-[13px] outline-none focus:ring-2 focus:ring-[var(--teal)] focus:border-transparent"
                style={{ border: '1px solid var(--border)', color: 'var(--navy)' }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--navy)' }}>Website</label>
              <input 
                type="url"
                value={profile.website}
                onChange={e => setProfile({ ...profile, website: e.target.value })}
                className="w-full px-3 py-2 rounded-[6px] text-[13px] outline-none focus:ring-2 focus:ring-[var(--teal)] focus:border-transparent"
                style={{ border: '1px solid var(--border)', color: 'var(--navy)' }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--navy)' }}>Role</label>
              <input 
                type="text"
                value={profile.role}
                onChange={e => setProfile({ ...profile, role: e.target.value })}
                className="w-full px-3 py-2 rounded-[6px] text-[13px] outline-none focus:ring-2 focus:ring-[var(--teal)] focus:border-transparent"
                style={{ border: '1px solid var(--border)', color: 'var(--navy)' }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--navy)' }}>Phone</label>
              <input 
                type="tel"
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-[6px] text-[13px] outline-none focus:ring-2 focus:ring-[var(--teal)] focus:border-transparent"
                style={{ border: '1px solid var(--border)', color: 'var(--navy)' }}
              />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="card mb-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
              style={{ background: 'var(--amber-lt)' }}>
              <Bell size={16} style={{ color: 'var(--amber)' }} />
            </div>
            <div>
              <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>Notification Preferences</div>
              <div className="text-[12px]" style={{ color: 'var(--slate-lt)' }}>Choose what alerts you want to receive</div>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2 px-3 rounded-[6px] hover:bg-[var(--silver)] transition-colors"
                style={{ border: '1px solid transparent' }}>
                <div>
                  <div className="text-[13px] font-semibold capitalize" style={{ color: 'var(--navy)' }}>
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--slate-lt)' }}>
                    {key === 'breach_alerts' && 'Get notified immediately about data breaches'}
                    {key === 'dsr_deadline' && 'Reminders before DSR deadlines expire'}
                    {key === 'assessment_reminder' && 'Monthly compliance assessment reminders'}
                    {key === 'weekly_report' && 'Receive weekly compliance summary reports'}
                    {key === 'consent_expiry' && 'Alerts when consent records are about to expire'}
                  </div>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [key]: !value })}
                  className="relative w-9 h-5 rounded-full transition-colors duration-200"
                  style={{ background: value ? 'var(--teal)' : 'var(--border)' }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                    style={{ left: value ? 'calc(100% - 18px)' : '2px' }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security Section */}
        <div className="card mb-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
              style={{ background: 'var(--red-lt)' }}>
              <Shield size={16} style={{ color: 'var(--red)' }} />
            </div>
            <div>
              <div className="text-[14px] font-[650]" style={{ color: 'var(--navy)' }}>Security Settings</div>
              <div className="text-[12px]" style={{ color: 'var(--slate-lt)' }}>Manage your account security preferences</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 px-3 rounded-[6px]">
              <div>
                <div className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>Two-Factor Authentication</div>
                <div className="text-[11px]" style={{ color: 'var(--slate-lt)' }}>Add an extra layer of security to your account</div>
              </div>
              <button
                onClick={() => setSecurity({ ...security, mfa_enabled: !security.mfa_enabled })}
                className="relative w-9 h-5 rounded-full transition-colors duration-200"
                style={{ background: security.mfa_enabled ? 'var(--teal)' : 'var(--border)' }}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ left: security.mfa_enabled ? 'calc(100% - 18px)' : '2px' }} />
              </button>
            </div>

            <div className="flex items-center justify-between py-2 px-3 rounded-[6px]">
              <div>
                <div className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>Session Timeout (minutes)</div>
                <div className="text-[11px]" style={{ color: 'var(--slate-lt)' }}>Auto-logout after period of inactivity</div>
              </div>
              <select
                value={security.session_timeout}
                onChange={e => setSecurity({ ...security, session_timeout: e.target.value })}
                className="w-24 px-2 py-1.5 rounded-[6px] text-[13px] outline-none"
                style={{ border: '1px solid var(--border)', color: 'var(--navy)' }}>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-2 px-3 rounded-[6px]">
              <div>
                <div className="text-[13px] font-semibold" style={{ color: 'var(--navy)' }}>IP Whitelisting</div>
                <div className="text-[11px]" style={{ color: 'var(--slate-lt)' }}>Restrict access to specific IP addresses</div>
              </div>
              <button
                onClick={() => setSecurity({ ...security, ip_whitelisting: !security.ip_whitelisting })}
                className="relative w-9 h-5 rounded-full transition-colors duration-200"
                style={{ background: security.ip_whitelisting ? 'var(--teal)' : 'var(--border)' }}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ left: security.ip_whitelisting ? 'calc(100% - 18px)' : '2px' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary flex items-center gap-2">
            {saving ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save size={14} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}