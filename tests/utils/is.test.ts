import { describe, test, expect } from "vitest";

import {
    isNullOrUndefined,
    isArray,
    isObject
} from "../../src/utils/is";

describe("isNullOrUndefined", () => {

    test("Only matches null or undefined, not empty strings/objects/arrays/etc", () => {
        expect(isNullOrUndefined({})).toBe(false);
        expect(isNullOrUndefined([])).toBe(false);
        expect(isNullOrUndefined("")).toBe(false);
        expect(isNullOrUndefined(false)).toBe(false);
        expect(isNullOrUndefined(null)).toBe(true);
        expect(isNullOrUndefined(undefined)).toBe(true);
    });

});

describe("isArray", () => {
    
    test("Only matches arrays, not objects", () => {
        expect(isArray({})).toBe(false);
        expect(isArray("")).toBe(false);

        expect(isArray([])).toBe(true);
    });

    test("Does not match typed arrays", () => {
        expect(isArray(new Uint8Array())).toBe(false);
    });

});

describe("isObject", () => {

    test("Only matches dict-style objects, not arrays/strings/etc", () => {
        expect(isObject([])).toBe(false);
        expect(isObject("")).toBe(false);
        expect(isObject(undefined)).toBe(false);
        expect(isObject(null)).toBe(false);

        expect(isObject({})).toBe(true);
    });

});