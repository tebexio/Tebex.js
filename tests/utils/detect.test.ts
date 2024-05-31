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

    // test("Returns false if window object is undefined", () => {
    //     // vi.stubGlobal('window', undefined);
    //     expect(isEnvBrowser()).toEqual(false);
    //     // vi.unstubAllGlobals();
    // });

});

describe("isEnvNode", () => {

    test("Returns false in browser test environment", () => {
        expect(isEnvNode()).toEqual(false);
    });

    // test("Returns false if process object is undefined", () => {
    //     vi.stubGlobal('process', undefined);
    //     expect(isEnvNode()).toEqual(false);
    // });

});

describe("isApplePayAvailable", () => {

    test("Returns false in browser test environment", () => {
        expect(isApplePayAvailable()).toEqual(false);
    });

    // test("Returns true if ApplePaySession is available on window object", () => {
    //     vi.stubGlobal('window', {
    //         document: {},
    //         ApplePaySession: {
    //             canMakePayments: () => true
    //         }
    //     });
    //     expect(isApplePayAvailable()).toEqual(true);
    // });

});

describe("isMobile", () => {

    test("Returns true in test environment", () => {
        expect(isMobile("800px", "760px")).toEqual(true);
    });

});