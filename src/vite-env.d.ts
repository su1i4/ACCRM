/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly DEV_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
