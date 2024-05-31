import { defineConfig } from 'vitest/config';
import pkg from './package.json' assert { type: 'json' };

import commonjs from '@rollup/plugin-commonjs';
import globals from 'rollup-plugin-node-globals';

export default defineConfig({
    define: {
        __VERSION__: JSON.stringify(pkg.version),
    },
    plugins: [
        commonjs(),
        globals()
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