import { Lightbox } from "./lightbox";
import { type CssDimension, type Implements } from "./utils";
export declare const EVENT_NAMES: readonly ["open", "close", "payment:complete", "payment:error"];
/**
 * Configuration options for `Tebex.checkout.init()`.
 */
export type CheckoutOptions = {
    /**
     * The checkout request ident received from either the Headless or Checkout APIs.
     */
    ident: string;
    /**
     * Tebex checkout panel color theme.
     * @default "light"
     */
    theme?: CheckoutTheme;
    /**
     * Tebex checkout panel UI brand colors.
     * @default []
     */
    colors?: CheckoutColorDefinition[];
    /**
     * Whether to still display a popup on mobile or not. If `false` or undefined, then calling `launch()` will open a new window on mobile devices.
     * @default false
     * @internal
     */
    popupOnMobile?: boolean;
    /**
     * API endpoint to use. Do not change this unless otherwise guided to do so.
     * @default ""
     * @internal
     */
    endpoint?: string;
};
/**
 * Color theme for the embedded Tebex checkout panel.
 */
export type CheckoutTheme = "light" | "dark";
/**
 * Color definition. The `color` property can be set to any valid CSS color, so long as it does not rely on CSS Variables.
 */
export type CheckoutColorDefinition = {
    name: "primary" | "secondary";
    color: string;
};
/**
 * Checkout event type. You can subscribe to checkout events with `Tebex.checkout.on()`.
 */
export type CheckoutEvent = typeof EVENT_NAMES[number];
/**
 * Maps a {@link CheckoutEvent} to its event callback type.
 */
export type CheckoutEventMap = Implements<Record<CheckoutEvent, Function>, {
    "open": () => void;
    "close": () => void;
    "payment:complete": (e: Event) => void;
    "payment:error": (e: Event) => void;
}>;
/**
 * Tebex checkout instance.
 */
export default class Checkout {
    #private;
    ident: string;
    theme: CheckoutTheme;
    colors: CheckoutColorDefinition[];
    endpoint: string;
    popupOnMobile: boolean;
    isOpen: boolean;
    emitter: import("nanoevents").Emitter<{
        open: () => void;
        close: () => void;
        "payment:complete": (e: Event) => void;
        "payment:error": (e: Event) => void;
    }>;
    lightbox: Lightbox;
    component: any;
    zoid: any;
    /**
     * Configure the Tebex checkout settings.
     */
    init(options: CheckoutOptions): void;
    /**
     * Subscribe to Tebex checkout events, such as when the embed is closed or when a payment is completed.
     * NOTE: None of these events should not be used to confirm actual receipt of payment - you should use Webhooks for that.
     */
    on<T extends CheckoutEvent>(event: T, callback: CheckoutEventMap[T]): import("nanoevents").Unsubscribe;
    /**
     * Launch the Tebex checkout panel.
     * On desktop, the panel will launch in a "lightbox" mode that covers the screen. On mobile, it will be opened as a new page.
     */
    launch(): Promise<void>;
    /**
     * Close the Tebex checkout panel.
     */
    close(): Promise<void>;
    /**
     *
     */
    destroy(): void;
    /**
     * Render the Tebex checkout panel immediately, into a specified HTML element.
     * If `popupOnMobile` is true, then on mobile devices the checkout will be immediately opened as a new page instead.
     */
    render(element: HTMLElement, width: CssDimension, height: CssDimension, popupOnMobile?: boolean): Promise<void>;
}
