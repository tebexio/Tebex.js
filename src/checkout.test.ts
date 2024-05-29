import { describe, test, expect, beforeEach, vi } from "vitest";

import Checkout from "./checkout";

describe("Checkout", () => {

    let checkout: Checkout;

    beforeEach(() => {
        checkout = new Checkout();
    });

    describe("Checkout init()", () => {

        test("Class members reflect options", () => {
            checkout.init({ ident: "test" });
            expect(checkout.ident).toBe("test");
        });

        test("Theme defaults to light", () => {
            checkout.init({ ident: "test" });
            expect(checkout.theme).toBe("light");
            checkout.init({ ident: "test", theme: "dark" });
            expect(checkout.theme).toBe("dark");
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

    describe.todo("Checkout launch()", () => {

        // TODO: figure out a way to test this; zoid doesn't want to play ball with jsdom

    });

    describe.todo("Checkout render()", () => {

        // TODO: figure out a way to test this; zoid doesn't want to play ball with jsdom

    });

});