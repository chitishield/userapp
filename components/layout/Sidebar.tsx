// 'use client'

// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { cn } from '@/lib/utils'
// import {
//   LayoutDashboard, ClipboardCheck, ShieldCheck, FileText,
//   AlertTriangle, Map, Award, ScrollText, CreditCard,
//   Settings, LogOut, ChevronDown, Zap,
// } from 'lucide-react'

// interface NavItem {
//   label:    string
//   href:     string
//   icon:     React.ReactNode
//   badge?:   number
//   badgeColor?: string
//   isLive?:  boolean
// }

// const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
//   {
//     label: 'Overview',
//     items: [
//       { label: 'Dashboard',    href: '/dashboard',             icon: <LayoutDashboard size={15}/> },
//       { label: 'Assessment',   href: '/dashboard/assessment',  icon: <ClipboardCheck size={15}/>,  isLive: true },
//     ],
//   },
//   {
//     label: 'Compliance',
//     items: [
//       { label: 'Consent',      href: '/dashboard/consent',     icon: <ShieldCheck size={15}/> },
//       { label: 'DSR Requests', href: '/dashboard/dsr',         icon: <FileText size={15}/>,  badge: 3 },
//       { label: 'Breaches',     href: '/dashboard/breaches',    icon: <AlertTriangle size={15}/>, badge: 1, badgeColor: 'bg-[var(--red)]' },
//       { label: 'Data Map',     href: '/dashboard/data-map',    icon: <Map size={15}/> },
//     ],
//   },
//   {
//     label: 'Certification',
//     items: [
//       { label: 'Certificates', href: '/dashboard/certificates', icon: <Award size={15}/> },
//       { label: 'Audit Log',    href: '/dashboard/audit',        icon: <ScrollText size={15}/> },
//     ],
//   },
//   {
//     label: 'Settings',
//     items: [
//       { label: 'Billing',      href: '/dashboard/billing',      icon: <CreditCard size={15}/> },
//       { label: 'Settings',     href: '/dashboard/settings',     icon: <Settings size={15}/> },
//     ],
//   },
// ]

// export function Sidebar() {
//   const pathname = usePathname()

//   return (
//     <aside className="w-[232px] min-w-[232px] flex flex-col" style={{ background: 'var(--navy)' }}>

//       {/* Logo */}
//       <div className="px-5 py-[22px] pb-[18px]" style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
//         <div className="flex items-center gap-2.5">
//           <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center text-white font-bold text-base flex-shrink-0"
//             style={{ background: 'var(--teal)', boxShadow: '0 0 0 3px rgba(14,124,123,.25)' }}>
//             C
//           </div>
//           <div>
//             <div className="text-white font-semibold text-[15px] tracking-[-0.2px]">ChitiShield</div>
//             <div className="text-[10px] font-normal tracking-[.3px]" style={{ color: 'var(--teal-mid)' }}>v1.0 · GDPR Platform</div>
//           </div>
//         </div>
//       </div>

//       {/* Tenant selector */}
//       <div className="mx-3.5 mt-4 mb-2 rounded-[6px] p-2.5 flex items-center gap-2.5 cursor-pointer transition-all"
//         style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
//         <div className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
//           style={{ background: 'linear-gradient(135deg, var(--teal) 0%, #065F5F 100%)' }}>
//           AC
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="text-xs font-semibold text-white truncate">Acme Technologies</div>
//           <div className="text-[10px] font-medium" style={{ color: 'var(--teal-mid)' }}>🇪🇺 GDPR · Business Plan</div>
//         </div>
//         <ChevronDown size={12} style={{ color: 'rgba(255,255,255,.3)' }} />
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-2.5 py-2.5 overflow-y-auto">
//         {NAV_SECTIONS.map(section => (
//           <div key={section.label} className="mb-1">
//             <div className="px-2.5 py-2 pb-1 text-[10px] font-semibold uppercase tracking-[.8px]"
//               style={{ color: 'rgba(255,255,255,.3)' }}>
//               {section.label}
//             </div>
//             {section.items.map(item => {
//               const active = pathname === item.href ||
//                 (item.href !== '/dashboard' && pathname.startsWith(item.href))
//               return (
//                 <Link key={item.href} href={item.href}>
//                   <div className={cn('nav-item', active && 'active')}>
//                     <span className="w-4 text-center">{item.icon}</span>
//                     <span className="flex-1">{item.label}</span>
//                     {item.isLive && (
//                       <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
//                         style={{ background: 'rgba(14,124,123,.2)', border: '1px solid rgba(14,124,123,.3)', color: 'var(--teal-glow)' }}>
//                         Live
//                       </span>
//                     )}
//                     {item.badge !== undefined && (
//                       <span className={cn(
//                         'text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center text-white',
//                         item.badgeColor || 'bg-[var(--red)]'
//                       )}>
//                         {item.badge}
//                       </span>
//                     )}
//                   </div>
//                 </Link>
//               )
//             })}
//           </div>
//         ))}
//       </nav>

//       {/* User footer */}
//       <div className="px-3.5 py-3 flex items-center gap-2.5"
//         style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
//         <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
//           style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
//           AK
//         </div>
//         <div className="flex-1">
//           <div className="text-xs font-semibold text-white">Arjun Kumar</div>
//           <div className="text-[10px]" style={{ color: 'rgba(255,255,255,.4)' }}>Owner</div>
//         </div>
//         <button className="p-1 rounded transition-all hover:bg-white/10" style={{ color: 'rgba(255,255,255,.3)' }}
//           title="Logout">
//           <LogOut size={13} />
//         </button>
//       </div>
//     </aside>
//   )
// }


// 'use client'

// import Link from 'next/link'
// import { usePathname, useRouter } from 'next/navigation'
// import { cn } from '@/lib/utils'
// import {
//   LayoutDashboard, ClipboardCheck, ShieldCheck, FileText,
//   AlertTriangle, Map, Award, ScrollText, CreditCard,
//   Settings, LogOut, ChevronDown, Zap,
// } from 'lucide-react'

// interface NavItem {
//   label:    string
//   href:     string
//   icon:     React.ReactNode
//   badge?:   number
//   badgeColor?: string
//   isLive?:  boolean
// }

// const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
//   {
//     label: 'Overview',
//     items: [
//       { label: 'Dashboard',    href: '/dashboard',             icon: <LayoutDashboard size={15}/> },
//       { label: 'Assessment',   href: '/dashboard/assessment',  icon: <ClipboardCheck size={15}/>,  isLive: true },
//     ],
//   },
//   {
//     label: 'Compliance',
//     items: [
//       { label: 'Consent',      href: '/dashboard/consent',     icon: <ShieldCheck size={15}/> },
//       { label: 'DSR Requests', href: '/dashboard/dsr',         icon: <FileText size={15}/>,  badge: 3 },
//       { label: 'Breaches',     href: '/dashboard/breaches',    icon: <AlertTriangle size={15}/>, badge: 1, badgeColor: 'bg-[var(--red)]' },
//       { label: 'Data Map',     href: '/dashboard/data-map',    icon: <Map size={15}/> },
//     ],
//   },
//   {
//     label: 'Certification',
//     items: [
//       { label: 'Certificates', href: '/dashboard/certificates', icon: <Award size={15}/> },
//       { label: 'Audit Log',    href: '/dashboard/audit',        icon: <ScrollText size={15}/> },
//     ],
//   },
//   {
//     label: 'Settings',
//     items: [
//       { label: 'Billing',      href: '/dashboard/billing',      icon: <CreditCard size={15}/> },
//       { label: 'Settings',     href: '/dashboard/settings',     icon: <Settings size={15}/> },
//     ],
//   },
// ]

// export function Sidebar() {
//   const pathname = usePathname()
//   const router = useRouter()

//   const handleLogout = () => {
//     // Clear the access token cookie
//     document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
//     // Redirect to login page
//     router.push('/auth/login')
//   }

//   return (
//     <aside className="w-[232px] min-w-[232px] flex flex-col" style={{ background: 'var(--navy)' }}>

//       {/* Logo */}
//       <div className="px-5 py-[22px] pb-[18px]" style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
//         <div className="flex items-center gap-2.5">
//           <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center text-white font-bold text-base flex-shrink-0"
//             style={{ background: 'var(--teal)', boxShadow: '0 0 0 3px rgba(14,124,123,.25)' }}>
//             C
//           </div>
//           <div>
//             <div className="text-white font-semibold text-[15px] tracking-[-0.2px]">ChitiShield</div>
//             <div className="text-[10px] font-normal tracking-[.3px]" style={{ color: 'var(--teal-mid)' }}>v1.0 · GDPR Platform</div>
//           </div>
//         </div>
//       </div>

//       {/* Tenant selector */}
//       <div className="mx-3.5 mt-4 mb-2 rounded-[6px] p-2.5 flex items-center gap-2.5 cursor-pointer transition-all"
//         style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
//         <div className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
//           style={{ background: 'linear-gradient(135deg, var(--teal) 0%, #065F5F 100%)' }}>
//           AC
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="text-xs font-semibold text-white truncate">Acme Technologies</div>
//           <div className="text-[10px] font-medium" style={{ color: 'var(--teal-mid)' }}>🇪🇺 GDPR · Business Plan</div>
//         </div>
//         <ChevronDown size={12} style={{ color: 'rgba(255,255,255,.3)' }} />
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-2.5 py-2.5 overflow-y-auto">
//         {NAV_SECTIONS.map(section => (
//           <div key={section.label} className="mb-1">
//             <div className="px-2.5 py-2 pb-1 text-[10px] font-semibold uppercase tracking-[.8px]"
//               style={{ color: 'rgba(255,255,255,.3)' }}>
//               {section.label}
//             </div>
//             {section.items.map(item => {
//               const active = pathname === item.href ||
//                 (item.href !== '/dashboard' && pathname.startsWith(item.href))
//               return (
//                 <Link key={item.href} href={item.href}>
//                   <div className={cn('nav-item', active && 'active')}>
//                     <span className="w-4 text-center">{item.icon}</span>
//                     <span className="flex-1">{item.label}</span>
//                     {item.isLive && (
//                       <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
//                         style={{ background: 'rgba(14,124,123,.2)', border: '1px solid rgba(14,124,123,.3)', color: 'var(--teal-glow)' }}>
//                         Live
//                       </span>
//                     )}
//                     {item.badge !== undefined && (
//                       <span className={cn(
//                         'text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center text-white',
//                         item.badgeColor || 'bg-[var(--red)]'
//                       )}>
//                         {item.badge}
//                       </span>
//                     )}
//                   </div>
//                 </Link>
//               )
//             })}
//           </div>
//         ))}
//       </nav>

//       {/* User footer */}
//       <div className="px-3.5 py-3 flex items-center gap-2.5"
//         style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
//         <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
//           style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
//           AK
//         </div>
//         <div className="flex-1">
//           <div className="text-xs font-semibold text-white">Arjun Kumar</div>
//           <div className="text-[10px]" style={{ color: 'rgba(255,255,255,.4)' }}>Owner</div>
//         </div>
//         <button 
//           onClick={handleLogout}
//           className="p-1 rounded transition-all hover:bg-white/10" 
//           style={{ color: 'rgba(255,255,255,.3)' }}
//           title="Logout">
//           <LogOut size={13} />
//         </button>
//       </div>
//     </aside>
//   )
// }



// updated with multi certificates

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, ClipboardCheck, ShieldCheck, FileText,
  AlertTriangle, Map, Award, ScrollText, CreditCard,
  Settings, LogOut, ChevronDown, Zap, Globe, Shield,
  Building2, Stethoscope, Plus, CheckCircle2, FileCheck, Clock
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  label:    string
  href:     string
  icon:     React.ReactNode
  badge?:   number
  badgeColor?: string
  isLive?:  boolean
}

// Define the type for regulations
type Regulation = 'gdpr' | 'dpdpt' | 'soc2' | 'hipaa'

interface RegulationConfig {
  name: string
  flag: string
  color: string
  bg: string
}

interface Certificate {
  type: Regulation
  status: 'active' | 'pending' | 'expired'
  expires: string | null
  icon: React.ComponentType<any>
}

// Regulation-specific configurations with proper typing
const REGULATIONS: Record<Regulation, RegulationConfig> = {
  gdpr: {
    name: 'GDPR',
    flag: '🇪🇺',
    color: 'var(--blue)',
    bg: 'var(--blue-lt)'
  },
  dpdpt: {
    name: 'DPDPT',
    flag: '🇮🇳', 
    color: 'var(--amber)',
    bg: 'var(--amber-lt)'
  },
  soc2: {
    name: 'SOC 2',
    flag: '🇺🇸',
    color: 'var(--purple)',
    bg: 'var(--purple-lt)'
  },
  hipaa: {
    name: 'HIPAA',
    flag: '🇺🇸',
    color: 'var(--red)',
    bg: 'var(--red-lt)'
  }
}

// Active regulations for the tenant
const ACTIVE_REGULATIONS: Regulation[] = ['gdpr', 'dpdpt']

// Certificates earned
const CERTIFICATES: Certificate[] = [
  { type: 'gdpr', status: 'active', expires: 'Dec 2025', icon: Globe },
  { type: 'dpdpt', status: 'pending', expires: null, icon: Shield },
]

// const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
//   {
//     label: 'Overview',
//     items: [
//       { label: 'Dashboard',    href: '/dashboard',             icon: <LayoutDashboard size={15}/> },
//       { label: 'Assessment',   href: '/dashboard/assessment',  icon: <ClipboardCheck size={15}/>,  isLive: true },
//     ],
//   },
//   {
//     label: 'Compliance',
//     items: [
//       { label: 'Consent',      href: '/dashboard/consent',     icon: <ShieldCheck size={15}/> },
//       { label: 'DSR Requests', href: '/dashboard/dsr',         icon: <FileText size={15}/>,  badge: 3 },
//       { label: 'Breaches',     href: '/dashboard/breaches',    icon: <AlertTriangle size={15}/>, badge: 1, badgeColor: 'bg-[var(--red)]' },
//       { label: 'Data Map',     href: '/dashboard/data-map',    icon: <Map size={15}/> },
//     ],
//   },
//   {
//     label: 'Certification',
//     items: [
//       { label: 'Certificates', href: '/dashboard/certificates', icon: <Award size={15}/> },
//       { label: 'Audit Log',    href: '/dashboard/audit',        icon: <ScrollText size={15}/> },
//     ],
//   },
//   {
//     label: 'Settings',
//     items: [
//       { label: 'Billing',      href: '/dashboard/billing',      icon: <CreditCard size={15}/> },
//       { label: 'Settings',     href: '/dashboard/settings',     icon: <Settings size={15}/> },
//     ],
//   },
// ]

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard',    href: '/dashboard',             icon: <LayoutDashboard size={15}/> },
      { label: 'Assessment',   href: '/dashboard/assessment',  icon: <ClipboardCheck size={15}/>,  isLive: true },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { label: 'Consent',      href: '/dashboard/consent',     icon: <ShieldCheck size={15}/> },
      { label: 'DSR Requests', href: '/dashboard/dsr',         icon: <FileText size={15}/>,  badge: 3 },
      { label: 'Breaches',     href: '/dashboard/breaches',    icon: <AlertTriangle size={15}/>, badge: 1, badgeColor: 'bg-[var(--red)]' },
      { label: 'Data Map',     href: '/dashboard/data-map',    icon: <Map size={15}/> },
      { label: 'Vendors',      href: '/dashboard/vendors',     icon: <Building2 size={15}/>, badge: 14 },
      { label: 'Evidence',     href: '/dashboard/evidence',    icon: <FileCheck size={15}/> },
    ],
  },
  {
    label: 'Certification',
    items: [
      { label: 'Certificates', href: '/dashboard/certificates', icon: <Award size={15}/> },
      { label: 'Audit Log',    href: '/dashboard/audit',        icon: <ScrollText size={15}/> },
      { label: 'Timeline',     href: '/dashboard/timeline',     icon: <Clock size={15}/> },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Integrations', href: '/dashboard/integrations', icon: <Zap size={15}/> },
      { label: 'Billing',      href: '/dashboard/billing',      icon: <CreditCard size={15}/> },
      { label: 'Settings',     href: '/dashboard/settings',     icon: <Settings size={15}/> },
    ],
  },
  
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [activeRegulation, setActiveRegulation] = useState<Regulation>('gdpr')

  const handleLogout = () => {
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push('/auth/login')
  }

  // Helper function to safely get regulation config
  const getRegulationConfig = (reg: Regulation): RegulationConfig => {
    return REGULATIONS[reg]
  }

  return (
    <aside className="w-[232px] min-w-[232px] flex flex-col" style={{ background: 'var(--navy)' }}>

      {/* Logo */}
      <div className="px-5 py-[22px] pb-[18px]" style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center text-white font-bold text-base flex-shrink-0"
            style={{ background: 'var(--teal)', boxShadow: '0 0 0 3px rgba(14,124,123,.25)' }}>
            C
          </div>
          <div>
            <div className="text-white font-semibold text-[15px] tracking-[-0.2px]">ChitiShield</div>
            <div className="text-[10px] font-normal tracking-[.3px]" style={{ color: 'var(--teal-mid)' }}>Multi-Regulation Platform</div>
          </div>
        </div>
      </div>

      {/* Tenant & Regulation Selector */}
      <div className="mx-3.5 mt-4 space-y-2">
        {/* Tenant Selector */}
        <div className="rounded-[6px] p-2.5 flex items-center gap-2.5 cursor-pointer transition-all"
          style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
          <div className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--teal) 0%, #065F5F 100%)' }}>
            AC
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">Acme Technologies</div>
            <div className="text-[10px] font-medium" style={{ color: 'var(--teal-mid)' }}>
              Business Plan · {ACTIVE_REGULATIONS.length} Regulations
            </div>
          </div>
          <ChevronDown size={12} style={{ color: 'rgba(255,255,255,.3)' }} />
        </div>

        {/* Active Regulations Pills */}
        <div className="flex gap-1.5 flex-wrap">
          {ACTIVE_REGULATIONS.map(reg => {
            const config = getRegulationConfig(reg)
            return (
              <button
                key={reg}
                onClick={() => setActiveRegulation(reg)}
                className={cn(
                  'text-[10px] px-2 py-1 rounded-full font-medium transition-all flex items-center gap-1',
                  activeRegulation === reg 
                    ? 'bg-white/15 text-white' 
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                )}
                style={{
                  border: `1px solid ${activeRegulation === reg ? config.color : 'rgba(255,255,255,0.1)'}`
                }}>
                <span>{config.flag}</span>
                {config.name}
              </button>
            )
          })}
          <button className="text-[10px] px-1.5 py-1 rounded-full bg-white/5 text-white/40 hover:bg-white/10 transition-all border border-dashed border-white/10">
            <Plus size={10} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-2.5 overflow-y-auto">
        {NAV_SECTIONS.map(section => (
          <div key={section.label} className="mb-1">
            <div className="px-2.5 py-2 pb-1 text-[10px] font-semibold uppercase tracking-[.8px]"
              style={{ color: 'rgba(255,255,255,.3)' }}>
              {section.label}
            </div>
            {section.items.map(item => {
              const active = pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn('nav-item', active && 'active')}>
                    <span className="w-4 text-center">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {item.isLive && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: 'rgba(14,124,123,.2)', border: '1px solid rgba(14,124,123,.3)', color: 'var(--teal-glow)' }}>
                        Live
                      </span>
                    )}
                    {item.badge !== undefined && (
                      <span className={cn(
                        'text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center text-white',
                        item.badgeColor || 'bg-[var(--red)]'
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Certificates Status Bar */}
      <div className="px-2.5 pb-2">
        <div className="px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[.8px]"
          style={{ color: 'rgba(255,255,255,.3)' }}>
          Certificates
        </div>
        <div className="space-y-1">
          {CERTIFICATES.map(cert => {
            const Icon = cert.icon
            const config = getRegulationConfig(cert.type)
            return (
              <div key={cert.type}
                className="flex items-center gap-2 px-2 py-1.5 rounded-[4px] text-[11px]"
                style={{ background: 'rgba(255,255,255,.03)' }}>
                <Icon size={12} style={{ color: config.color }} />
                <span className="text-white/70">{config.name}</span>
                {cert.status === 'active' ? (
                  <CheckCircle2 size={10} style={{ color: 'var(--green)' }} />
                ) : (
                  <span className="text-[9px] px-1 py-0.5 rounded-full bg-amber/20 text-amber-400 ml-auto">
                    Pending
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* User footer */}
      <div className="px-3.5 py-3 flex items-center gap-2.5"
        style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          AK
        </div>
        <div className="flex-1">
          <div className="text-xs font-semibold text-white">Arjun Kumar</div>
          <div className="text-[10px]" style={{ color: 'rgba(255,255,255,.4)' }}>Compliance Officer</div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-1 rounded transition-all hover:bg-white/10" 
          style={{ color: 'rgba(255,255,255,.3)' }}
          title="Logout">
          <LogOut size={13} />
        </button>
      </div>
    </aside>
  )
}