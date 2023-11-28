import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json-summary', 'json'],
      lines: 100,
      branches: 100,
      functions: 100,
      statements: 100
    }
  }
});
