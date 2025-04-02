import { describe, test, expect, vi } from "vitest";

import {
    err,
    warn,
    assert
} from "../../src/utils/err";

describe("err", () => {

    test("Throws a prefixed error", () => {
        expect(() => err()).toThrowError("Tebex.js error");
    });

    test("Throws a prefixed error with a given message", () => {
        expect(() => err("Error message")).toThrowError("Tebex.js error: Error message");
    });

});

describe("warn", () => {

    test("Logs a prefixed warning", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        warn();
        expect(spy).toHaveBeenCalledWith("Tebex.js warning");
    });

    test("Logs a prefixed warning with a given message", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        warn("Warning message");
        expect(spy).toHaveBeenCalledWith("Tebex.js warning: Warning message");
    });

});

describe("assert", () => {

    test("Throws a prefixed error if condition is false", () => {
        expect(() => assert(false)).toThrowError("Tebex.js error");
    });

    test("Throws a prefixed error with a given message", () => {
        expect(() => assert(false, "Error message")).toThrowError("Tebex.js error: Error message");
    });

});