import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { destroy } from "zoid"; 

import Checkout from "../src/checkout";

describe("Checkout", () => {

    let checkout: Checkout;

    beforeEach(() => {
        checkout = new Checkout();
    });

    afterEach(() => {
        destroy();
        document.body.innerHTML = "";
        vi.clearAllMocks();
    });

    describe("Checkout init()", () => {

        test("Class members reflect options", () => {
            checkout.init({ ident: "test" });
            expect(checkout.ident).toBe("test");
        });

        test("Theme defaults to 'default'", () => {
            checkout.init({ ident: "test" });
            expect(checkout.theme).toBe("default");
            checkout.init({ ident: "test", theme: "dark" });
            expect(checkout.theme).toBe("dark");
        });

        test("Colors defaults to empty array", () => {
            checkout.init({ ident: "test" });
            expect(checkout.colors).toEqual([]);
            checkout.init({ ident: "test", colors: [ { name: "primary", color: "#ff0000" } ] });
            expect(checkout.colors).toEqual([ { name: "primary", color: "#ff0000" } ]);
        });

        test("Endpoint defaults to https://pay.tebex.io", () => {
            checkout.init({ ident: "test" });
            expect(checkout.endpoint).toBe("https://pay.tebex.io");
            checkout.init({ ident: "test", endpoint: "https://pay.test.tebex.io" });
            expect(checkout.endpoint).toBe("https://pay.test.tebex.io");
        });
        
        test("Throws if ident option is not specified", () => {
            expect(() => checkout.init({} as any)).toThrow();
        });

        test("Throws if theme isn't valid", () => {
            expect(() => checkout.init({
                ident: "test",
                theme: "invalid" as any
            })).toThrow();
        });

        test("Throws if color name is invalid", () => {
            expect(() => checkout.init({
                ident: "test",
                colors: [
                    {
                        name: "invalid" as any,
                        color: "#fff"
                    }
                ]
            })).toThrow();
        });

        test("Throws if color includes CSS variable", () => {
            expect(() => checkout.init({
                ident: "test",
                colors: [
                    {
                        name: "primary",
                        color: "var(--color)"
                    }
                ]
            })).toThrow();
        });

    });

    describe("Checkout on()", () => {

        test("Adds event callbacks", () => {
            checkout.on("open", () => {});
            expect(checkout.emitter.events).toHaveProperty("open");
        });

        test("Returns event unsubscribe function", () => {
            const unsubscribe = checkout.on("open", () => {});
            expect(checkout.emitter.events["open"].length).toBe(1);
            unsubscribe();
            expect(checkout.emitter.events["open"].length).toBe(0);
        });

        test("Supports legacy event names", () => {
            checkout.on("payment_complete" as any, () => {});
            expect(checkout.emitter.events["payment:complete"].length).toBe(1);
            checkout.on("payment_error" as any, () => {});
            expect(checkout.emitter.events["payment:error"].length).toBe(1);
        });

        test("Event callback functions are fired when the event is emitted", () => {
            const spy = vi.fn();
            checkout.on("open", spy);
            checkout.emitter.emit("open");
            expect(spy).toHaveBeenCalled();
        });

    });

    describe("Checkout launch()", () => {

        test("On mobile, opens a popup in a new window by default", async () => {
            const spy = vi.spyOn(window, "open");

            checkout.init({ ident: __TEST_BASKET_IDENT__ });
            await checkout.launch();

            expect(document.body.querySelector(".tebex-js-lightbox")).toBeNull();
            expect(spy).toHaveBeenCalled();
        });

        test("Opens lightbox on desktop, or if popupOnMobile is true", async () => {
            // popupOnMobile used here to force lightbox; the Playwright driver forces viewport to be small enough to be considered "mobile"
            checkout.init({ ident: __TEST_BASKET_IDENT__, popupOnMobile: true });
            await checkout.launch();
            
            expect(document.body.querySelector(".tebex-js-lightbox")).not.toBeNull();
        });

        test("Lightbox contains Zoid iframe", async () => {
            checkout.init({ ident: __TEST_BASKET_IDENT__, popupOnMobile: true });
            await checkout.launch();

            const iframe = document.body.querySelector<HTMLIFrameElement>(".tebex-js-lightbox iframe");
            expect(iframe).not.toBeNull();
            expect(iframe.name.startsWith("__zoid__")).toBe(true);
        });

        test("Fires \"open\" event", async () => {
            const spy = vi.fn();

            checkout.init({ ident: __TEST_BASKET_IDENT__, popupOnMobile: true });
            checkout.on("open", spy);

            await checkout.launch();
            expect(spy).toHaveBeenCalled();
        });

    });

    describe("Checkout render()", () => {

        test("Renders checkout iframe to a custom location", async () => {
            const el = document.createElement("div");
            document.body.appendChild(el); 

            checkout.init({ ident: "test123" });
            await checkout.render(el, 800, 700, false);

            const iframe = el.querySelector<HTMLIFrameElement>("iframe");
            expect(iframe).not.toBeNull();
            expect(iframe.name.startsWith("__zoid__")).toBe(true);
        });

        test("Renders checkout iframe with the given dimensions", async () => {
            const el = document.createElement("div");
            document.body.appendChild(el); 

            checkout.init({ ident: __TEST_BASKET_IDENT__ });
            await checkout.render(el, 123, 456, false);

            const iframe = el.querySelector<HTMLIFrameElement>("iframe");
            const style = getComputedStyle(iframe);
            expect(iframe).not.toBeNull();
            expect(style.width).toEqual("123px");
            expect(style.height).toEqual("456px");
        });

        test("Can render content as a popup in a new window", async () => {
            const spy = vi.spyOn(window, "open");
            const el = document.createElement("div");
            document.body.appendChild(el); 

            checkout.init({ ident: __TEST_BASKET_IDENT__ });
            await checkout.render(el, 800, 700, true);

            expect(el.querySelector<HTMLIFrameElement>("iframe")).toBeNull();
            expect(spy).toHaveBeenCalled();
        });

        test("Fires \"open\" event", async () => {
            const spy = vi.fn();
            const el = document.createElement("div");
            document.body.appendChild(el); 

            checkout.init({ ident: __TEST_BASKET_IDENT__ });
            checkout.on("open", spy);
            await checkout.render(el, 800, 700, false);

            expect(spy).toHaveBeenCalled();
        });

    });

    describe("Checkout close", () => {

        test("Cleans up lightbox elements if used", async () => {
            // popupOnMobile used here to force lightbox; the Playwright driver forces viewport to be small enough to be considered "mobile"
            checkout.init({ ident: __TEST_BASKET_IDENT__, popupOnMobile: true });

            await checkout.launch();
            expect(document.body.querySelector(".tebex-js-lightbox")).not.toBeNull();

            await checkout.close();
            expect(document.body.querySelector(".tebex-js-lightbox")).toBeNull();
        });

        test("Fires \"close\" event", async () => {
            const spy = vi.fn();

            checkout.init({ ident: __TEST_BASKET_IDENT__, popupOnMobile: true });
            checkout.on("close", spy);
            await checkout.launch();
            await checkout.close();

            expect(spy).toHaveBeenCalled();
        });

    });

});