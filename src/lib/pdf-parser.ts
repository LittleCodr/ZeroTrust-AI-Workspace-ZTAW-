import * as pdfjsLib from 'pdfjs-dist'

// Configure the worker — use bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString()

export interface ParseResult {
  text: string
  pageCount: number
  error?: string
}

/**
 * Extract text content from a PDF file
 */
export async function parsePDF(file: File): Promise<ParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    const pages: string[] = []

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')
      pages.push(`[Page ${i}]\n${pageText}`)
    }

    const text = pages.join('\n\n')

    return {
      text: text.trim(),
      pageCount: pdf.numPages,
    }
  } catch (err) {
    return {
      text: '',
      pageCount: 0,
      error: `Failed to parse PDF: ${err instanceof Error ? err.message : 'Unknown error'}`,
    }
  }
}

/**
 * Read a text-based file (.txt, .md)
 */
export async function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

/**
 * Parse any supported file type
 */
export async function parseFile(
  file: File
): Promise<{ text: string; pageCount?: number; error?: string }> {
  const ext = file.name.split('.').pop()?.toLowerCase()

  if (ext === 'pdf') {
    return parsePDF(file)
  }

  if (ext === 'txt' || ext === 'md') {
    const text = await readTextFile(file)
    return { text }
  }

  return {
    text: '',
    error: `Unsupported file type: .${ext}. Please use PDF, TXT, or MD files.`,
  }
}
