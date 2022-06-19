/// <reference types="vite/client" />
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_INFURA_ID: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  ethereum: any;
}
