import { describe, test, expect } from "vitest";

import { spinnerRender } from "../../src/components/spinner";

describe("spinnerRender", () => {

    test("Renders spinner HTML", () => {
        const el = spinnerRender({ props: {} });
        // test in two parts to ignore CSS content
        expect(el.outerHTML).toContain(`<html><body><style>`);
        expect(el.outerHTML).toContain(`</style><div class="tebex-js-spinner"></div></body></html>`);
    });

    test("Supports cspNonce prop, adding it to the stylesheet", () => {
        const el = spinnerRender({ props: { cspNonce: "test" } });
        // test in two parts to ignore CSS content
        expect(el.outerHTML).toContain(`<html><body><style nonce="test">`);
        expect(el.outerHTML).toContain(`</style><div class="tebex-js-spinner"></div></body></html>`);
    });

});