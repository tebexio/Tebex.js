import { describe, test, expect, afterEach, vi, assert } from "vitest";

import "../../src/webComponents/TebexCheckout";
import type { TebexCheckout } from "../../src/webComponents/TebexCheckout";

describe("<tebex-checkout> Web component", () => {

    afterEach(() => {
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

    test("Only inits once it has an ident attribute", () => {
        const el = document.createElement("tebex-checkout") as TebexCheckout;
        const spy = vi.spyOn(el.checkout, 'init');

        expect(el._didInit).toBe(false);
        expect(spy).not.toHaveBeenCalled();

        el.setAttribute("ident", __TEST_BASKET_IDENT__);
        expect(el._didInit).toBe(true);
        expect(spy).toHaveBeenCalled();
    });

    describe("Static attributes", () => {

        test("Theme can be set with theme attribute", () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            el.setAttribute("theme", "dark");
            el.setAttribute("ident", __TEST_BASKET_IDENT__);
            expect(el.checkout.theme).toEqual("dark");
        });

        test("Colors can be set with the color-primary and color-secondary attributes", () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            el.setAttribute("color-primary", "#f00");
            el.setAttribute("color-secondary", "#00f");
            el.setAttribute("ident", __TEST_BASKET_IDENT__);
            expect(el.checkout.colors.find(c => c.name === "primary").color).toEqual("#f00");
            expect(el.checkout.colors.find(c => c.name === "secondary").color).toEqual("#00f");
        });

        test("Endpoint can be set with the endpoint attribute", () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            el.setAttribute("endpoint", "test");
            el.setAttribute("ident", __TEST_BASKET_IDENT__);
            expect(el.checkout.endpoint).toEqual("test");
        });

        test("Use inline mode when inline attribute is set", () => {
            // TODO: this errors unless the el is added to the document first. Need to fix inside the webcomponent
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            expect(el._mode).toEqual("popover");
            el.setAttribute("inline", "");
            el.setAttribute("ident", __TEST_BASKET_IDENT__);
            expect(el._mode).toEqual("inline");
        });
        
    });

    describe("Popup mode", () => {

        test("Displays nothing by default", () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            document.body.appendChild(el);
            el.setAttribute("ident", __TEST_BASKET_IDENT__);
            expect(el.shadowRoot.innerHTML).toEqual("<div></div>");
        });

        test("Opens up the popup when open attribute is added", () => {
            const el = document.createElement("tebex-checkout") as TebexCheckout;
            document.body.appendChild(el);
            el.setAttribute("ident", __TEST_BASKET_IDENT__);
            // TODO; open might be set too early here? before init has happened?
            el.setAttribute("open", "");
            console.log(document.body.querySelector(".tebex-js-lightbox"))
        });

    });

});