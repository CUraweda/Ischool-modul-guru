/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_REACT_API_URL: string;
  VITE_REACT_API_HRD_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
