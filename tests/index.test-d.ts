import { describe, test, expectTypeOf } from "vitest";

import tebex, {
    checkout,
    portal,
    events,
    version,
    type CheckoutOptions,
    type CheckoutColorDefinition,
    type CheckoutEvent,
    type CheckoutEventMap,
    type CheckoutTheme,
    type CheckoutZoidProps,
    type TebexTheme
} from "../src/index";
import { TebexColorDefinition } from "../src/common";

describe("Typechecks", () => {

    test("Exports Tebex object as the default", () => {
        expectTypeOf(tebex).toBeObject();
        expectTypeOf(tebex).toHaveProperty("version");
        expectTypeOf(tebex).toHaveProperty("events");
        expectTypeOf(tebex).toHaveProperty("checkout");
        expectTypeOf(tebex).toHaveProperty("portal");
    });

    test("Named export types match their Tebex object equivalents", () => {
        expectTypeOf(tebex.version).toMatchTypeOf<typeof version>();
        expectTypeOf(tebex.events).toMatchTypeOf<typeof events>();
        expectTypeOf(tebex.checkout).toMatchTypeOf<typeof checkout>();
        expectTypeOf(tebex.portal).toMatchTypeOf<typeof portal>();
    });

    describe("Type exports match publicly documented API", () => {

        test("CheckoutOptions", () => {
            expectTypeOf<CheckoutOptions>().toBeObject();
            expectTypeOf<CheckoutOptions>().toMatchTypeOf<{
                ident: string;
                theme?: "light" | "dark" | "default" | "auto";
                closeOnClickOutside?: boolean;
                closeOnEsc?: boolean;
                colors?: {
                    name: "primary" | "secondary" | "background" | "surface" | "surface-variant" | "success" | "warning" | "error" | "green" | "red" | "fields" | "field-border",
                    color: string
                }[];
                defaultPaymentMethod?: string;
                popupOnMobile?: boolean;
                endpoint?: string;
            }>();
        });

        test("TebexColorDefinition", () => {
            expectTypeOf<TebexColorDefinition>().toBeObject();
            expectTypeOf<TebexColorDefinition>().toMatchTypeOf<{
                name: "primary" | "secondary" | "background" | "surface" | "surface-variant" | "success" | "warning" | "error" | "green" | "red" | "fields" | "field-border",
                color: string
            }>();
        });

        // TODO: TebexColorConfig

        test("CheckoutEvent", () => {
            expectTypeOf<CheckoutEvent>().toBeString();
            expectTypeOf<CheckoutEvent>().toMatchTypeOf<
                | "open"
                | "close"
                | "payment:complete"
                | "payment:error"
            >();
        });

        test("CheckoutEventMap", () => {
            expectTypeOf<CheckoutEventMap>().toBeObject();
            expectTypeOf<CheckoutEventMap>().toMatchTypeOf<
                Record<
                    | "open"
                    | "close"
                    | "payment:complete"
                    | "payment:error", 
                    Function
                >
            >();
        });

        test("TebexTheme", () => {
            expectTypeOf<TebexTheme>().toBeString();
            expectTypeOf<TebexTheme>().toMatchTypeOf<"light" | "dark" | "default" | "auto">();
        });

        test("CheckoutZoidProps", () => {
            expectTypeOf<CheckoutZoidProps>().toBeObject();
            expectTypeOf<CheckoutZoidProps>().toMatchTypeOf<{
                locale: string;
                colors: {
                    name: "primary" | "secondary" | "background" | "surface" | "surface-variant" | "success" | "warning" | "error" | "green" | "red" | "fields" | "field-border",
                    color: string
                }[];
                closeOnClickOutside: boolean;
                closeOnEsc: boolean;
                defaultPaymentMethod?: string;
                theme: "light" | "dark" | "default" | "auto";
                onOpenWindow: (url: string) => void;
                onClosePopup: () => Promise<void>;
                onPaymentComplete: (e: any) => void;
                onPaymentError: (e: any) => void;
                isApplePayAvailable: boolean;
                isEmbedded: boolean;
                referrer: string;
                origin: string;
                path: string;
                params: string;
                version: string;
            }>();
        });

    });

    describe("Legacy type exports match legacy API", () => {
        test("CheckoutTheme", () => {
            expectTypeOf<CheckoutTheme>().toBeString();
            expectTypeOf<CheckoutTheme>().toMatchTypeOf<"light" | "dark" | "default" | "auto">();
        });

        test("CheckoutColorDefinition", () => {
            expectTypeOf<CheckoutColorDefinition>().toBeObject();
            expectTypeOf<CheckoutColorDefinition>().toMatchTypeOf<{
                name: "primary" | "secondary" | "background" | "surface" | "surface-variant" | "success" | "warning" | "error" | "green" | "red" | "fields" | "field-border",
                color: string
            }>();
        });
    });

    describe("JS exports match publicly documented API", () => {

        test("Tebex.version", () => {
            expectTypeOf(tebex.version).toBeString();
        });

        test("Tebex.events", () => {
            expectTypeOf(tebex.events).toBeObject();
            expectTypeOf(tebex.events).toMatchTypeOf<{
                OPEN: string;
                CLOSE: string;
                PAYMENT_COMPLETE: string;
                PAYMENT_ERROR: string;
            }>();
        });

        test("Tebex.checkout", () => {
            expectTypeOf(tebex.checkout).toBeObject();
            expectTypeOf(tebex.checkout).toMatchTypeOf<{
                init: Function;
                launch: Function;
                render: Function;
            }>();
        });

        test("Tebex.checkout.init", () => {
            expectTypeOf(tebex.checkout.init).toBeFunction();
            expectTypeOf(tebex.checkout.init).returns.toMatchTypeOf<void>();
            expectTypeOf(tebex.checkout.init).parameter(0).toMatchTypeOf<{
                ident: string;
                theme?: "light" | "dark" | "default" | "auto";
                closeOnClickOutside?: boolean;
                closeOnEsc?: boolean;
                colors?: {
                    name: "primary" | "secondary" | "background" | "surface" | "surface-variant" | "success" | "warning" | "error" | "green" | "red" | "fields" | "field-border",
                    color: string
                }[];
                defaultPaymentMethod?: string;
                popupOnMobile?: boolean;
                endpoint?: string;
            }>();
        });

        test("Tebex.checkout.launch", () => {
            expectTypeOf(tebex.checkout.launch).toBeFunction();
            expectTypeOf(tebex.checkout.launch).returns.toMatchTypeOf<Promise<void>>();
            expectTypeOf(tebex.checkout.launch).parameter(0).toBeVoid;
        });

        test("Tebex.checkout.render", () => {
            expectTypeOf(tebex.checkout.render).toBeFunction();
            expectTypeOf(tebex.checkout.render).returns.toMatchTypeOf<Promise<void>>();
            expectTypeOf(tebex.checkout.render).parameter(0).toMatchTypeOf<HTMLElement>();
            expectTypeOf(tebex.checkout.render).parameter(1).toMatchTypeOf<string | number>();
            expectTypeOf(tebex.checkout.render).parameter(2).toMatchTypeOf<string | number>();
            expectTypeOf(tebex.checkout.render).parameter(3).toMatchTypeOf<boolean>();
        });

        test("Tebex.checkout.close", () => {
            expectTypeOf(tebex.checkout.close).toBeFunction();
            expectTypeOf(tebex.checkout.close).returns.toMatchTypeOf<Promise<void>>();
            expectTypeOf(tebex.checkout.close).parameter(0).toBeVoid;
        });

        describe("Tebex.checkout.on", () => {

            test("Base type", () => {
                expectTypeOf(tebex.checkout.on).toBeFunction();
                expectTypeOf(tebex.checkout.on).returns.toBeFunction();
            });

            test("Event: open", () => {
                expectTypeOf(tebex.checkout.on<"open">).parameter(0).toMatchTypeOf<"open">();
                expectTypeOf(tebex.checkout.on<"open">).parameter(1).toMatchTypeOf<() => void>();
            });

            test("Event: close", () => {
                expectTypeOf(tebex.checkout.on<"close">).parameter(0).toMatchTypeOf<"close">();
                expectTypeOf(tebex.checkout.on<"close">).parameter(1).toMatchTypeOf<() => void>();
            });

            test("Event: payment:complete", () => {
                expectTypeOf(tebex.checkout.on<"payment:complete">).parameter(0).toMatchTypeOf<"payment:complete">();
                expectTypeOf(tebex.checkout.on<"payment:complete">).parameter(1).toMatchTypeOf<(e: Event) => void>();
            });

            test("Event: payment:error", () => {
                expectTypeOf(tebex.checkout.on<"payment:error">).parameter(0).toMatchTypeOf<"payment:error">();
                expectTypeOf(tebex.checkout.on<"payment:error">).parameter(1).toMatchTypeOf<(e: Event) => void>();
            });
            
        });

    });
});