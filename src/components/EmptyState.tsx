import { ShieldCheck, Zap, WifiOff, Brain } from 'lucide-react'

export function EmptyState() {
  const features = [
    {
      icon: ShieldCheck,
      label: 'Zero Trust',
      desc: 'Data never leaves your browser',
      color: 'text-accent-green',
      bg: 'bg-accent-green/10',
    },
    {
      icon: Zap,
      label: 'Instant AI',
      desc: 'Local inference, no API calls',
      color: 'text-primary-light',
      bg: 'bg-primary/10',
    },
    {
      icon: WifiOff,
      label: 'Offline Ready',
      desc: 'Works without internet',
      color: 'text-accent-cyan',
      bg: 'bg-accent-cyan/10',
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
      {/* Icon */}
      <div className="relative mb-6">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent-blue/10 border border-primary/15 animate-float">
          <Brain className="h-9 w-9 text-primary-light" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-7 h-7 rounded-full bg-accent-green/20 border border-accent-green/20">
          <ShieldCheck className="h-3.5 w-3.5 text-accent-green" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-gradient mb-2">
        Welcome to LocalMind
      </h2>
      <p className="text-sm text-text-secondary max-w-md mb-8 leading-relaxed">
        Upload a document or paste text, then use AI to summarize, explain, or
        ask questions — all processed locally in your browser.
      </p>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
        {features.map(({ icon: Icon, label, desc, color, bg }) => (
          <div
            key={label}
            className="glass-card rounded-xl p-4 text-center"
          >
            <div
              className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${bg} mb-2.5`}
            >
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-xs font-semibold text-text mb-0.5">{label}</p>
            <p className="text-[10px] text-text-dim leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Hint */}
      <p className="mt-8 text-[10px] text-text-dim">
        ← Start by adding content in the left panel
      </p>
    </div>
  )
}
