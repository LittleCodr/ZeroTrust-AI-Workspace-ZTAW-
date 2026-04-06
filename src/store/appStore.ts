import { create } from 'zustand'

// ── Types ────────────────────────────────────────────────────
export interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  action?: 'summarize' | 'explain' | 'ask'
  timestamp: number
  metrics?: {
    tokensPerSecond: number
    latencyMs: number
    tokensUsed: number
  }
}

export type SDKStatus = 'idle' | 'initializing' | 'ready' | 'error'
export type ModelStatus =
  | 'idle'
  | 'downloading'
  | 'loading'
  | 'ready'
  | 'error'
export type ActionType = 'summarize' | 'explain' | 'ask' | null

interface AppState {
  // SDK
  sdkStatus: SDKStatus
  sdkError: string | null
  modelStatus: ModelStatus
  modelError: string | null
  downloadProgress: number
  selectedModelId: string
  accelerationMode: string | null

  // Document
  documentText: string
  documentName: string
  inputMode: 'paste' | 'upload'

  // Chat
  messages: Message[]
  isStreaming: boolean
  activeAction: ActionType

  // Actions
  setSdkStatus: (status: SDKStatus, error?: string) => void
  setModelStatus: (status: ModelStatus, error?: string) => void
  setDownloadProgress: (progress: number) => void
  setSelectedModelId: (id: string) => void
  setAccelerationMode: (mode: string) => void
  setDocumentText: (text: string, name?: string) => void
  setInputMode: (mode: 'paste' | 'upload') => void
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void
  updateLastMessage: (content: string, metrics?: Message['metrics']) => void
  clearMessages: () => void
  setStreaming: (streaming: boolean) => void
  setActiveAction: (action: ActionType) => void
  clearDocument: () => void
  reset: () => void
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const useAppStore = create<AppState>((set) => ({
  // ── Initial State ────────────────────────────────────────
  sdkStatus: 'idle',
  sdkError: null,
  modelStatus: 'idle',
  modelError: null,
  downloadProgress: 0,
  selectedModelId: 'qwen-0.5b',
  accelerationMode: null,

  documentText: '',
  documentName: '',
  inputMode: 'paste',

  messages: [],
  isStreaming: false,
  activeAction: null,

  // ── Actions ──────────────────────────────────────────────
  setSdkStatus: (status, error) =>
    set({ sdkStatus: status, sdkError: error ?? null }),

  setModelStatus: (status, error) =>
    set({ modelStatus: status, modelError: error ?? null }),

  setDownloadProgress: (progress) =>
    set({ downloadProgress: progress }),

  setSelectedModelId: (id) =>
    set({ selectedModelId: id }),

  setAccelerationMode: (mode) =>
    set({ accelerationMode: mode }),

  setDocumentText: (text, name) =>
    set({ documentText: text, documentName: name ?? '' }),

  setInputMode: (mode) =>
    set({ inputMode: mode }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...msg, id: generateId(), timestamp: Date.now() },
      ],
    })),

  updateLastMessage: (content, metrics) =>
    set((state) => {
      const messages = [...state.messages]
      const last = messages[messages.length - 1]
      if (last) {
        messages[messages.length - 1] = {
          ...last,
          content,
          ...(metrics && { metrics }),
        }
      }
      return { messages }
    }),

  clearMessages: () => set({ messages: [] }),

  setStreaming: (streaming) =>
    set({ isStreaming: streaming }),

  setActiveAction: (action) =>
    set({ activeAction: action }),

  clearDocument: () =>
    set({ documentText: '', documentName: '' }),

  reset: () =>
    set({
      documentText: '',
      documentName: '',
      messages: [],
      isStreaming: false,
      activeAction: null,
    }),
}))
