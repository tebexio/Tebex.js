import { defineConfig } from 'vitest/config';

import pkg from './package.json' assert { type: 'json' };
import { onRequest } from './functions/token';

const ident = await (async () => {
    console.log('Getting test basket ident...');
    const resp = await onRequest();
    const data = await resp.json();
    return data.ident;
})();

export default defineConfig({
    define: {
        __VERSION__: JSON.stringify(pkg.version),
        __TEST_BASKET_IDENT__: JSON.stringify(ident),
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