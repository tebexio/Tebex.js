import { describe, test, expect } from "vitest";

import { spinnerRender } from "./spinner";

describe("spinnerRender", () => {

    test("Renders spinner HTML", () => {
        const el = spinnerRender({ props: {} });
        // Note: style is not inlined in vitest env
        expect(el.outerHTML).toEqual(`<html><body><style></style><div class="tebex-js-spinner"></div></body></html>`);
    });

    test("Supports cspNonce prop, adding it to the stylesheet", () => {
        const el = spinnerRender({ props: { cspNonce: "test" } });
        // Note: style is not inlined in vitest env
        expect(el.outerHTML).toEqual(`<html><body><style nonce="test"></style><div class="tebex-js-spinner"></div></body></html>`);
    });

});