import { describe, test, expect, beforeEach, vi } from "vitest";
import { destroy } from "zoid";

import "../../src/webComponents/TebexCheckout";
import type { TebexCheckout } from "../../src/webComponents/TebexCheckout";

describe("<tebex-checkout> Web component", () => {

    beforeEach(async () => {
        destroy();
        document.body.innerHTML = "";
        vi.clearAllMocks();
    });

    test("Is defined as a custom element", () => {
        expect(customElements.get("tebex-checkout")).toBeDefined();
    });

    test("Can be constructed with createElement", () => {
        expect(() => document.createElement("tebex-checkout")).not.toThrow();
    });

    test("Can be appended to the DOM", () => {
        expect(() => {
            const el = document.createElement("tebex-checkout");
            document.body.appendChild(el);
        }).not.toThrow();
    });

    test("Only inits once it has an ident attribute AND it has been mounted into the DOM", () => {
        const el = document.createElement("tebex-checkout") as TebexCheckout;
        const spy = vi.spyOn(el.checkout, 'init');

        expect(el._didInit).toBe(false);
        expect(spy).not.toHaveBeenCalled();

        el.setAttribute("ident", __TEST_BASKET_IDENT__);
        expect(el._didInit).toBe(false);
        expect(spy).not.toHaveBeenCalled();

        document.body.append(el);
        expect(el._didInit).toBe(true);
        expect(spy).toHaveBeenCalled();
    });

    test("DOM mount can come first, but init only happens once the ident attribute is present", () => {
        const el = document.createElement("tebex-checkout") as TebexCheckout;
        const spy = vi.spyOn(el.checkout, 'init');

        expect(el._didInit).toBe(false);
        expect(spy).not.toHaveBeenCalled();

        document.body.append(el);
        expect(el._didInit).toBe(false);
        expect(spy).not.toHaveBeenCalled();

        el.setAttribute("ident", __TEST_BASKET_IDENT__);
        expect(el._didInit).toBe(true);
        expect(spy).toHaveBeenCalled();
    });

    describe("Static attributes", () => {

        test("Theme can be set with theme attribute", () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            document.body.append(el);
            el.setAttribute("theme", "dark");
            el.setAttribute("ident", __TEST_BASKET_IDENT__);
            expect(el.checkout.theme).toEqual("dark");
        });

        test("Colors can be set with the color-primary and color-secondary attributes", () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            document.body.append(el);
            el.setAttribute("color-primary", "#f00");
            el.setAttribute("color-secondary", "#00f");
            el.setAttribute("ident", __TEST_BASKET_IDENT__);
            expect(el.checkout.colors.find(c => c.name === "primary").color).toEqual("#f00");
            expect(el.checkout.colors.find(c => c.name === "secondary").color).toEqual("#00f");
        });

        test("Endpoint can be set with the endpoint attribute", () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            document.body.append(el);
            el.setAttribute("endpoint", "test");
            el.setAttribute("ident", __TEST_BASKET_IDENT__);
            expect(el.checkout.endpoint).toEqual("test");
        });

        test("Use inline mode when inline attribute is set", async () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            document.body.append(el);
            expect(el._mode).toEqual("popover");
            el.setAttribute("inline", "");
            el.setAttribute("ident", __TEST_BASKET_IDENT__);
            expect(el._mode).toEqual("inline");
            // Wait for Zoid render to complete, since its async, if we end the test and clear the body, it will get confused
            await el.renderFinished();
        });
        
    });

    describe("Popup mode", () => {

        test("Displays nothing by default", async () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            document.body.appendChild(el);
            el.setAttribute("ident", __TEST_BASKET_IDENT__);
            expect(el.shadowRoot.innerHTML).toEqual("<div></div>");
        });

        test("Opens up the popup when open attribute is added", async () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            const spy = vi.spyOn(window, 'open'); // Tests are mobile by default, so this test will open up a new window
            document.body.appendChild(el);
            el.setAttribute("ident", __TEST_BASKET_IDENT__);
            el.setAttribute("open", "");
            expect(spy).toHaveBeenCalled();
            // Wait for Zoid render to complete, since its async, if we end the test and clear the body, it will get confused
            await el.renderFinished();
        });

        test("Can force the lightbox mode on mobile by adding the popup-on-mobile attribute", async () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            document.body.appendChild(el);
            el.setAttribute("popup-on-mobile", "");
            el.setAttribute("ident", __TEST_BASKET_IDENT__);
            el.setAttribute("open", "");
            expect(document.body.querySelector(".tebex-js-lightbox")).not.toBeNull();
            // Wait for Zoid render to complete, since its async, if we end the test and clear the body, it will get confused
            await el.renderFinished();
        });

        test("Ident and open attributes can be added in opposite order", async () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            document.body.appendChild(el);
            el.setAttribute("popup-on-mobile", "");
            el.setAttribute("open", "");
            el.setAttribute("ident", __TEST_BASKET_IDENT__);
            expect(document.body.querySelector(".tebex-js-lightbox")).not.toBeNull();
            // Wait for Zoid render to complete, since its async, if we end the test and clear the body, it will get confused
            await el.renderFinished();
        });

    });

    describe("Inline mode", () => {

        test("Renders nothing before ident is added", async () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            const shadow = el.shadowRoot;
            document.body.appendChild(el);
            el.setAttribute("inline", "");
            expect(shadow.innerHTML).toEqual("<div></div>");
        });

        test("Renders checkout immediately once ident is available", async () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            const shadow = el.shadowRoot;
            document.body.appendChild(el);
            el.setAttribute("inline", "");

            expect(shadow.innerHTML).toEqual("<div></div>");

            el.setAttribute("ident", __TEST_BASKET_IDENT__);
            expect(shadow.innerHTML).not.toEqual("<div></div>");
            expect(shadow.querySelector("slot")).not.toBeNull();
            // Wait for Zoid render to complete, since its async, if we end the test and clear the body, it will get confused
            await el.renderFinished();
        });

    });

});