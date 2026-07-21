/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Base URL of the savings-tracker API. Injected at build time per environment
   * by the deploy workflow (see .github/workflows/deploy-webapp.yml). Falls back
   * to the local API when unset (local `npm run dev` and tests).
   */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
