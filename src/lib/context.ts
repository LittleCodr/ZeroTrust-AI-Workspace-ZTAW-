/**
 * Context management utilities for LocalMind
 * Handles text truncation and token estimation for small LLMs
 */

// Rough token estimation: ~4 chars per token for English
const CHARS_PER_TOKEN = 4

// Max context window for small models (conservative)
const MAX_CONTEXT_TOKENS = 1800
const MAX_CONTEXT_CHARS = MAX_CONTEXT_TOKENS * CHARS_PER_TOKEN

/**
 * Estimate token count from text
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN)
}

/**
 * Truncate text intelligently to fit within context window.
 * Keeps beginning and end of document for better context.
 */
export function truncateContext(text: string): string {
  if (text.length <= MAX_CONTEXT_CHARS) return text

  const headSize = Math.floor(MAX_CONTEXT_CHARS * 0.7)
  const tailSize = Math.floor(MAX_CONTEXT_CHARS * 0.25)

  const head = text.slice(0, headSize)
  const tail = text.slice(-tailSize)

  return `${head}\n\n[... content truncated for context limit ...]\n\n${tail}`
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Format character count for display
 */
export function formatCharCount(count: number): string {
  if (count < 1000) return `${count}`
  return `${(count / 1000).toFixed(1)}k`
}
