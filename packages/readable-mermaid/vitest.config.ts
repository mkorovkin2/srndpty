import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'test/',
        '**/*.test.ts',
        '**/*.spec.ts',
        'tsup.config.ts',
        'vitest.config.ts',
        'src/index.ts', // Just re-exports
        'src/types.ts', // Just type definitions
        'src/ReadableMermaid.tsx' // React component, tested via demo e2e
      ],
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    }
  }
});
