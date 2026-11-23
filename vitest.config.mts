import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@': r('./src'),
      // `server-only` throws outside the React server runtime; tests call services directly.
      'server-only': r('./tests/stubs/server-only.ts'),
    },
  },
  test: {
    // The engine's tests run against the fixed MANAN reference catalogue, not the
    // shop's own (see src/server/seed/catalog-data.ts).
    env: { STORE_CATALOG: 'reference' },
    projects: [
      {
        extends: true,
        test: { name: 'unit', include: ['tests/unit/**/*.test.ts'], environment: 'node' },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          include: ['tests/integration/**/*.test.ts'],
          environment: 'node',
          globalSetup: ['tests/integration/global-setup.ts'],
          // Services get their own database handle; this only satisfies modules that
          // build the app-wide pool at import time (it never connects).
          env: { DATABASE_URL: 'postgres://unused:unused@127.0.0.1:1/unused', NODE_ENV: 'test', STORE_CATALOG: 'reference' },
          testTimeout: 30_000,
          hookTimeout: 180_000,
        },
      },
    ],
  },
})
