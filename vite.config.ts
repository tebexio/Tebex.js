import { defineConfig } from 'vitest/config';
import pkg from './package.json' assert { type: 'json' };

export default defineConfig({
    define: {
        "__VERSION__": JSON.stringify(pkg.version),
    },
    test: {
        environment: 'jsdom',
        typecheck: {
            enabled: true,
        },
        coverage: {
            provider: 'v8',
            include: ['src/**']
        }
    }
});