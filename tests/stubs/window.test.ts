import { describe, test, expect } from "vitest";

import stubWindow from "../../src/stubs/window";

describe("window stub", () => {

    test("Defines window.document and window.document.body", async () => {
        expect(stubWindow).toBeDefined();
        expect(stubWindow.document).toBeDefined();
        expect(stubWindow.document.body).toBeDefined();
    });

});