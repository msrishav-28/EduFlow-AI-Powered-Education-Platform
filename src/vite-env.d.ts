

interface ImportMetaEnv {

  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_GEMMA_API_KEY?: string
  readonly VITE_OLLAMA_ENDPOINT?: string
  readonly VITE_OLLAMA_MODEL?: string
  readonly VITE_PREFERRED_AI_MODEL?: string
  readonly VITE_PREFERRED_AI_PROVIDER?: string
  readonly VITE_ENABLE_AI_FALLBACK?: string
  

  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string
  

  readonly VITE_ENABLE_OFFLINE_MODE?: string
  readonly VITE_ENABLE_GEMMA_OFFLINE?: string
  readonly VITE_ENABLE_ANALYTICS?: string
  readonly VITE_ENABLE_PERFORMANCE_MONITORING?: string
  readonly VITE_ENABLE_REMOTE_CONFIG?: string
  

  readonly VITE_ENV?: string
  readonly VITE_DEBUG?: string
  readonly VITE_USE_EMULATORS?: string
  

  readonly VITE_MAX_CACHE_SIZE?: string
  readonly VITE_CACHE_TTL?: string
  readonly VITE_ENABLE_ENCRYPTION?: string
  readonly VITE_AUTO_CLEANUP_EXPIRED?: string
  

  readonly VITE_AI_CACHE_TTL?: string
  readonly VITE_MAX_AI_RETRIES?: string
  readonly VITE_AI_TIMEOUT?: string
  

  readonly VITE_ENABLE_ERROR_TRACKING?: string
  readonly VITE_ENABLE_USER_ANALYTICS?: string
  readonly VITE_ENABLE_PERFORMANCE_METRICS?: string
  

  readonly VITE_ENABLE_CSP?: string
  readonly VITE_ENABLE_SECURE_HEADERS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
