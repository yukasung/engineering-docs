import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    files: ['content/**/_meta.js'],
    rules: { 'import/no-anonymous-default-export': ['error', { allowObject: true }] }
  },
  globalIgnores(['.next/**', 'out/**', 'public/_pagefind/**', 'next-env.d.ts'])
])
