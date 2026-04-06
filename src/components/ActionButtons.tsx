import { Sparkles, BookOpen, MessageCircle, Loader2 } from 'lucide-react'
import { useAppStore, type ActionType } from '../store/appStore'

interface ActionButtonsProps {
  onAction: (action: Exclude<ActionType, null>) => void
}

export function ActionButtons({ onAction }: ActionButtonsProps) {
  const { documentText, modelStatus, isStreaming, activeAction } = useAppStore()
  const isDisabled = !documentText.trim() || modelStatus !== 'ready' || isStreaming

  const actions = [
    {
      id: 'summarize' as const,
      label: 'Summarize',
      icon: Sparkles,
      gradient: 'from-violet-500 to-purple-600',
      glow: 'shadow-violet-500/25',
      description: 'Get key points',
    },
    {
      id: 'explain' as const,
      label: 'Explain',
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/25',
      description: 'Simplify content',
    },
    {
      id: 'ask' as const,
      label: 'Ask Question',
      icon: MessageCircle,
      gradient: 'from-emerald-500 to-teal-500',
      glow: 'shadow-emerald-500/25',
      description: 'Chat with context',
    },
  ]

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-text-muted uppercase tracking-wider px-1">
        AI Actions
      </p>
      <div className="grid gap-2">
        {actions.map(({ id, label, icon: Icon, gradient, glow, description }) => {
          const isActive = activeAction === id && isStreaming

          return (
            <button
              key={id}
              id={`action-${id}`}
              disabled={isDisabled}
              onClick={() => onAction(id)}
              className={`group relative flex items-center gap-3 w-full px-4 py-3 rounded-xl border transition-all duration-300
                ${
                  isDisabled
                    ? 'border-border/50 opacity-40 cursor-not-allowed'
                    : 'border-border hover:border-border-bright cursor-pointer'
                }
                ${isActive ? 'border-primary/30 bg-primary/5' : 'bg-white/[0.02] hover:bg-white/[0.04]'}
              `}
            >
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br ${gradient} ${glow} shadow-lg transition-transform
                  ${!isDisabled ? 'group-hover:scale-105' : ''}
                `}
              >
                {isActive ? (
                  <Loader2 className="h-4 w-4 text-white animate-spin" />
                ) : (
                  <Icon className="h-4 w-4 text-white" />
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-text">{label}</p>
                <p className="text-[10px] text-text-dim">{description}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Status Hints */}
      {modelStatus !== 'ready' && (
        <p className="text-[10px] text-text-dim px-1 text-center">
          Load a model first to use AI actions
        </p>
      )}
      {modelStatus === 'ready' && !documentText.trim() && (
        <p className="text-[10px] text-text-dim px-1 text-center">
          Add some text or upload a file to get started
        </p>
      )}
    </div>
  )
}
