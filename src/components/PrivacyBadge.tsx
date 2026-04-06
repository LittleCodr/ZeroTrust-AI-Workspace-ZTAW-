import { Shield, ShieldCheck } from 'lucide-react'

interface PrivacyBadgeProps {
  compact?: boolean
}

export function PrivacyBadge({ compact = false }: PrivacyBadgeProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Main Badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">
          Running Locally
        </span>
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
      </div>

      {/* Secondary Badge */}
      {!compact && (
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
          <Shield className="h-3 w-3 text-text-muted" />
          <span className="text-[10px] font-medium text-text-muted tracking-wide">
            No data sent externally
          </span>
        </div>
      )}
    </div>
  )
}
