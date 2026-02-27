import zoid, { 
    type ZoidComponent,
    type ZoidComponentInstance,
} from "zoid";

import {
    createNanoEvents,
    type Unsubscribe,
} from "nanoevents";

import {
    type TebexColorConfig,
    type TebexColorDefinition,
    type TebexTheme,
} from "./common";

import { Lightbox } from "./components/lightbox";
import { spinnerRender } from "./components/spinner";

import {
    type CssDimension,
    type Implements,
    assert,
    warn,
    isInDocument,
    isApplePayAvailable,
    isMobile,
    isNullOrUndefined,
    isString,
    isArray,
    isNonEmptyString,
    isObject,
    isBoolean,
    withTimeout,
    isNumber,
    err,
} from "./utils";
import { navigate } from "./utils/navigate";

const DEFAULT_WIDTH = "800px";
const DEFAULT_HEIGHT = "760px";

export const THEME_NAMES = [
    "auto",
    "default",
    "light",
    "dark"
] as const;

export const COLOR_NAMES = [
    "primary",
    "secondary",
    "background",
    "surface",
    "surface-variant",
    "success",
    "warning",
    "error",
    "green",
    "red",
    "fields",
    "field-border",
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
    ident?: string;
    /**
     * The default language to use, defined as an ISO locale code - e.g. `"en_US"` for American English, "de_DE" for German, etc.
     * @default `navigator.language`
     */
    locale?: string;
    /**
     * Tebex checkout panel color theme.
     * @default "light"
     */
    theme?: TebexTheme;
    /**
     * Tebex checkout panel UI brand colors.
     * @default []
     */
    colors?: TebexColorConfig;
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
     * Whether to automatically close the Tebex.js popup as soon as the payment is completed; `payment:complete` and `close` events will still be emitted.
     * @default false
     */
    closeOnPaymentComplete?: boolean;
    /**
     * Select a payment method to highlight on the checkout by passing its ident.
     * @default undefined
     */
    defaultPaymentMethod?: string;
    /**
     * Whether to still display a popup on mobile or not. If `false` or undefined, then calling `launch()` will open a new window on mobile devices.
     * @default false
     */
    popupOnMobile?: boolean;
    /**
     * API endpoint to use. Do not change this unless otherwise guided to do so.
     * @default ""
     * @internal
     */
    endpoint?: string;
    /**
     * The timeout in milliseconds for the launch callback.
     * @default 10_000
     */
    launchTimeout?: number;
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
 * Props passed through Zoid component.
 * @internal
 */
export type CheckoutZoidProps = {
    locale: string;
    colors: TebexColorConfig;
    closeOnClickOutside: boolean;
    closeOnEsc: boolean;
    closeOnPaymentComplete: boolean;
    defaultPaymentMethod?: string;
    theme: TebexTheme;
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
};

/**
 * Tebex checkout instance. 
 */
export default class Checkout {

    ident?: string;
    locale: string = null;
    theme: TebexTheme = "default";
    colors: TebexColorDefinition[] = [];
    closeOnClickOutside = false;
    closeOnEsc = false;
    closeOnPaymentComplete = false;
    defaultPaymentMethod?: string = undefined;
    popupOnMobile = false;
    endpoint = "https://pay.tebex.io";

    isOpen = false;
    emitter = createNanoEvents<CheckoutEventMap>();
    lightbox: Lightbox = null;
    launchTimeout: number = 10_000;

    componentFactory: ZoidComponent<CheckoutZoidProps> = null;
    zoid: ZoidComponentInstance = null;

    #didRender = false;
    #onRender: Function;

    /**
     * Configure the Tebex checkout settings.
     */
    init(options: CheckoutOptions) {
        this.ident = options.ident;
        this.locale = this.#resolveLocale(options) ?? this.locale;
        this.theme = this.#resolveTheme(options) ?? this.theme;
        this.colors = this.#resolveColors(options) ?? this.colors;
        this.popupOnMobile = this.#resolvePopupOnMobile(options) ?? this.popupOnMobile;
        this.endpoint = this.#resolveEndpoint(options) ?? this.endpoint;
        this.closeOnClickOutside = this.#resolveCloseOnClickOutside(options) ?? this.closeOnClickOutside;
        this.closeOnEsc = this.#resolveCloseOnEsc(options) ?? this.closeOnEsc;
        this.closeOnPaymentComplete = this.#resolveCloseOnPaymentComplete(options) ?? this.closeOnPaymentComplete;
        this.defaultPaymentMethod = this.#resolveDefaultPaymentMethod(options) ?? this.defaultPaymentMethod;
        this.launchTimeout = this.#resolveLaunchTimeout(options) ?? this.launchTimeout;
    }
    
    /**
     * Subscribe to Tebex checkout events, such as when the embed is closed or when a payment is completed.
     * NOTE: None of these events should not be used to confirm actual receipt of payment - you should use Webhooks for that.
     */
    on<T extends CheckoutEvent>(event: T, callback: CheckoutEventMap[T]): Unsubscribe {
        // @ts-ignore - handles legacy event name
        if (event === "payment_complete")
            event = "payment:complete" as T;

        // @ts-ignore - handles legacy event name
        if (event === "payment_error")
            event = "payment:error" as T;

        if (!EVENT_NAMES.includes(event)) {
            warn(`invalid event name "${ event }"`);
            return () => {};
        }

        return this.emitter.on(event, callback);
    }

    /**
     * Resolves the ident from the callback
     * Throws if the ident is not a valid string, if the callback throws or times out.
     */
    async #resolveIdentFromCallback(callback: () => Promise<string>) {
        try {
            this.ident = await withTimeout(
                callback(),
                this.launchTimeout,
                "timed out after " + this.launchTimeout + " milliseconds"
            );

            // Check that the ident is valid
            if (!this.ident || !isString(this.ident))
                err("invalid ident returned - ident = " + this.ident, "");

        } catch (error) {
            err("The callback provided to Tebex.checkout.launch() errored: " + error.message);
        }
    }

    /**
     * Opens a blank popup window synchronously (within the user gesture call stack) to avoid
     * popup blocking, resolves the ident via the callback, then passes the pre-opened window
     * to zoid via its built-in `window` prop, which suppresses zoid's own window.open call.
     */
    async #openMobilePopupWithCallback(callback: () => Promise<string>) {
        // Must be opened synchronously — browsers block window.open after an async operation.
        const preOpenedWin = window.open('', '_blank');

        if (preOpenedWin) {
            const spinner = spinnerRender({ props: {} });
            preOpenedWin.document.open();
            preOpenedWin.document.write(spinner.outerHTML);
            preOpenedWin.document.close();
        }

        try {
            await this.#resolveIdentFromCallback(callback);
        } catch (error) {
            preOpenedWin?.close();
            throw error;
        }

        if (!preOpenedWin) {
            warn("Failed to open a checkout in a new window, popup blocked, redirecting to checkout page instead");
            navigate(this.endpoint + "/" + this.ident);
            return;
        }

        await this.#createComponentInstance(document.body, true, preOpenedWin ?? undefined);
    }

    /**
     * Launch the Tebex checkout panel.
     * On desktop, the panel will launch in a "lightbox" mode that covers the screen. On mobile, it will be opened as a new page.
     * @param callback An optional async callback invoked before the checkout iframe is created. Use this to perform async work (e.g. fetching a basket) while the loading spinner is visible.
     */
    async launch(callback?: () => Promise<string>) {
        if (!callback)
            assert(this.ident && isString(this.ident), "A basket ident must be set via init() before calling launch() without a callback");

        // The user is on mobile, launch as a popup in a new window (unless popupOnMobile is false)
        if (!this.popupOnMobile && isMobile(DEFAULT_WIDTH, DEFAULT_HEIGHT)) {

            if (callback)
                await this.#openMobilePopupWithCallback(callback);
            else
                await this.#createComponentInstance(document.body, true);

            this.isOpen = true;
            this.emitter.emit("open");
            return;
        }

        // The user is on desktop, or popupOnMobile is true, launch as a lightbox
        await this.#showLightbox(callback);
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
        assert(this.ident && isString(this.ident), "The render method must be called after the checkout has been initialized with an ident");

        width = isString(width) ? width : `${ width }px`;
        height = isString(height) ? height : `${ height }px`;
        
        this.#createComponentFactory(width, height);
        await this.#createComponentInstance(element, popupOnMobile && isMobile(width, height));
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
    
    #resolveLocale(options: CheckoutOptions) {
        if (isNullOrUndefined(options.locale))
            return null;

        if (!isNonEmptyString(options.locale)) {
            warn(`invalid locale option "${ options.locale }" - must be a non-empty string`);
            return null;
        }
        
        return options.locale;
    }

    #resolveTheme(options: CheckoutOptions) {
        if (isNullOrUndefined(options.theme))
            return null;
 
        if(!THEME_NAMES.includes(options.theme)) {
            const list = THEME_NAMES.map(n => `"${ n }"`).join(", ");
            warn(`invalid theme option "${ options.theme }" - must be one of ${ list }`);
            return null;
        }

        return options.theme;
    }

    #resolveColors(options: CheckoutOptions) {
        if (isNullOrUndefined(options.colors))
            return null;

        if (!(isArray(options.colors) || isObject(options.colors))) {
            warn(`invalid colors option "${ options.colors }" - must be an array or object`);
            return null;
        }

        const colorList = isArray(options.colors) ? 
            options.colors : 
            Object.entries(options.colors).map(([name, color]) => ({ name, color } as TebexColorDefinition));

        for (let entry of colorList) {
            if (!isObject(entry)) {
                warn(`invalid colors option item ${ entry } - must be an object`);
                return null;
            }

            if (!entry.hasOwnProperty("name")) {
                warn(`invalid colors option item - missing 'name' field`);
                return null;
            }

            if (!entry.hasOwnProperty("color")) {
                warn(`invalid colors option item - missing 'color' field`);
                return null;
            }

            if (!COLOR_NAMES.includes(entry.name)) {
                const list = COLOR_NAMES.map(n => `"${ n }"`).join(", ");
                warn(`invalid color name "${ entry.name }" - must be one of ${ list }`);
                return null;
            }

            if (!isNonEmptyString(entry.color)) {
                warn(`invalid color value "${ entry.color }" - must be a non-empty string`);
                return null;
            }

            if (entry.color.includes("var(")) {
                warn(`invalid color value "${ entry.color }" - cannot include CSS variables`);
                return null;
            }
        }

        return colorList;
    }

    #resolvePopupOnMobile(options: CheckoutOptions) {
        if (isNullOrUndefined(options.popupOnMobile))
            return null;

        if (!isBoolean(options.popupOnMobile)) {
            warn(`invalid popupOnMobile option "${ options.popupOnMobile }" - must be a boolean`);
            return null;
        }

        return options.popupOnMobile;
    }

    #resolveEndpoint(options: CheckoutOptions) {
        if (isNullOrUndefined(options.endpoint))
            return null;

        if (!isNonEmptyString(options.endpoint)) {
            warn(`invalid endpoint option "${ options.endpoint }" - must be a non-empty string`);
            return null;
        }

        return options.endpoint;
    }

    #resolveCloseOnClickOutside(options: CheckoutOptions) {
        if (isNullOrUndefined(options.closeOnClickOutside))
            return null;

        if (!isBoolean(options.closeOnClickOutside)) {
            warn(`invalid closeOnClickOutside option "${ options.closeOnClickOutside }" - must be a boolean`);
            return null;
        }

        return options.closeOnClickOutside;
    }

    #resolveCloseOnEsc(options: CheckoutOptions) {
        if (isNullOrUndefined(options.closeOnEsc))
            return null;

        if (!isBoolean(options.closeOnEsc)) {
            warn(`invalid closeOnEsc option "${ options.closeOnEsc }" - must be a boolean`);
            return null;
        }

        return options.closeOnEsc;
    }

    #resolveCloseOnPaymentComplete(options: CheckoutOptions) {
        if (isNullOrUndefined(options.closeOnPaymentComplete))
            return null;

        if (!isBoolean(options.closeOnPaymentComplete)) {
            warn(`invalid closeOnPaymentComplete option "${ options.closeOnPaymentComplete }" - must be a boolean`);
            return null;
        }

        return options.closeOnPaymentComplete;
    }

    #resolveDefaultPaymentMethod(options: CheckoutOptions) {
        if (isNullOrUndefined(options.defaultPaymentMethod))
            return null;

        if (!isNonEmptyString(options.defaultPaymentMethod)) {
            warn(`invalid default payment method option "${ options.defaultPaymentMethod }" - must be a non-empty string`);
            return null;
        }

        return options.defaultPaymentMethod;
    }

    #resolveLaunchTimeout(options: CheckoutOptions) {

        if (isNullOrUndefined(options.launchTimeout))
            return null;

        if (!isNumber(options.launchTimeout)) {
            warn(`invalid launchTimeout option "${ options.launchTimeout }" - must be a number`);
            return null;
        }

        if (options.launchTimeout <= 0) {
            warn(`invalid launchTimeout option "${ options.launchTimeout }" - must be a positive number`);
            return null;
        }

        return options.launchTimeout;
    }

    #onRequestLightboxClose = async () => {
        if (this.isOpen)
            await this.close();
    };

    async #showLightbox(callback?: () => Promise<string>) {
        if (!this.lightbox)
            this.lightbox = new Lightbox();

        this.lightbox.setOptions({
            name: "checkout",
            closeOnClickOutside: this.closeOnClickOutside,
            closeOnEsc: this.closeOnEsc,
            closeHandler: this.#onRequestLightboxClose
        });

        // Start the lightbox show animation concurrently with the callback so the
        // callback's timeout begins immediately, independent of the CSS transition duration.
        const showPromise = this.lightbox.show();

        // If the user has provided a callback to launch() (e.g. to fetch a basket), resolve the ident from it before creating the component instance
        if (callback) {
            try {
                await this.#resolveIdentFromCallback(callback);
            } catch (error) {
                // Await show() before hiding
                await showPromise;
                this.lightbox.hide(false);
                throw error;
            }
        }

        await showPromise;

        // Create the component instance
        await this.#createComponentInstance(this.lightbox.holder, false);

        this.isOpen = true;
        this.emitter.emit("open");
    }

    #createComponentFactory(width: CssDimension = DEFAULT_WIDTH, height: CssDimension = DEFAULT_HEIGHT) {
        this.componentFactory = zoid.create({
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

    async #createComponentInstance(container: HTMLElement, popup: boolean, preOpenedWindow?: Window) {
        const url = new URL(window.location.href);

        if (!this.componentFactory)
            this.#createComponentFactory();

        this.zoid = this.componentFactory({
            // Pass a pre-opened window so zoid reuses it instead of calling window.open itself.
            // @ts-ignore — `window` is a valid built-in zoid prop but not reflected types
            ...(preOpenedWindow ? { window: preOpenedWindow } : {}),
            locale: this.locale,
            colors: this.colors,
            closeOnClickOutside: this.closeOnClickOutside,
            closeOnEsc: this.closeOnEsc,
            closeOnPaymentComplete: this.closeOnPaymentComplete,
            defaultPaymentMethod: this.defaultPaymentMethod,
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
            origin: url.origin,
            path: url.pathname,
            params: url.search,
            version: __VERSION__,
        });
    
        await this.zoid.renderTo(window, container, popup ? "popup" : "iframe");

        this.#didRender = true;
                
        if (this.#onRender)
            this.#onRender();
    }
}