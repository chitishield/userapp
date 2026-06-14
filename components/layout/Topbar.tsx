'use client'

import { Bell, Search, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopbarProps {
  title:    string
  subtitle?: string
  cta?:     { label: string; onClick: () => void; icon?: React.ReactNode }
}

export function Topbar({ title, subtitle, cta }: TopbarProps) {
  return (
    <header className="h-14 bg-white flex items-center px-7 gap-4 flex-shrink-0"
      style={{ borderBottom: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>

      <div className="flex-1">
        <h1 className="text-[16px] font-[650] text-navy leading-none">
          {title}
          {subtitle && <span className="text-[12px] font-normal ml-2" style={{ color: 'var(--slate-lt)' }}>{subtitle}</span>}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[13px]"
          style={{ background: 'var(--silver)', border: '1px solid var(--border)' }}>
          <Search size={13} style={{ color: 'var(--slate-lt)' }} />
          <input
            className="bg-transparent outline-none w-44 text-[13px] font-sans"
            placeholder="Search…"
            style={{ color: 'var(--navy)' }}
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded font-mono"
            style={{ background: 'var(--border)', color: 'var(--slate-lt)' }}>⌘K</kbd>
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-[6px] transition-all hover:bg-[var(--silver)]"
          style={{ border: '1px solid var(--border)' }}>
          <Bell size={14} style={{ color: 'var(--slate)' }} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--red)]" />
        </button>

        {/* CTA */}
        {cta && (
          <button className="btn btn-primary" onClick={cta.onClick}>
            {cta.icon}
            {cta.label}
          </button>
        )}
      </div>
    </header>
  )
}
