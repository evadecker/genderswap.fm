import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    include: ['**/*.test.?(c|m)[jt]s?(x)'],
    coverage: {
      reporter: ['text', 'json-summary', 'json'],
      lines: 100,
      branches: 100,
      functions: 100,
      statements: 100
    }
  }
});
