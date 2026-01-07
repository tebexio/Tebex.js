import { describe, test, expect, beforeEach, vi } from "vitest";
import { destroy } from "zoid";

import "../../src/webComponents/TebexCheckout";
import type { TebexCheckout } from "../../src/webComponents/TebexCheckout";
import { nextFrame } from "../../src/utils";

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

        test("Close behavior can be set with the close-on-click-outside, close-on-esc, and close-on-payment-complete attributes", () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            document.body.append(el);
            el.setAttribute("close-on-click-outside", "aaaa");
            el.setAttribute("close-on-esc", "aaaa");
            el.setAttribute("close-on-payment-complete", "aaaa");
            el.setAttribute("ident", __TEST_BASKET_IDENT__);

            expect(el.checkout.closeOnClickOutside).toEqual(true);
            expect(el.checkout.closeOnEsc).toEqual(true);
            expect(el.checkout.closeOnPaymentComplete).toEqual(true);
        });

        test("Default payment method can be set with the default-payment-method attribute", () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            document.body.append(el);
            el.setAttribute("default-payment-method", "test");
            el.setAttribute("ident", __TEST_BASKET_IDENT__);
            expect(el.checkout.defaultPaymentMethod).toEqual("test");
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

            expect(el.shadowRoot.innerHTML).toEqual("<div><slot></slot></div>");
        });

        test("Opens up the popup when open attribute is added", async () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            const spy = vi.spyOn(window, "open"); // Tests are mobile by default, so this test will open up a new window
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

        test("Elements added inside <tebex-checkout> tag can be clicked to open the checkout", async () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            document.body.appendChild(el);
            el.setAttribute("popup-on-mobile", "");
            el.setAttribute("ident", __TEST_BASKET_IDENT__);

            const button = document.createElement("button");
            el.appendChild(button);
            // Wait a frame for the <tebex-checkout> slot to do its thing
            await nextFrame();

            button.click();
            expect(el.hasAttribute("open")).not.toBeFalsy();
            expect(document.body.querySelector(".tebex-js-lightbox")).not.toBeNull();

            // Wait for Zoid render to complete, since its async, if we end the test and clear the body, it will get confused
            await el.renderFinished();
        });

        test("Elements added inside <tebex-checkout> tag no longer have click events after they're removed", async () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            document.body.appendChild(el);
            el.setAttribute("popup-on-mobile", "");
            el.setAttribute("ident", __TEST_BASKET_IDENT__);

            const button = document.createElement("button");
            el.appendChild(button);
            // Wait a frame for the <tebex-checkout> slot to do its thing
            await nextFrame();

            el.removeChild(button);
            await nextFrame();

            button.click();
            expect(el.hasAttribute("open")).toBeFalsy();
            expect(document.body.querySelector(".tebex-js-lightbox")).toBeNull();
        });

    });

    describe("Inline mode", () => {

        test("Renders nothing before ident is added", async () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            const shadow = el.shadowRoot;
            document.body.appendChild(el);
            el.setAttribute("inline", "");
            expect(shadow.innerHTML).toEqual("<div><slot></slot></div>");
        });

        test("Renders checkout immediately once ident is available", async () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            const shadow = el.shadowRoot;
            document.body.appendChild(el);
            el.setAttribute("inline", "");

            expect(shadow.innerHTML).toEqual("<div><slot></slot></div>");

            el.setAttribute("ident", __TEST_BASKET_IDENT__);
            expect(shadow.innerHTML).not.toEqual("<div></div>");
            expect(shadow.querySelector("slot")).not.toBeNull();
            // Wait for Zoid render to complete, since its async, if we end the test and clear the body, it will get confused
            await el.renderFinished();
        });

    });

});