import zoid from "zoid";
import { createNanoEvents } from "nanoevents";

import { Lightbox } from "./lightbox";
import { spinnerRender } from "./spinner";

import { type Implements, assert, isApplePayAvailable, isMobile, isNullOrUndefined } from "./utils";

/**
 * Configuration options for `Tebex.checkout.init()`.
 */
export type CheckoutOptions = {
    /**
     * The ident received from either the Headless or Checkout APIs.
     */
    ident: string;
    /**
     * Tebex checkout panel color theme.
     */
    theme?: CheckoutTheme;
    /**
     * Tebex checkout panel UI brand colors.
     */
    colors?: CheckoutColorDefinition[];
    /**
     * API endpoint to use. Do not change this unless otherwise guided to do so.
     * @internal
     */
    endpoint?: string;
};

/**
 * Color theme for the embedded Tebex checkout panel.
 */
export type CheckoutTheme = 
    | "light"
    | "dark"
;

/**
 * Color definition. The `color` property can be set to any valid CSS color, so long as it does not rely on CSS Variables.
 */
export type CheckoutColorDefinition = {
    name: "primary" | "secondary";
    color: string;
}; // TODO: might make this legacy (but still supported), and just define colors as an object of { name: color }

/**
 * Checkout event type. You can subscribe to checkout events with `Tebex.checkout.on()`.
 */
export type CheckoutEvent = 
    | "open"
    | "close"
    | "payment:complete"
    | "payment:error"
;

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
    theme: CheckoutTheme = "light"; // TODO: add "auto" mode that auto-detects user theme preference
    colors: CheckoutColorDefinition[] =  [];
    endpoint = "https://pay.tebex.io";

    emitter = createNanoEvents<CheckoutEventMap>();
    lightbox: Lightbox = null;

    component: any = null;
    zoid: any = null;

    /**
     * Configure the Tebex checkout settings.
     */
    init(options: CheckoutOptions) {
        this.ident = options.ident;
        this.theme = options.theme ?? "light";
        this.colors = options.colors ?? [];
        this.endpoint = options.endpoint ?? this.endpoint;
        
        assert(!isNullOrUndefined(this.ident), "ident option is required");

        for (let { color, name } of this.colors)
            assert(!color.includes("var("), `invalid ${ name } color: colors cannot include CSS variables`);
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

        return this.emitter.on(event, callback);
    }

    /**
     * Launch the Tebex checkout panel.
     * On desktop, the panel will launch in a "lightbox" mode that covers the screen. On mobile, it will be opened as a new page.
     */
    async launch() {
        if (isMobile()) {
            this.#renderComponent(document.body, true);
            this.emitter.emit("open");
            return;
        }

        await this.#showLightbox();
    }

    /**
     * Render the Tebex checkout panel immediately, into a specified HTML element.
     * If `popupOnMobile` is true, then on mobile devices the checkout will be immediately opened as a new page instead.
     */
    render(element: HTMLElement, width: string, height: string, popupOnMobile = true) {
        this.#buildComponent(width, height);
        this.#renderComponent(element, popupOnMobile && isMobile());
        this.emitter.emit("open");
    }

    async #showLightbox() {
        if (!this.lightbox)
            this.lightbox = new Lightbox();

        await this.lightbox.show();
        this.#renderComponent(this.lightbox.holder, false);
        this.emitter.emit("open");
    }

    #buildComponent(width = "800px", height = "760px") {
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

    #renderComponent(container: Element, popup: boolean) {
        const url = new URL(window.location.href);

        if (!this.component)
            this.#buildComponent();

        this.zoid = this.component({
            colors: this.colors,
            theme: this.theme,
            onOpenWindow: (url) => {
                window.open(url);
            },
            onClosePopup: async () => {
                await this.zoid.close();
                if (this.lightbox) 
                    await this.lightbox.hide();
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

        this.zoid.render(container, popup ? "popup" : "iframe");
    }
}