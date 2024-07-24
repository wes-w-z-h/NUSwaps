/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_NUS_MODS_BASE_API: string;
  readonly VITE_SEMESTER: number;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
