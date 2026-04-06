import { useState, useCallback } from 'react'
import { Send } from 'lucide-react'

interface QuestionInputProps {
  onSubmit: (question: string) => void
  disabled?: boolean
}

export function QuestionInput({ onSubmit, disabled }: QuestionInputProps) {
  const [question, setQuestion] = useState('')

  const handleSubmit = useCallback(() => {
    if (question.trim() && !disabled) {
      onSubmit(question.trim())
      setQuestion('')
    }
  }, [question, disabled, onSubmit])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex items-end gap-2 p-3 glass rounded-xl border border-border">
      <textarea
        id="question-input"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question about your document..."
        disabled={disabled}
        rows={1}
        className="flex-1 bg-transparent text-sm text-text placeholder:text-text-dim resize-none focus:outline-none leading-relaxed max-h-24"
        style={{ minHeight: '24px' }}
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !question.trim()}
        className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <Send className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
