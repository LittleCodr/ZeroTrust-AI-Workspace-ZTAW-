import { Copy, Check, Sparkles, BookOpen, MessageCircle, User } from 'lucide-react'
import { useState } from 'react'
import type { Message } from '../store/appStore'

interface MessageBubbleProps {
  message: Message
  isStreaming?: boolean
}

export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isAi = message.role === 'ai'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getActionIcon = () => {
    switch (message.action) {
      case 'summarize':
        return <Sparkles className="h-3.5 w-3.5" />
      case 'explain':
        return <BookOpen className="h-3.5 w-3.5" />
      case 'ask':
        return <MessageCircle className="h-3.5 w-3.5" />
      default:
        return null
    }
  }

  const getActionLabel = () => {
    switch (message.action) {
      case 'summarize':
        return 'Summary'
      case 'explain':
        return 'Explanation'
      case 'ask':
        return 'Answer'
      default:
        return ''
    }
  }

  return (
    <div
      className={`animate-fade-in ${
        isAi ? 'animate-slide-left' : 'animate-slide-right'
      }`}
    >
      <div
        className={`flex gap-3 ${isAi ? '' : 'flex-row-reverse'}`}
      >
        {/* Avatar */}
        <div
          className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-lg mt-0.5 ${
            isAi
              ? 'bg-gradient-to-br from-primary to-primary-dark'
              : 'bg-white/[0.06] border border-border'
          }`}
        >
          {isAi ? (
            <Sparkles className="h-3.5 w-3.5 text-white" />
          ) : (
            <User className="h-3.5 w-3.5 text-text-muted" />
          )}
        </div>

        {/* Content */}
        <div className={`flex-1 min-w-0 ${isAi ? 'mr-8' : 'ml-8'}`}>
          {/* Action Label */}
          {isAi && message.action && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-primary-light">{getActionIcon()}</span>
              <span className="text-[10px] font-semibold text-primary-light uppercase tracking-wider">
                {getActionLabel()}
              </span>
            </div>
          )}

          {/* Message Body */}
          <div
            className={`rounded-xl px-4 py-3 ${
              isAi
                ? 'glass-card'
                : 'bg-primary/10 border border-primary/15'
            }`}
          >
            <div
              className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
                isAi ? 'text-text-secondary' : 'text-text'
              } ${isStreaming && isAi ? 'streaming-cursor' : ''}`}
            >
              {message.content || (
                <span className="shimmer inline-block w-32 h-4" />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-1.5 px-1">
            <span className="text-[9px] text-text-dim">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>

            <div className="flex items-center gap-2">
              {/* Metrics */}
              {message.metrics && (
                <span className="text-[9px] text-text-dim font-mono">
                  {message.metrics.tokensPerSecond.toFixed(1)} tok/s •{' '}
                  {message.metrics.latencyMs}ms
                </span>
              )}

              {/* Copy */}
              {isAi && message.content && !isStreaming && (
                <button
                  onClick={handleCopy}
                  className="p-1 rounded hover:bg-white/5 text-text-dim hover:text-text-secondary transition-colors"
                  title="Copy response"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-accent-green" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
