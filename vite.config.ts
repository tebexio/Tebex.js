import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

import pkg from './package.json' assert { type: 'json' };
import { onRequest } from './functions/token';

dotenv.config({ path: '.dev.vars' });

const ident = await (async () => {
    console.log('Getting test basket ident...');
    const resp = await onRequest({ env: process.env });
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
        },
        typecheck: {
            enabled: true,
        },
        coverage: {
            provider: 'istanbul',
            include: ['src/**']
        }
    }
});