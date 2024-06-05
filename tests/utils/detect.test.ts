import { describe, test, expect, vi, beforeEach } from "vitest";

import {
    isEnvBrowser,
    isEnvNode,
    isApplePayAvailable,
    isMobile
} from "../../src/utils/detect";

beforeEach(() => {
    vi.unstubAllGlobals();
});

describe("isEnvBrowser", () => {

    test("Returns true in browser test environment", () => {
        expect(isEnvBrowser()).toEqual(true);
    });

    // TODO: test that this returns false in non-browser environments

});

describe("isEnvNode", () => {

    test("Returns false in browser test environment", () => {
        expect(isEnvNode()).toEqual(false);
    });

    test("Returns true if process object is defined", () => {
        vi.stubGlobal('process', { versions: { node: "dummy" } });
        expect(isEnvNode()).toEqual(true);
        vi.unstubAllGlobals();
    });

});

describe("isApplePayAvailable", () => {

    test("Returns false in browser test environment", () => {
        expect(isApplePayAvailable()).toEqual(false);
    });

    test("Returns true if ApplePaySession is available on window object", () => {
        vi.stubGlobal('ApplePaySession', {
            canMakePayments: () => true
        });
        expect(isApplePayAvailable()).toEqual(true);
        vi.unstubAllGlobals();
    });

});

describe("isMobile", () => {

    test("Returns true in browser test environment", () => {
        expect(isMobile("800px", "760px")).toEqual(true);
    });

    // TODO: test that this returns false on larger viewports

});