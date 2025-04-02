import { describe, test, expect } from "vitest";

import {
    isUndefined,
    isNull,
    isNullOrUndefined,
    isString,
    isNonEmptyString,
    isNumber,
    isBoolean,
    isArray,
    isObject,
} from "../../src/utils/is";

describe("isUndefined", () => {
    
    test("Only matches undefined, not empty strings/objects/arrays/etc", () => {
        expect(isUndefined({})).toBe(false);
        expect(isUndefined([])).toBe(false);
        expect(isUndefined("")).toBe(false);
        expect(isUndefined(false)).toBe(false);
        expect(isUndefined(null)).toBe(false);

        expect(isUndefined(undefined)).toBe(true);
    });

});
describe("isNull", () => {
    
    test("Only matches null, not empty strings/objects/arrays/etc", () => {
        expect(isNull({})).toBe(false);
        expect(isNull([])).toBe(false);
        expect(isNull("")).toBe(false);
        expect(isNull(false)).toBe(false);
        expect(isNull(undefined)).toBe(false);

        expect(isNull(null)).toBe(true);
    });

});

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

describe("isString", () => {

    test("Only matches strings, including empty strings", () => {
        expect(isString({})).toBe(false);
        expect(isString([])).toBe(false);
        expect(isString(false)).toBe(false);
        expect(isString(null)).toBe(false);
        expect(isString(undefined)).toBe(false);

        expect(isString("")).toBe(true);
        expect(isString("hello")).toBe(true);
    });

});

describe("isNonEmptyString", () => {

    test("Only matches strings, but not empty strings", () => {
        expect(isNonEmptyString({})).toBe(false);
        expect(isNonEmptyString([])).toBe(false);
        expect(isNonEmptyString(false)).toBe(false);
        expect(isNonEmptyString(null)).toBe(false);
        expect(isNonEmptyString(undefined)).toBe(false);
        expect(isNonEmptyString("")).toBe(false);

        expect(isNonEmptyString("hello")).toBe(true);
    });

});

describe("isNumber", () => {
    
    test("Only matches numbers", () => {
        expect(isNumber(false)).toBe(false);
        expect(isNumber(null)).toBe(false);
        expect(isNumber(undefined)).toBe(false);
        expect(isNumber("")).toBe(false);
        expect(isNumber("0")).toBe(false);
        expect(isNumber("1")).toBe(false);

        expect(isNumber(0)).toBe(true);
        expect(isNumber(1)).toBe(true);
    });

    test("Does not match NaN", () => {
        expect(isNumber(NaN)).toBe(false);
    });

});

describe("isBoolean", () => {
    
    test("Only matches booleans, not falsy or truthy values", () => {
        expect(isBoolean({})).toBe(false);
        expect(isBoolean([])).toBe(false);
        expect(isBoolean("")).toBe(false);
        expect(isBoolean("hello")).toBe(false);
        expect(isBoolean(0)).toBe(false);
        expect(isBoolean(1)).toBe(false);

        expect(isBoolean(true)).toBe(true);
        expect(isBoolean(false)).toBe(true);
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