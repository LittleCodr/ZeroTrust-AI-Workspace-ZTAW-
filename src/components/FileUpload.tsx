import { useRef, useCallback, useState } from 'react'
import { Upload, FileText, X, AlertCircle, Loader2 } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { parseFile } from '../lib/pdf-parser'
import { formatFileSize } from '../lib/context'

export function FileUpload() {
  const { setDocumentText } = useAppStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const processFile = useCallback(
    async (file: File) => {
      setError(null)
      setIsParsing(true)
      setFileInfo({ name: file.name, size: file.size })

      try {
        const result = await parseFile(file)

        if (result.error) {
          setError(result.error)
          setFileInfo(null)
        } else if (!result.text.trim()) {
          setError('No text content found in file.')
          setFileInfo(null)
        } else {
          setDocumentText(result.text, file.name)
        }
      } catch (err) {
        setError(
          `Failed to process file: ${err instanceof Error ? err.message : 'Unknown error'}`
        )
        setFileInfo(null)
      } finally {
        setIsParsing(false)
      }
    },
    [setDocumentText]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const handleClear = () => {
    setFileInfo(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div
        className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer group
          ${isDragOver ? 'drag-over border-primary' : 'border-border hover:border-border-bright'}
          ${isParsing ? 'pointer-events-none opacity-60' : ''}
        `}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {isParsing ? (
          <>
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-text-secondary">Parsing file...</p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
              <Upload className="h-5 w-5 text-primary-light" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-text-secondary">
                Drop your file here or{' '}
                <span className="text-primary-light">browse</span>
              </p>
              <p className="text-xs text-text-dim mt-1">
                PDF, TXT, or Markdown files
              </p>
            </div>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.md"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {/* File Info */}
      {fileInfo && !error && (
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary-light" />
            <div>
              <p className="text-xs font-medium text-text truncate max-w-[180px]">
                {fileInfo.name}
              </p>
              <p className="text-[10px] text-text-dim">
                {formatFileSize(fileInfo.size)}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleClear()
            }}
            className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-text transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-accent-rose/5 border border-accent-rose/15">
          <AlertCircle className="h-4 w-4 text-accent-rose mt-0.5 shrink-0" />
          <p className="text-xs text-accent-rose">{error}</p>
        </div>
      )}
    </div>
  )
}
