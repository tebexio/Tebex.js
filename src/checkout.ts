import zoid from "zoid";
import { createNanoEvents } from "nanoevents";

import { Lightbox } from "./lightbox";
import { spinnerRender } from "./spinner";

import {
    type CssDimension,
    type Implements,
    assert,
    isInDocument,
    isApplePayAvailable,
    isMobile,
    isNullOrUndefined,
    isString
} from "./utils";

const DEFAULT_WIDTH = "800px";
const DEFAULT_HEIGHT = "760px";

export const THEME_NAMES = [
    "default",
    "light",
    "dark",
    // "auto", TODO: detect user's preference for light/dark theme
] as const;

export const COLOR_NAMES = [
    "primary",
    "secondary"
] as const;

export const EVENT_NAMES = [
    "open",
    "close",
    "payment:complete",
    "payment:error"
] as const;

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
}; // TODO: might make this legacy (but still supported), and just define colors as an object of { name: color }

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

    ident: string = null;
    locale: string = null;
    theme: CheckoutTheme = "default";
    colors: CheckoutColorDefinition[] =  [];
    endpoint = "https://pay.tebex.io";
    popupOnMobile = false;

    isOpen = false;
    emitter = createNanoEvents<CheckoutEventMap>();
    lightbox: Lightbox = null;

    component: any = null;
    zoid: any = null;

    #didRender = false;
    #onRender: Function;

    /**
     * Configure the Tebex checkout settings.
     */
    init(options: CheckoutOptions) {
        this.ident = options.ident;
        this.locale = options.locale ?? null;
        this.theme = options.theme ?? this.theme;
        this.colors = options.colors ?? this.colors;
        this.endpoint = options.endpoint ?? this.endpoint;
        this.popupOnMobile = options.popupOnMobile ?? this.popupOnMobile;
        
        assert(!isNullOrUndefined(this.ident), "ident option is required");
        assert(THEME_NAMES.includes(this.theme), `invalid theme option "${ this.theme }"`);

        for (let { color, name } of this.colors) {
            assert(COLOR_NAMES.includes(name), `invalid color name "${ name }"`);
            assert(!color.includes("var("), `invalid ${ name } color: colors cannot include CSS variables`);
        }
    }
    
    /**
     * Subscribe to Tebex checkout events, such as when the embed is closed or when a payment is completed.
     * NOTE: None of these events should not be used to confirm actual receipt of payment - you should use Webhooks for that.
     */
    on<T extends CheckoutEvent>(event: T, callback: CheckoutEventMap[T]) {
        // @ts-ignore - handles legacy event name
        if (event === "payment_complete")
            event = "payment:complete" as T;
        // @ts-ignore - handles legacy event name
        if (event === "payment_error")
            event = "payment:error" as T;

        assert(EVENT_NAMES.includes(event), `invalid event name "${ event }"`);
        return this.emitter.on(event, callback);
    }

    /**
     * Launch the Tebex checkout panel.
     * On desktop, the panel will launch in a "lightbox" mode that covers the screen. On mobile, it will be opened as a new page.
     */
    async launch() {
        if (!this.popupOnMobile && isMobile(DEFAULT_WIDTH, DEFAULT_HEIGHT)) {
            await this.#renderComponent(document.body, true);
            this.isOpen = true;
            this.emitter.emit("open");
            return;
        }

        await this.#showLightbox();
    }

    /**
     * Close the Tebex checkout panel.
     */
    async close() {
        if (this.lightbox)
            await this.lightbox.hide();
        
        if (this.zoid) {
            await this.zoid.close();
            this.isOpen = false;
            this.emitter.emit("close");
        }
    }

    /**
     * Close and destroy the element immediately, without waiting for CSS transitions.
     */
    destroy() {
        if (this.lightbox)
            this.lightbox.destroy();
        
        if (this.zoid) {
            this.zoid.close();
            this.isOpen = false;
            this.emitter.emit("close");
        }
    }

    /**
     * Render the Tebex checkout panel immediately, into a specified HTML element.
     * If `popupOnMobile` is true, then on mobile devices the checkout will be immediately opened as a new page instead.
     */
    async render(element: HTMLElement, width: CssDimension, height: CssDimension, popupOnMobile = this.popupOnMobile) {
        // Zoid requires that elements are already in the page, otherwise it throws a confusing error.
        assert(isInDocument(element), "Target element must already be inserted into the page before it can be used");

        width = isString(width) ? width : `${ width }px`;
        height = isString(height) ? height : `${ height }px`;
        
        this.#buildComponent(width, height);
        await this.#renderComponent(element, popupOnMobile && isMobile(width, height));
        this.isOpen = true;
        this.emitter.emit("open");
    }

    /**
     * Await internal Zoid render tests - primarily exposed for tests.
     * @internal
     */
    async renderFinished() {
        return new Promise<void>(resolve => {
            this.#onRender = resolve;
            if (this.#didRender)
                resolve();
        });
    }

    async #showLightbox() {
        if (!this.lightbox)
            this.lightbox = new Lightbox();

        await this.lightbox.show();
        await this.#renderComponent(this.lightbox.holder, false);
        this.isOpen = true;
        this.emitter.emit("open");
    }

    #buildComponent(width: CssDimension = DEFAULT_WIDTH, height: CssDimension = DEFAULT_HEIGHT) {
        this.component = zoid.create({
            tag: "tebex-js-checkout-component",
            url: () => this.endpoint + "/" + this.ident,
            autoResize: {
                width: false,
                height: false,
            },
            dimensions: {
                width,
                height,
            },
            prerenderTemplate: spinnerRender,
            attributes: {
                iframe: {
                    allow: "payment https://pay.tebex.io",
                },
            },
        });
    }

    async #renderComponent(container: HTMLElement, popup: boolean) {
        const url = new URL(window.location.href);

        if (!this.component)
            this.#buildComponent();

        this.zoid = this.component({
            locale: this.locale,
            colors: this.colors,
            theme: this.theme,
            onOpenWindow: (url) => {
                window.open(url);
            },
            onClosePopup: async () => {
                await this.zoid.close();
                if (this.lightbox) 
                    await this.lightbox.hide();
                
                this.isOpen = false;
                this.emitter.emit("close");
            },
            onPaymentComplete: (e) => {
                this.emitter.emit("payment:complete", e);
            },
            onPaymentError: (e) => {
                this.emitter.emit("payment:error", e);
            },
            isApplePayAvailable: isApplePayAvailable(),
            isEmbedded: !popup,
            referrer: url.hostname,
            path: url.pathname,
            version: __VERSION__
        });

        await this.zoid.renderTo(window, container, popup ? "popup" : "iframe");

        this.#didRender = true;
        if (this.#onRender)
            this.#onRender();
    }
}