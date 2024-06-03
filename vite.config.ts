import { defineConfig } from 'vitest/config';

import pkg from './package.json' assert { type: 'json' };

export default defineConfig({
    define: {
        __VERSION__: JSON.stringify(pkg.version),
        'process.env': {}
    },
    test: {
        browser: {
            enabled: true,
            provider: 'playwright',
            headless: true,
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