/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_WEBSITE_VERSION: string
  readonly VITE_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

type ActionFunction<T extends (...args: any) => any> = (...args: Parameters<T>) => unknown
