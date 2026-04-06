import { useRef, useEffect, useCallback, useState } from 'react'
import { MessageBubble } from './MessageBubble'
import { QuestionInput } from './QuestionInput'
import { useAppStore } from '../store/appStore'
import type { ActionType } from '../store/appStore'

interface ChatPanelProps {
  onAskQuestion: (question: string) => void
}

export function ChatPanel({ onAskQuestion }: ChatPanelProps) {
  const { messages, isStreaming, activeAction } = useAppStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  // Auto-scroll to bottom on new messages / streaming
  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages, messages[messages.length - 1]?.content])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (el) {
      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 100
      setShowScrollBtn(!isNearBottom && messages.length > 2)
    }
  }, [messages.length])

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-6"
      >
        {messages.map((msg, idx) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isStreaming={
              isStreaming && idx === messages.length - 1 && msg.role === 'ai'
            }
          />
        ))}
      </div>

      {/* Scroll to bottom */}
      {showScrollBtn && (
        <div className="flex justify-center -mt-4 mb-2">
          <button
            onClick={scrollToBottom}
            className="px-3 py-1 rounded-full text-[10px] font-medium bg-primary/20 text-primary-light border border-primary/20 hover:bg-primary/30 transition-colors"
          >
            ↓ New messages
          </button>
        </div>
      )}

      {/* Question Input (for "Ask" action) */}
      {activeAction === 'ask' && !isStreaming && (
        <div className="px-4 md:px-6 pb-4">
          <QuestionInput
            onSubmit={onAskQuestion}
            disabled={isStreaming}
          />
        </div>
      )}
    </div>
  )
}
