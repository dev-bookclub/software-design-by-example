/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Jest 스타일의 글로벌 메서드 사용 (ex: `describe`, `it` 등)
    environment: 'jsdom', // React 컴포넌트 테스트를 위해 jsdom 사용
    setupFiles: './setupTests.ts', // 테스트 환경 초기화 파일
  },
});
