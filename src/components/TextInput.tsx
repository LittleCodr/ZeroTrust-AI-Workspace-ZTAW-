import { useAppStore } from '../store/appStore'
import { formatCharCount } from '../lib/context'

const MAX_CHARS = 50000

export function TextInput() {
  const { documentText, setDocumentText } = useAppStore()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= MAX_CHARS) {
      setDocumentText(value, 'Pasted text')
    }
  }

  return (
    <div className="space-y-2">
      <textarea
        id="text-input"
        value={documentText}
        onChange={handleChange}
        placeholder="Paste your text, code, notes, or any content you want to analyze privately..."
        className="w-full h-48 px-4 py-3 rounded-xl bg-white/[0.03] border border-border text-sm text-text placeholder:text-text-dim resize-none focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all font-[inherit] leading-relaxed"
      />
      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] text-text-dim">
          Your text stays in your browser — never sent anywhere
        </p>
        <p
          className={`text-[10px] font-mono ${
            documentText.length > MAX_CHARS * 0.9
              ? 'text-accent-rose'
              : 'text-text-dim'
          }`}
        >
          {formatCharCount(documentText.length)} / {formatCharCount(MAX_CHARS)}
        </p>
      </div>
    </div>
  )
}
