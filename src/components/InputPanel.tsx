import { useCallback, useState } from 'react'
import { Type, Upload as UploadIcon, Trash2 } from 'lucide-react'
import { TextInput } from './TextInput'
import { FileUpload } from './FileUpload'
import { ActionButtons } from './ActionButtons'
import { useAppStore, type ActionType } from '../store/appStore'
import { estimateTokens } from '../lib/context'

interface InputPanelProps {
  onAction: (action: Exclude<ActionType, null>) => void
}

export function InputPanel({ onAction }: InputPanelProps) {
  const { documentText, documentName, inputMode, setInputMode, clearDocument } =
    useAppStore()
  const [showPreview, setShowPreview] = useState(false)

  const tabs = [
    { id: 'paste' as const, label: 'Paste Text', icon: Type },
    { id: 'upload' as const, label: 'Upload File', icon: UploadIcon },
  ]

  const handleClear = useCallback(() => {
    clearDocument()
    setShowPreview(false)
  }, [clearDocument])

  return (
    <aside className="flex flex-col h-full">
      {/* Section Title */}
      <div className="flex items-center justify-between px-1 mb-4">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Input
        </h2>
        {documentText && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-[10px] text-text-dim hover:text-accent-rose transition-colors"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.03] border border-border mb-4">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setInputMode(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all
              ${
                inputMode === id
                  ? 'bg-primary/15 text-primary-light border border-primary/20'
                  : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.03] border border-transparent'
              }
            `}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
        {inputMode === 'paste' ? <TextInput /> : <FileUpload />}

        {/* Document Preview */}
        {documentText && inputMode === 'upload' && (
          <div className="space-y-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1 text-[10px] text-text-dim hover:text-text-secondary transition-colors"
            >
              {showPreview ? '▼ Hide' : '▶ Preview'} extracted text
            </button>
            {showPreview && (
              <div className="max-h-32 overflow-y-auto px-3 py-2 rounded-lg bg-white/[0.02] border border-border text-xs text-text-secondary font-mono leading-relaxed">
                {documentText.slice(0, 1000)}
                {documentText.length > 1000 && '...'}
              </div>
            )}
          </div>
        )}

        {/* Document Stats */}
        {documentText && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-border">
            <div className="text-center flex-1">
              <p className="text-xs font-semibold text-text">
                {documentText.length.toLocaleString()}
              </p>
              <p className="text-[9px] text-text-dim">Characters</p>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="text-center flex-1">
              <p className="text-xs font-semibold text-text">
                ~{estimateTokens(documentText).toLocaleString()}
              </p>
              <p className="text-[9px] text-text-dim">Tokens (est.)</p>
            </div>
            {documentName && (
              <>
                <div className="w-px h-6 bg-border" />
                <div className="text-center flex-1">
                  <p className="text-xs font-semibold text-text truncate max-w-[80px]">
                    {documentName}
                  </p>
                  <p className="text-[9px] text-text-dim">Source</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <ActionButtons onAction={onAction} />
      </div>
    </aside>
  )
}
