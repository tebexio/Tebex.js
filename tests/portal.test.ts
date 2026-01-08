import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { destroy } from "zoid";

import Portal from "../src/portal";

describe("Portal", () => {

    let portal: Portal;

    beforeEach(() => {
        portal = new Portal();
    });

    afterEach(() => {
        destroy();
        document.body.innerHTML = "";
        vi.clearAllMocks();
    });

    describe("Portal init()", () => {
        
        describe("token option", () => {

            test("Throws if token option is not specified", () => {
                expect(() => portal.init({} as any)).toThrow();
            });

            test("Class token member reflects token option", () => {
                portal.init({ token: "test-token" });
                expect(portal.token).toBe("test-token");
            });
        });

        describe("locale option", () => {

            test("Locale can be set with locale option, and defaults to null", () => {
                portal.init({ token: "test-token" });
                expect(portal.locale).toBe(null);
                portal.init({ token: "test-token", locale: "en_US" });
                expect(portal.locale).toBe("en_US");
            });

            test("Warns if locale isn't a string, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({ token: "test-token", locale: 123 as any });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid locale option");
                expect(portal.locale).toBe(null);
            });

            test("Warns if locale is an empty string, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({ token: "test-token", locale: "" });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid locale option");
                expect(portal.locale).toBe(null);
            });
        });

        describe("theme option", () => {

            test("Theme can be set with theme option, and defaults to 'default'", () => {
                portal.init({ token: "test-token" });
                expect(portal.theme).toBe("default");
                portal.init({ token: "test-token", theme: "dark" });
                expect(portal.theme).toBe("dark");
            });

            test("Warns if theme isn't a string, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({ token: "test-token", theme: 123 as any });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid theme option");
                expect(portal.theme).toBe("default");
            });

            test("Warns if theme isn't a valid theme name, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({ token: "test-token", theme: "TEST" as any });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid theme option");
                expect(portal.theme).toBe("default");
            });
        });

        describe("colors option", () => {

            test("Colors defaults to empty array", () => {
                portal.init({ token: "test-token" });
                expect(portal.colors).toEqual([]);
            });

            test("Colors can be set by passing an array to the colors option", () => {
                portal.init({ token: "test-token", colors: [ { name: "primary", color: "#ff0000" } ] });
                expect(portal.colors).toEqual([ { name: "primary", color: "#ff0000" } ]);
            });

            test("Colors can be set by passing an object to the colors option", () => {
                portal.init({ token: "test-token", colors: { primary: "#ff0000" } });
                expect(portal.colors).toEqual([ { name: "primary", color: "#ff0000" } ]);
            });

            test("Warns if colors option isn't array or object, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
                    colors: "invalid" as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid colors option");
                expect(portal.colors).toMatchObject([]);
            });

            test("Warns if color array entry isn't an object, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
                    colors: [
                        "invalid" as any
                    ]
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid colors option item");
                expect(portal.colors).toMatchObject([]);
            });

            test("Warns if color array entry name is missing, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
                    colors: [
                        {
                            color: "#fff"
                        } as any
                    ]
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid colors option item - missing 'name' field");
                expect(portal.colors).toMatchObject([]);
            });

            test("Warns if color array entry value is missing, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
                    colors: [
                        {
                            name: "primary",
                        } as any
                    ]
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid colors option item - missing 'color' field");
                expect(portal.colors).toMatchObject([]);
            });

            test("Warns if color array entry name isn't valid, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
                    colors: [
                        {
                            name: "invalid" as any,
                            color: "#fff"
                        }
                    ]
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid color name");
                expect(portal.colors).toMatchObject([]);
            });

            test("Warns if color object key isn't valid, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
                    colors: {
                        invalid: "#fff"
                    } as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid color name");
                expect(portal.colors).toMatchObject([]);
            });

            test("Warns if color array entry value isn't valid, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
                    colors: [
                        {
                            name: "primary",
                            color: 123 as any
                        }
                    ]
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid color value \"123\"");
                expect(portal.colors).toMatchObject([]);
            });

            test("Warns if color object value isn't valid, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
                    colors: {
                        primary: 123
                    } as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid color value \"123\"");
                expect(portal.colors).toMatchObject([]);
            });

            test("Warns if color array entry value includes CSS variable, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
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
                expect(portal.colors).toMatchObject([]);
            });

            test("Warns if color object value includes CSS variable, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
                    colors: {
                        primary: "var(--color-primary)"
                    }
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid color value");
                expect(spy.mock.lastCall[0]).toContain("cannot include CSS variables");
                expect(portal.colors).toMatchObject([]);
            });
        });

        describe("popupOnMobile option", () => {

            test("Can set popupOnMobile, which defaults to false", () => {
                portal.init({ token: "test-token" });
                expect(portal.popupOnMobile).toBe(false);
                portal.init({ token: "test-token", popupOnMobile: true });
                expect(portal.popupOnMobile).toBe(true);
            });

            test("Warns if popupOnMobile option isn't valid, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
                    popupOnMobile: 123 as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid popupOnMobile option");
                expect(portal.popupOnMobile).toBe(false);
            });
        });

        describe("endpoint option", () => {

            test("Endpoint can be set with endpoint option, and defaults to https://portal.tebex.io", () => {
                portal.init({ token: "test-token" });
                expect(portal.endpoint).toBe("https://portal.tebex.io");
                portal.init({ token: "test-token", endpoint: "https://portal.test.tebex.io" });
                expect(portal.endpoint).toBe("https://portal.test.tebex.io");
            });

            test("Warns if endpoint option isn't valid, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
                    endpoint: 123 as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid endpoint option");
                expect(portal.endpoint).toBe("https://portal.tebex.io");
            });
        });

        describe("closeOnClickOutside option", () => {

            test("Can set closeOnClickOutside, which defaults to false", () => {
                portal.init({ token: "test-token" });
                expect(portal.closeOnClickOutside).toBe(false);
                portal.init({ token: "test-token", closeOnClickOutside: true });
                expect(portal.closeOnClickOutside).toBe(true);
            });

            test("Warns if closeOnClickOutside option isn't valid, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
                    closeOnClickOutside: 123 as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid closeOnClickOutside option");
                expect(portal.closeOnClickOutside).toBe(false);
            });
        });

        describe("closeOnEsc option", () => {

            test("Can set closeOnEsc, which defaults to false", () => {
                portal.init({ token: "test-token" });
                expect(portal.closeOnEsc).toBe(false);
                portal.init({ token: "test-token", closeOnEsc: true });
                expect(portal.closeOnEsc).toBe(true);
            });

            test("Warns if closeOnEsc option isn't valid, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
                    closeOnEsc: 123 as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid closeOnEsc option");
                expect(portal.closeOnEsc).toBe(false);
            });
        });

        describe("logo option", () => {

            test("Logo defaults to null", () => {
                portal.init({ token: "test-token" });
                expect(portal.logo).toBe(null);
            });

            test("Logo can be set with a string, and gets converted to object with light and dark", () => {
                portal.init({ token: "test-token", logo: "https://example.com/logo.png" });
                expect(portal.logo).toEqual({
                    light: "https://example.com/logo.png",
                    dark: "https://example.com/logo.png"
                });
            });

            test("Logo can be set with an object containing light and dark properties", () => {
                portal.init({
                    token: "test-token",
                    logo: {
                        light: "https://example.com/logo-light.png",
                        dark: "https://example.com/logo-dark.png"
                    }
                });
                expect(portal.logo).toEqual({
                    light: "https://example.com/logo-light.png",
                    dark: "https://example.com/logo-dark.png"
                });
            });

            test("Warns if logo is an empty string, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({ token: "test-token", logo: "" });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid logo option");
                expect(spy.mock.lastCall[0]).toContain("must be a non-empty string");
                expect(portal.logo).toBe(null);
            });

            test("Warns if logo object is missing 'light' field, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
                    logo: {
                        dark: "https://example.com/logo-dark.png"
                    } as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid logo option - missing 'light' field");
                expect(portal.logo).toBe(null);
            });

            test("Warns if logo object is missing 'dark' field, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
                    logo: {
                        light: "https://example.com/logo-light.png"
                    } as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid logo option - missing 'dark' field");
                expect(portal.logo).toBe(null);
            });

            test("Warns if logo object 'light' property is not a non-empty string, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
                    logo: {
                        light: "",
                        dark: "https://example.com/logo-dark.png"
                    }
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid logo option light property");
                expect(spy.mock.lastCall[0]).toContain("must be a non-empty string");
                expect(portal.logo).toBe(null);
            });

            test("Warns if logo object 'dark' property is not a non-empty string, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
                    logo: {
                        light: "https://example.com/logo-light.png",
                        dark: ""
                    }
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid logo option dark property");
                expect(spy.mock.lastCall[0]).toContain("must be a non-empty string");
                expect(portal.logo).toBe(null);
            });

            test("Warns if logo is neither a string nor an object, and falls back to default", () => {
                const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
                portal.init({
                    token: "test-token",
                    logo: 123 as any
                });
                expect(spy).toHaveBeenCalledOnce();
                expect(spy.mock.lastCall[0]).toContain("invalid logo option");
                expect(spy.mock.lastCall[0]).toContain("must be a string or an object with 'light' and 'dark' properties");
                expect(portal.logo).toBe(null);
            });
        });
    });

    describe("Portal on()", () => {

        test("Adds event callbacks", () => {
            portal.on("open", () => {});
            expect(portal.emitter.events).toHaveProperty("open");
        });

        test("Returns event unsubscribe function", () => {
            const unsubscribe = portal.on("open", () => {});
            expect(unsubscribe).toBeTypeOf("function");
            expect(portal.emitter.events["open"].length).toBe(1);
            unsubscribe();
            expect(portal.emitter.events["open"].length).toBe(0);
        });

        test("Event callback functions are fired when the event is emitted", () => {
            const spy = vi.fn();
            portal.on("open", spy);
            portal.emitter.emit("open");
            expect(spy).toHaveBeenCalled();
        });

        test("Warns when event name isn't valid, but still returns a dummy unsubscriber", () => {
            const spy = vi.spyOn(console, "warn");
            const unsubscribe = portal.on("invalid" as any, () => {});
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith("Tebex.js warning: invalid event name \"invalid\"");
            expect(unsubscribe).toBeTypeOf("function");
        });

    });

    describe("Portal launch()", () => {

        test("On mobile, opens a popup in a new window by default", async () => {
            const spy = vi.spyOn(window, "open");

            portal.init({ token: "test-token" });
            await portal.launch();

            expect(document.body.querySelector(".tebex-js-lightbox")).toBeNull();
            expect(spy).toHaveBeenCalled();
        });

        test("Opens lightbox on desktop, or if popupOnMobile is true", async () => {
            // popupOnMobile used here to force lightbox; the Playwright driver forces viewport to be small enough to be considered "mobile"
            portal.init({ token: "test-token", popupOnMobile: true });
            await portal.launch();
            
            expect(document.body.querySelector(".tebex-js-lightbox")).not.toBeNull();
        });

        test("Lightbox contains Zoid iframe", async () => {
            portal.init({ token: "test-token", popupOnMobile: true });
            await portal.launch();

            const iframe = document.body.querySelector<HTMLIFrameElement>(".tebex-js-lightbox iframe");
            expect(iframe).not.toBeNull();
            expect(iframe.name.startsWith("__zoid__")).toBe(true);
        });

        test("Fires \"open\" event", async () => {
            const spy = vi.fn();

            portal.init({ token: "test-token", popupOnMobile: true });
            portal.on("open", spy);

            await portal.launch();
            expect(spy).toHaveBeenCalled();
        });

    });

    describe("Portal render()", () => {

        test("Renders portal iframe to a custom location", async () => {
            const el = document.createElement("div");
            document.body.appendChild(el); 

            portal.init({ token: "test-token" });
            await portal.render(el, 800, 700, false);

            const iframe = el.querySelector<HTMLIFrameElement>("iframe");
            expect(iframe).not.toBeNull();
            expect(iframe.name.startsWith("__zoid__")).toBe(true);
        });

        test("Renders portal iframe with the given dimensions", async () => {
            const el = document.createElement("div");
            document.body.appendChild(el); 

            portal.init({ token: "test-token" });
            await portal.render(el, 123, 456, false);

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

            portal.init({ token: "test-token" });
            await portal.render(el, 800, 700, true);

            expect(el.querySelector<HTMLIFrameElement>("iframe")).toBeNull();
            expect(spy).toHaveBeenCalled();
        });

        test("Fires \"open\" event", async () => {
            const spy = vi.fn();
            const el = document.createElement("div");
            document.body.appendChild(el); 

            portal.init({ token: "test-token" });
            portal.on("open", spy);
            await portal.render(el, 800, 700, false);

            expect(spy).toHaveBeenCalled();
        });

        test("Throws if element is not in document", async () => {
            const el = document.createElement("div");
            // Don't append to document

            portal.init({ token: "test-token" });
            await expect(portal.render(el, 800, 700, false)).rejects.toThrow();
        });

    });

    describe("Portal close()", () => {

        test("Cleans up lightbox elements if used", async () => {
            // popupOnMobile used here to force lightbox; the Playwright driver forces viewport to be small enough to be considered "mobile"
            portal.init({ token: "test-token", popupOnMobile: true });

            await portal.launch();
            expect(document.body.querySelector(".tebex-js-lightbox")).not.toBeNull();

            await portal.close();
            expect(document.body.querySelector(".tebex-js-lightbox")).toBeNull();
        });

        test("Fires \"close\" event", async () => {
            const spy = vi.fn();

            portal.init({ token: "test-token", popupOnMobile: true });
            portal.on("close", spy);
            await portal.launch();
            await portal.close();

            expect(spy).toHaveBeenCalled();
        });

    });

    describe("Portal destroy()", () => {

        test("Cleans up lightbox elements if used", async () => {
            // popupOnMobile used here to force lightbox; the Playwright driver forces viewport to be small enough to be considered "mobile"
            portal.init({ token: "test-token", popupOnMobile: true });

            await portal.launch();
            expect(document.body.querySelector(".tebex-js-lightbox")).not.toBeNull();

            portal.destroy();
            expect(document.body.querySelector(".tebex-js-lightbox")).toBeNull();
        });

        test("Fires \"close\" event", async () => {
            const spy = vi.fn();

            portal.init({ token: "test-token", popupOnMobile: true });
            portal.on("close", spy);
            await portal.launch();
            portal.destroy();

            expect(spy).toHaveBeenCalled();
        });

    });

});
