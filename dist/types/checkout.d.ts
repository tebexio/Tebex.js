import { Lightbox } from "./lightbox";
import { type CssDimension, type Implements } from "./utils";
export declare const THEME_NAMES: readonly ["auto", "default", "light", "dark"];
export declare const COLOR_NAMES: readonly ["primary", "secondary"];
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
     * The default language to use, defined as an ISO locale code - e.g. `"en_US" for American English, "de_DE" for German, etc.
     * @default `navigator.language`
     */
    locale?: string;
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
     * Whether to close the Tebex.js popup when the user clicks outside of the modal.
     * @default false
     */
    closeOnClickOutside?: boolean;
    /**
     * Whether to close the Tebex.js popup when the user presses the Escape key.
     * @default false
     */
    closeOnEsc?: boolean;
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
export type CheckoutTheme = typeof THEME_NAMES[number];
/**
 * Color definition. The `color` property can be set to any valid CSS color, so long as it does not rely on CSS Variables.
 */
export type CheckoutColorDefinition = {
    name: typeof COLOR_NAMES[number];
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
    locale: string;
    theme: CheckoutTheme;
    colors: CheckoutColorDefinition[];
    closeOnClickOutside: boolean;
    closeOnEsc: boolean;
    popupOnMobile: boolean;
    endpoint: string;
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
     * Close and destroy the element immediately, without waiting for CSS transitions.
     */
    destroy(): void;
    /**
     * Render the Tebex checkout panel immediately, into a specified HTML element.
     * If `popupOnMobile` is true, then on mobile devices the checkout will be immediately opened as a new page instead.
     */
    render(element: HTMLElement, width: CssDimension, height: CssDimension, popupOnMobile?: boolean): Promise<void>;
    /**
     * Await internal Zoid render tests - primarily exposed for tests.
     * @internal
     */
    renderFinished(): Promise<void>;
}
