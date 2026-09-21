import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tsconfigPaths(), react()],
	test: {
		clearMocks: true,
		restoreMocks: true,
		coverage: {
			provider: 'v8',
			reportsDirectory: 'reports/coverage',
			reporter: ['text', 'html', 'json', 'json-summary', 'lcov'],
			// Include untested application code so the baseline exposes real gaps.
			include: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
			exclude: ['**/*.d.ts', '**/*.{test,spec}.{ts,tsx}'],
		},
		projects: [
			{
				extends: true,
				test: {
					name: 'unit',
					environment: 'node',
					include: ['tests/unit/**/*.test.ts'],
				},
			},
			{
				extends: true,
				// Prebundle these together to avoid dependency reloads and duplicate React instances.
				optimizeDeps: {
					include: [
						'@apple-pie/slice',
						'@apple-pie/slice/providers/ThemeProvider',
						'@apple-pie/slice/stores',
						'zustand',
						'motion/react',
						'vitest-browser-react',
					],
				},
				test: {
					name: 'browser',
					include: ['tests/browser/**/*.test.tsx'],
					setupFiles: ['tests/setup/browser.ts'],
					browser: {
						enabled: true,
						headless: true,
						provider: playwright(),
						instances: [{ browser: 'chromium' }],
					},
				},
			},
		],
	},
});
