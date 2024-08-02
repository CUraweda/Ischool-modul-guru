/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_REACT_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
