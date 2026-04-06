import {
  RunAnywhere,
  SDKEnvironment,
  ModelManager,
  ModelCategory,
  LLMFramework,
  EventBus,
  type CompactModelDef,
} from '@runanywhere/web'
import { LlamaCPP } from '@runanywhere/web-llamacpp'

// ── Model Catalog ────────────────────────────────────────────
export const MODELS: CompactModelDef[] = [
  {
    id: 'qwen-0.5b',
    name: 'Qwen 2.5 0.5B Instruct',
    url: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_0.gguf',
    framework: LLMFramework.LlamaCpp,
    modality: ModelCategory.Language,
    memoryRequirement: 400_000_000,
  },
  {
    id: 'smollm2-360m',
    name: 'SmolLM2 360M Instruct',
    url: 'https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct-GGUF/resolve/main/smollm2-360m-instruct-q4_k_m.gguf',
    framework: LLMFramework.LlamaCpp,
    modality: ModelCategory.Language,
    memoryRequirement: 250_000_000,
  },
]

// ── SDK Initialization Singleton ─────────────────────────────
let _initPromise: Promise<void> | null = null

export async function initSDK(): Promise<void> {
  if (_initPromise) return _initPromise

  _initPromise = (async () => {
    // 1. Initialize core SDK
    await RunAnywhere.initialize({
      environment: SDKEnvironment.Development,
      debug: false,
    })

    // 2. Register the LlamaCpp backend (loads WASM automatically)
    await LlamaCPP.register()

    // 3. Register model catalog
    RunAnywhere.registerModels(MODELS)
  })()

  return _initPromise
}

export { RunAnywhere, ModelManager, ModelCategory, EventBus, LlamaCPP }
