import { Brain, Cpu, Download, Loader2 } from 'lucide-react'
import { PrivacyBadge } from './PrivacyBadge'
import { useAppStore } from '../store/appStore'

export function TopBar() {
  const { modelStatus, downloadProgress, accelerationMode } = useAppStore()

  const getModelStatusDisplay = () => {
    switch (modelStatus) {
      case 'idle':
        return (
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-text-dim" />
            Model not loaded
          </span>
        )
      case 'downloading':
        return (
          <span className="flex items-center gap-1.5 text-xs text-accent-blue">
            <Download className="h-3 w-3 animate-bounce" />
            Downloading {Math.round(downloadProgress * 100)}%
          </span>
        )
      case 'loading':
        return (
          <span className="flex items-center gap-1.5 text-xs text-primary-light">
            <Loader2 className="h-3 w-3 animate-spin" />
            Loading model...
          </span>
        )
      case 'ready':
        return (
          <span className="flex items-center gap-1.5 text-xs text-accent-green">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
            Ready
            {accelerationMode && (
              <span className="flex items-center gap-0.5 text-text-dim">
                <Cpu className="h-2.5 w-2.5" />
                {accelerationMode}
              </span>
            )}
          </span>
        )
      case 'error':
        return (
          <span className="flex items-center gap-1.5 text-xs text-accent-rose">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-rose" />
            Error
          </span>
        )
    }
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark shadow-lg shadow-primary/20">
            <Brain className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-tight text-gradient">
              LocalMind
            </h1>
            <span className="text-[10px] text-text-dim font-medium -mt-0.5 hidden sm:block">
              Zero-Trust AI Workspace
            </span>
          </div>
        </div>

        {/* Center: Privacy Badge */}
        <div className="hidden sm:block">
          <PrivacyBadge />
        </div>

        {/* Right: Model Status */}
        <div className="flex items-center gap-3">
          <div className="sm:hidden">
            <PrivacyBadge compact />
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <Cpu className="h-3.5 w-3.5 text-text-muted" />
            {getModelStatusDisplay()}
          </div>
        </div>
      </div>

      {/* Download Progress Bar */}
      {modelStatus === 'downloading' && (
        <div className="progress-bar mx-4 md:mx-6 mb-1">
          <div
            className="progress-fill"
            style={{ width: `${downloadProgress * 100}%` }}
          />
        </div>
      )}
    </header>
  )
}
