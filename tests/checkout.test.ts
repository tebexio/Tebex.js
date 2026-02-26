import { describe, test, expect, beforeEach, afterEach, vi, MockInstance } from "vitest";
import { destroy } from "zoid"; 

import Checkout from "../src/checkout";
import { __clearGlobalLightboxOpen } from "../src/components/lightbox";

describe("Checkout", () => {

    let checkout: Checkout;

    beforeEach(() => {
        checkout = new Checkout();
    });

    afterEach(() => {
        destroy();
        document.body.innerHTML = "";
        vi.clearAllMocks();
        __clearGlobalLightboxOpen();
    });

    describe("Checkout init()", () => {
        
        describe("ident option", () => {
            test("Class ident member reflects ident option", () => {
                checkout.init({ ident: "test" });
                expect(checkout.ident).toBe("test");
            });

            test("Class ident member is null if ident option is not provided", () => {
                checkout.init({});
                expect(checkout.ident).toBe(undefined);
            });
        });

        describe("locale option", () => {

            test("Locale can be set with locale option, and defaults to null", () => {
                checkout.init({ ident: "test" });
                expect(checkout.locale).toBe(null);
                checkout.init({ ident: "test", locale: "en_US" });
                expect(checkout.locale).toBe("en_US");
            });

            test("Warns if locale isn't a string, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({ ident: "test", locale: 123 as any });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid locale option");
                expect(checkout.locale).toBe(null);
            });

            test("Warns if locale is an empty string, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({ ident: "test", locale: "" });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid locale option");
                expect(checkout.locale).toBe(null);
            });
        });

        describe("theme option", () => {

            test("Theme can be set with theme option, and defaults to 'default'", () => {
                checkout.init({ ident: "test" });
                expect(checkout.theme).toBe("default");
                checkout.init({ ident: "test", theme: "dark" });
                expect(checkout.theme).toBe("dark");
            });

            test("Warns if theme isn't a string, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({ ident: "test", theme: 123 as any });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid theme option");
                expect(checkout.theme).toBe("default");
            });

            test("Warns if theme isn't a valid theme name, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({ ident: "test", theme: "TEST" as any });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid theme option");
                expect(checkout.theme).toBe("default");
            });
        });

        describe("colors option", () => {

            test("Colors defaults to empty array", () => {
                checkout.init({ ident: "test" });
                expect(checkout.colors).toEqual([]);
            });

            test("Colors can be set by passing an array to the colors option", () => {
                checkout.init({ ident: "test", colors: [ { name: "primary", color: "#ff0000" } ] });
                expect(checkout.colors).toEqual([ { name: "primary", color: "#ff0000" } ]);
            });

            test("Colors can be set by passing an object to the colors option", () => {
                checkout.init({ ident: "test", colors: { primary: "#ff0000" } });
                expect(checkout.colors).toEqual([ { name: "primary", color: "#ff0000" } ]);
            });

            test("Warns if colors option isn't array or object, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({
                    ident: "test",
                    colors: "invalid" as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid colors option");
                expect(checkout.colors).toMatchObject([]);
            });

            test("Warns if color array entry isn't an object, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({
                    ident: "test",
                    colors: [
                        "invalid" as any
                    ]
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid colors option item");
                expect(checkout.colors).toMatchObject([]);
            });

            test("Warns if color array entry name is missing, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({
                    ident: "test",
                    colors: [
                        {
                            color: "#fff"
                        } as any
                    ]
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid colors option item - missing 'name' field");
                expect(checkout.colors).toMatchObject([]);
            });

            test("Warns if color array entry value is missing, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({
                    ident: "test",
                    colors: [
                        {
                            name: "primary",
                        } as any
                    ]
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid colors option item - missing 'color' field");
                expect(checkout.colors).toMatchObject([]);
            });

            test("Warns if color array entry name isn't valid, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({
                    ident: "test",
                    colors: [
                        {
                            name: "invalid" as any,
                            color: "#fff"
                        }
                    ]
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid color name");
                expect(checkout.colors).toMatchObject([]);
            });

            test("Warns if color object key isn't valid, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({
                    ident: "test",
                    colors: {
                        invalid: "#fff"
                    } as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid color name");
                expect(checkout.colors).toMatchObject([]);
            });

            test("Warns if color array entry value isn't valid, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({
                    ident: "test",
                    colors: [
                        {
                            name: "primary",
                            color: 123 as any
                        }
                    ]
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid color value \"123\"");
                expect(checkout.colors).toMatchObject([]);
            });

            test("Warns if color object value isn't valid, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({
                    ident: "test",
                    colors: {
                        primary: 123
                    } as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid color value \"123\"");
                expect(checkout.colors).toMatchObject([]);
            });

            test("Warns if color array entry value includes CSS variable, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({
                    ident: "test",
                    colors: [
                        {
                            name: "primary",
                            color: "var(--color-primary)"
                        }
                    ]
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid color value");
                expect(spy.mock.lastCall[0]).toContain("cannot include CSS variables");
                expect(checkout.colors).toMatchObject([]);
            });

            test("Warns if color object value includes CSS variable, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({
                    ident: "test",
                    colors: {
                        primary: "var(--color-primary)"
                    }
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid color value");
                expect(spy.mock.lastCall[0]).toContain("cannot include CSS variables");
                expect(checkout.colors).toMatchObject([]);
            });
        });

        describe("popupOnMobile", () => {

            test("Can set popupOnMobile, which defaults to false", () => {
                checkout.init({ ident: "test" });
                expect(checkout.popupOnMobile).toBe(false);
                checkout.init({ ident: "test", popupOnMobile: true });
                expect(checkout.popupOnMobile).toBe(true);
            });

            test("Warns if popupOnMobile option isn't valid, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({
                    ident: "test",
                    popupOnMobile: 123 as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid popupOnMobile option");
                expect(checkout.popupOnMobile).toBe(false);
            });
        });

        describe("endpoint option", () => {

            test("Endpoint can be set with endpoint option, and defaults to https://pay.tebex.io", () => {
                checkout.init({ ident: "test" });
                expect(checkout.endpoint).toBe("https://pay.tebex.io");
                checkout.init({ ident: "test", endpoint: "https://pay.test.tebex.io" });
                expect(checkout.endpoint).toBe("https://pay.test.tebex.io");
            });

            test("Warns if endpoint option isn't valid, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({
                    ident: "test",
                    endpoint: 123 as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid endpoint option");
                expect(checkout.endpoint).toBe("https://pay.tebex.io");
            });
        });

        describe("closeOnClickOutside option", () => {

            test("Can set closeOnClickOutside, which defaults to false", () => {
                checkout.init({ ident: "test" });
                expect(checkout.closeOnClickOutside).toBe(false);
                checkout.init({ ident: "test", closeOnClickOutside: true });
                expect(checkout.closeOnClickOutside).toBe(true);
            });

            test("Warns if closeOnClickOutside option isn't valid, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({
                    ident: "test",
                    closeOnClickOutside: 123 as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid closeOnClickOutside option");
                expect(checkout.closeOnClickOutside).toBe(false);
            });
        });

        describe("closeOnEsc option", () => {

            test("Can set closeOnEsc, which defaults to false", () => {
                checkout.init({ ident: "test" });
                expect(checkout.closeOnEsc).toBe(false);
                checkout.init({ ident: "test", closeOnEsc: true });
                expect(checkout.closeOnEsc).toBe(true);
            });

            test("Warns if closeOnEsc option isn't valid, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({
                    ident: "test",
                    closeOnEsc: 123 as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid closeOnEsc option");
                expect(checkout.closeOnEsc).toBe(false);
            });
        });

        describe("closeOnPaymentComplete option", () => {

            test("Can set closeOnPaymentComplete, which defaults to false", () => {
                checkout.init({ ident: "test" });
                expect(checkout.closeOnPaymentComplete).toBe(false);
                checkout.init({ ident: "test", closeOnPaymentComplete: true });
                expect(checkout.closeOnPaymentComplete).toBe(true);
            });

            test("Warns if closeOnPaymentComplete option isn't valid, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({
                    ident: "test",
                    closeOnPaymentComplete: 123 as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid closeOnPaymentComplete option");
                expect(checkout.closeOnPaymentComplete).toBe(false);
            });
        });

        describe("defaultPaymentMethod option", () => {

            test("Can set defaultPaymentMethod, which defaults to undefined", () => {
                checkout.init({ ident: "test" });
                expect(checkout.defaultPaymentMethod).toBe(undefined);
                checkout.init({ ident: "test", defaultPaymentMethod: "paypal" });
                expect(checkout.defaultPaymentMethod).toBe("paypal");
            });

            test("Warns if defaultPaymentMethod option isn't valid, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                checkout.init({
                    ident: "test",
                    defaultPaymentMethod: 123 as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid default payment method option");
                expect(checkout.defaultPaymentMethod).toBe(undefined);
            });
        });
    });

    describe("Checkout on()", () => {

        test("Adds event callbacks", () => {
            checkout.on("open", () => {});
            expect(checkout.emitter.events).toHaveProperty("open");
        });

        test("Returns event unsubscribe function", () => {
            const unsubscribe = checkout.on("open", () => {});
            expect(unsubscribe).toBeTypeOf("function");
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

        test("Warns when event name isn't valid, but still returns a dummy unsubscriber", () => {
            const spy = vi.spyOn(console, "warn");
            const unsubscribe = checkout.on("invalid" as any, () => {});
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith("Tebex.js warning: invalid event name \"invalid\"");
            expect(unsubscribe).toBeTypeOf("function");
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

        test("Invokes callback before creating the iframe (lightbox path)", async () => {
            let iframeExistedDuringCallback = false;

            checkout.init({ ident: __TEST_BASKET_IDENT__, popupOnMobile: true });
            await checkout.launch(() => {
                iframeExistedDuringCallback = !!document.body.querySelector(".tebex-js-lightbox iframe");
                return Promise.resolve(__TEST_BASKET_IDENT__);
            });

            expect(iframeExistedDuringCallback).toBe(false);
            expect(document.body.querySelector(".tebex-js-lightbox iframe")).not.toBeNull();
        });

        test("Awaits async callback before creating the iframe (lightbox path)", async () => {
            let iframeExistedDuringCallback = false;

            checkout.init({ ident: __TEST_BASKET_IDENT__, popupOnMobile: true });
            await checkout.launch(async () => {
                await new Promise<void>(resolve => setTimeout(resolve, 10));
                iframeExistedDuringCallback = !!document.body.querySelector(".tebex-js-lightbox iframe");
                return __TEST_BASKET_IDENT__;
            });

            expect(iframeExistedDuringCallback).toBe(false);
            expect(document.body.querySelector(".tebex-js-lightbox iframe")).not.toBeNull();
        });

        test("Opens blank popup before invoking callback (mobile path)", async () => {
            const openSpy = vi.spyOn(window, "open");
            let popupOpenedDuringCallback = false;

            checkout.init({ ident: __TEST_BASKET_IDENT__ });
            await checkout.launch(() => {
                popupOpenedDuringCallback = openSpy.mock.calls.length > 0;
                return Promise.resolve(__TEST_BASKET_IDENT__);
            });

            expect(popupOpenedDuringCallback).toBe(true);
            expect(openSpy).toHaveBeenCalled();
        });

        test("Opens blank popup before async callback resolves (mobile path)", async () => {
            const openSpy = vi.spyOn(window, "open");
            let popupOpenedDuringCallback = false;

            checkout.init({ ident: __TEST_BASKET_IDENT__ });
            await checkout.launch(async () => {
                await new Promise<void>(resolve => setTimeout(resolve, 10));
                popupOpenedDuringCallback = openSpy.mock.calls.length > 0;
                return __TEST_BASKET_IDENT__;
            });

            expect(popupOpenedDuringCallback).toBe(true);
            expect(openSpy).toHaveBeenCalled();
        });

        test("Throws if no ident is set and no callback is provided (mobile path)", async () => {
            checkout.init({});
            await expect(checkout.launch()).rejects.toThrow("A basket ident must be set via init() before calling launch() without a callback");
        });

        test("Throws if no ident is set and no callback is provided (lightbox path)", async () => {
            checkout.init({ popupOnMobile: true });
            await expect(checkout.launch()).rejects.toThrow("A basket ident must be set via init() before calling launch() without a callback");
        });

        test("Throws if callback does not return a valid ident (mobile path)", async () => {
            checkout.init({});
            await expect(checkout.launch(async () => undefined as any)).rejects.toThrow("The launch callback must return a valid basket identifier");
        });

        test("Throws if callback does not return a valid ident (lightbox path)", async () => {
            checkout.init({ popupOnMobile: true });
            await expect(checkout.launch(async () => undefined as any)).rejects.toThrow("The launch callback must return a valid basket identifier");
        });

        test("Throws if callback returns an empty string (mobile path)", async () => {
            checkout.init({});
            await expect(checkout.launch(async () => "" as any)).rejects.toThrow("The launch callback must return a valid basket identifier");
        });

        test("Throws if callback returns an empty string (lightbox path)", async () => {
            checkout.init({ popupOnMobile: true });
            await expect(checkout.launch(async () => "" as any)).rejects.toThrow("The launch callback must return a valid basket identifier");
        });

        test("Throws if callback throws an error (mobile path)", async () => {
            checkout.init({});
            await expect(checkout.launch(async () => { throw new Error("test"); })).rejects.toThrow("The launch callback threw an error: test");
        });

        test("Throws if callback throws an error (lightbox path)", async () => {
            checkout.init({ popupOnMobile: true });
            await expect(checkout.launch(async () => { throw new Error("test"); })).rejects.toThrow("The launch callback threw an error: test");
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