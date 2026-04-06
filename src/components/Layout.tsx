import { TopBar } from './TopBar'
import { InputPanel } from './InputPanel'
import { ChatPanel } from './ChatPanel'
import { EmptyState } from './EmptyState'
import { ModelSetup } from './ModelSetup'
import { useAppStore, type ActionType } from '../store/appStore'
import { useCallback } from 'react'
import { buildPrompt } from '../lib/prompts'
import { truncateContext } from '../lib/context'

export function Layout() {
  const {
    messages,
    documentText,
    isStreaming,
    modelStatus,
    addMessage,
    updateLastMessage,
    setStreaming,
    setActiveAction,
  } = useAppStore()

  const runInference = useCallback(
    async (action: Exclude<ActionType, null>, question?: string) => {
      if (!documentText.trim() || modelStatus !== 'ready' || isStreaming) return

      // Set active action
      setActiveAction(action)

      // Add user message
      const userContent =
        action === 'ask' && question
          ? question
          : action === 'summarize'
            ? '📝 Summarize this document'
            : '📖 Explain this document'
      addMessage({ role: 'user', content: userContent, action })

      // Add empty AI message
      addMessage({ role: 'ai', content: '', action })

      setStreaming(true)

      try {
        // Build prompt with truncated context
        const truncatedText = truncateContext(documentText)
        const prompt = buildPrompt(action, truncatedText, question)

        // Stream inference
        const { TextGeneration } = await import('@runanywhere/web-llamacpp')
        const { stream, result: resultPromise } =
          await TextGeneration.generateStream(prompt, {
            maxTokens: 512,
            temperature: 0.7,
          })

        let accumulated = ''
        for await (const token of stream) {
          accumulated += token
          updateLastMessage(accumulated)
        }

        // Get metrics
        const metrics = await resultPromise
        updateLastMessage(accumulated, {
          tokensPerSecond: metrics.tokensPerSecond,
          latencyMs: metrics.latencyMs,
          tokensUsed: metrics.tokensUsed,
        })
      } catch (err) {
        const errorMsg = `Error: ${err instanceof Error ? err.message : 'Inference failed. Please try again.'}`
        updateLastMessage(errorMsg)
      } finally {
        setStreaming(false)
        // Keep action active if it's "ask" so user can ask more questions
        if (action !== 'ask') {
          setActiveAction(null)
        }
      }
    },
    [
      documentText,
      modelStatus,
      isStreaming,
      addMessage,
      updateLastMessage,
      setStreaming,
      setActiveAction,
    ]
  )

  const handleAction = useCallback(
    (action: Exclude<ActionType, null>) => {
      if (action === 'ask') {
        setActiveAction('ask')
      } else {
        runInference(action)
      }
    },
    [runInference, setActiveAction]
  )

  const handleAskQuestion = useCallback(
    (question: string) => {
      runInference('ask', question)
    },
    [runInference]
  )

  return (
    <div className="flex flex-col h-screen relative">
      {/* Background */}
      <div className="bg-mesh" />

      {/* Model Setup Overlay */}
      <ModelSetup />

      {/* Top Bar */}
      <TopBar />

      {/* Main Content */}
      <main className="flex-1 flex min-h-0 relative z-10">
        {/* Left Panel */}
        <div className="w-80 lg:w-96 shrink-0 border-r border-border glass overflow-y-auto p-4 hidden md:flex flex-col">
          <InputPanel onAction={handleAction} />
        </div>

        {/* Center Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {messages.length === 0 ? (
            <>
              {/* Mobile Input */}
              <div className="md:hidden p-4 border-b border-border glass overflow-y-auto max-h-[40vh]">
                <InputPanel onAction={handleAction} />
              </div>
              <EmptyState />
            </>
          ) : (
            <>
              {/* Mobile Input (collapsed) */}
              <div className="md:hidden p-3 border-b border-border glass">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-xs font-medium text-text-secondary">
                    <span>📎 Input & Actions</span>
                    <span className="text-text-dim group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="mt-3">
                    <InputPanel onAction={handleAction} />
                  </div>
                </details>
              </div>
              <ChatPanel onAskQuestion={handleAskQuestion} />
            </>
          )}
        </div>
      </main>
    </div>
  )
}
