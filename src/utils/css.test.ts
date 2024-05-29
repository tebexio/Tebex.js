import { describe, test, expect } from "vitest";

import {
    nextFrame,
    transitionEnd
} from "./css";

describe("nextFrame", () => {

    test("Awaits until the next browser frame", async () => {
        const start = performance.now();
        await nextFrame();
        const end = performance.now();
        expect(end - start).toBeGreaterThanOrEqual(1000 / 60);
    });

});

describe("transitionEnd", () => {

    test("Resolves immediately if there is no transition on the element", async () => {
        const el = document.createElement("div");
        const start = performance.now();
        await transitionEnd(el);
        const end = performance.now();
        expect(end - start).toBeLessThanOrEqual(1000);
    });

    test.todo("Awaits until the end of the transition (does not work in jsdom)", () => {});

});