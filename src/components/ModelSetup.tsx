import { useCallback, useEffect } from 'react'
import { Download, Loader2, AlertCircle, Cpu, RefreshCw } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import {
  initSDK,
  ModelManager,
  ModelCategory,
  EventBus,
  LlamaCPP,
  MODELS,
} from '../lib/runanywhere'

export function ModelSetup() {
  const {
    sdkStatus,
    sdkError,
    modelStatus,
    modelError,
    downloadProgress,
    selectedModelId,
    setSdkStatus,
    setModelStatus,
    setDownloadProgress,
    setSelectedModelId,
    setAccelerationMode,
  } = useAppStore()

  // Initialize SDK on mount
  useEffect(() => {
    if (sdkStatus !== 'idle') return

    setSdkStatus('initializing')

    initSDK()
      .then(() => {
        setSdkStatus('ready')
        // Check acceleration mode
        if (LlamaCPP.isRegistered) {
          setAccelerationMode(LlamaCPP.accelerationMode ?? 'cpu')
        }
      })
      .catch((err) => {
        setSdkStatus(
          'error',
          err instanceof Error ? err.message : 'Failed to initialize SDK'
        )
      })
  }, [sdkStatus, setSdkStatus, setAccelerationMode])

  // Track download progress
  useEffect(() => {
    const handler = (evt: { modelId: string; progress?: number }) => {
      if (evt.progress !== undefined) {
        setDownloadProgress(evt.progress)
      }
    }

    const unsubscribe = EventBus.shared.on('model.downloadProgress', handler)
    return unsubscribe
  }, [setDownloadProgress])

  const handleLoadModel = useCallback(async () => {
    try {
      setModelStatus('downloading')
      setDownloadProgress(0)

      // Check if already downloaded
      const models = ModelManager.getModels().filter(
        (m) => m.modality === ModelCategory.Language
      )
      const model = models.find((m) => m.id === selectedModelId) ?? models[0]

      if (model.status !== 'downloaded' && model.status !== 'loaded') {
        await ModelManager.downloadModel(model.id)
      }

      setModelStatus('loading')
      await ModelManager.loadModel(model.id)
      setModelStatus('ready')
    } catch (err) {
      setModelStatus(
        'error',
        err instanceof Error ? err.message : 'Failed to load model'
      )
    }
  }, [selectedModelId, setModelStatus, setDownloadProgress])

  // Don't show if model is ready
  if (modelStatus === 'ready') return null

  // SDK still initializing
  if (sdkStatus === 'initializing') {
    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-abyss/90 backdrop-blur-sm">
        <div className="glass-bright rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
          <h3 className="text-base font-semibold text-text mb-1">
            Initializing AI Engine
          </h3>
          <p className="text-xs text-text-secondary">
            Loading WebAssembly runtime...
          </p>
        </div>
      </div>
    )
  }

  // SDK Error
  if (sdkStatus === 'error') {
    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-abyss/90 backdrop-blur-sm">
        <div className="glass-bright rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
          <AlertCircle className="h-10 w-10 text-accent-rose mx-auto mb-4" />
          <h3 className="text-base font-semibold text-text mb-2">
            SDK Initialization Failed
          </h3>
          <p className="text-xs text-text-secondary mb-4">{sdkError}</p>
          <p className="text-[10px] text-text-dim mb-4">
            This may be due to browser compatibility. Try Chrome or Edge.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-ghost"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reload
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-abyss/90 backdrop-blur-sm">
      <div className="glass-bright rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary-dark/20 border border-primary/15 mb-4">
            <Cpu className="h-7 w-7 text-primary-light" />
          </div>
          <h3 className="text-lg font-bold text-text mb-1">Load AI Model</h3>
          <p className="text-xs text-text-secondary">
            Select and download a model to start analyzing locally
          </p>
        </div>

        {/* Model Selection */}
        <div className="space-y-2 mb-6">
          {MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModelId(model.id)}
              disabled={modelStatus === 'downloading' || modelStatus === 'loading'}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left
                ${
                  selectedModelId === model.id
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border hover:border-border-bright bg-white/[0.02]'
                }
                ${modelStatus === 'downloading' || modelStatus === 'loading' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                  ${
                    selectedModelId === model.id
                      ? 'border-primary bg-primary'
                      : 'border-text-dim'
                  }
                `}
              >
                {selectedModelId === model.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text">{model.name}</p>
                <p className="text-[10px] text-text-dim">
                  ~{Math.round(model.memoryRequirement / 1_000_000)}MB •{' '}
                  {model.id === 'qwen-0.5b'
                    ? 'Better quality'
                    : 'Lighter & faster'}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Download Progress */}
        {modelStatus === 'downloading' && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary flex items-center gap-1.5">
                <Download className="h-3 w-3 animate-bounce" />
                Downloading model...
              </span>
              <span className="font-mono text-primary-light">
                {Math.round(downloadProgress * 100)}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${downloadProgress * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-text-dim text-center">
              Model is cached in your browser — download only happens once
            </p>
          </div>
        )}

        {/* Loading */}
        {modelStatus === 'loading' && (
          <div className="mb-4 text-center space-y-2">
            <Loader2 className="h-6 w-6 text-primary animate-spin mx-auto" />
            <p className="text-xs text-text-secondary">
              Loading model into memory...
            </p>
          </div>
        )}

        {/* Error */}
        {modelStatus === 'error' && (
          <div className="mb-4 flex items-start gap-2 px-3 py-2.5 rounded-lg bg-accent-rose/5 border border-accent-rose/15">
            <AlertCircle className="h-4 w-4 text-accent-rose mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-accent-rose">{modelError}</p>
              <p className="text-[10px] text-text-dim mt-1">
                Try a smaller model or ensure sufficient memory.
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleLoadModel}
          disabled={modelStatus === 'downloading' || modelStatus === 'loading'}
          className="btn btn-primary w-full justify-center"
        >
          {modelStatus === 'downloading' || modelStatus === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {modelStatus === 'error'
            ? 'Retry'
            : modelStatus === 'downloading'
              ? 'Downloading...'
              : modelStatus === 'loading'
                ? 'Loading...'
                : 'Download & Load Model'}
        </button>

        <p className="text-[10px] text-text-dim text-center mt-3">
          All processing stays on your device. No data is sent anywhere.
        </p>
      </div>
    </div>
  )
}
