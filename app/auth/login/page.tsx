'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const [show, setShow]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm]     = useState({ email: '', password: '' })

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Email and password are required'); return }
    setLoading(true)
    try {
      // In production: call authApi.login() and set cookies
      await new Promise(r => setTimeout(r, 1000))
      document.cookie = "access_token=demo; path=/"
      toast.success('Welcome back!')
      
      router.push('/dashboard')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--silver)' }}>
      {/* Left — branding panel */}
      <div className="hidden lg:flex w-[480px] flex-col justify-between p-12"
        style={{ background: 'var(--navy)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white"
            style={{ background: 'var(--teal)', boxShadow: '0 0 0 3px rgba(14,124,123,.3)' }}>C</div>
          <div>
            <div className="text-white font-semibold text-[16px]">ChitiShield</div>
            <div className="text-[11px]" style={{ color: 'var(--teal-mid)' }}>GDPR & DPDPA Platform</div>
          </div>
        </div>

        <div>
          <div className="text-[32px] font-bold text-white leading-tight mb-4">
            Automated compliance<br/>
            <span style={{ color: 'var(--teal-glow)' }}>certification</span><br/>
            for modern teams.
          </div>
          <p className="text-[14px] leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,.5)' }}>
            Run GDPR and DPDPA assessments, manage data subject requests, track breaches, and issue verified compliance certificates — all in one platform.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { icon: '◈', label: 'Automated rule engine',    sub: '30 rules · GDPR & DPDPA' },
              { icon: '⏱', label: '72hr SLA clock',           sub: 'Breach notification tracking' },
              { icon: '❋', label: 'Signed certificates',      sub: 'RS256 · public verification' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-3 p-3 rounded-[8px]"
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                <span className="text-lg" style={{ color: 'var(--teal-glow)' }}>{f.icon}</span>
                <div>
                  <div className="text-[13px] font-semibold text-white">{f.label}</div>
                  <div className="text-[11px]" style={{ color: 'rgba(255,255,255,.4)' }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[11px]" style={{ color: 'rgba(255,255,255,.25)' }}>
          © 2025 ChitiShield · v1.0 · All data encrypted at rest
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h1 className="text-[26px] font-bold mb-2" style={{ color: 'var(--navy)' }}>Sign in</h1>
            <p className="text-[14px]" style={{ color: 'var(--slate-lt)' }}>
              Enter your credentials to access the compliance dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="form-label">Email address</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="form-label mb-0">Password</label>
                <button type="button" className="text-[12px] hover:underline" style={{ color: 'var(--teal)' }}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  className="form-input pr-10"
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--slate-lt)' }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'btn btn-primary w-full justify-center py-2.5 text-[14px] mt-2',
                loading && 'opacity-70 cursor-not-allowed'
              )}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 p-3 rounded-[6px] flex items-start gap-2.5 text-[12px]"
            style={{ background: 'var(--teal-lt)', border: '1px solid var(--teal-mid)', color: 'var(--slate)' }}>
            <Shield size={14} style={{ color: 'var(--teal)', marginTop: 1, flexShrink: 0 }} />
            <span>RS256 JWT authentication · AES-256 encrypted · All sessions audited</span>
          </div>
        </div>
      </div>
    </div>
  )
}
