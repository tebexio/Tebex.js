import { defineConfig } from 'vitest/config';
import pkg from './package.json' assert { type: 'json' };

export default defineConfig({
    define: {
        __VERSION__: JSON.stringify(pkg.version),
        'process.env': {}
    },
    plugins: [
    ],
    test: {
        browser: {
            enabled: true,
            provider: 'playwright',
            name: 'chromium',
            isolate: true,
        },
        typecheck: {
            enabled: true,
        },
        coverage: {
            provider: 'v8',
            include: ['src/**']
        }
    }
});