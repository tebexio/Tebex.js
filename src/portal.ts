import { createNanoEvents, Unsubscribe } from "nanoevents";
import type { TebexColorConfig, TebexColorDefinition, TebexTheme } from "./common";
import { Lightbox } from "./components/lightbox";
import zoid, { ZoidComponent, ZoidComponentInstance } from "zoid";
import { assert, CssDimension, Implements, isApplePayAvailable, isArray, isBoolean, isInDocument, isMobile, isNonEmptyString, isNullOrUndefined, isObject, isString, warn } from "./utils";
import { spinnerRender } from "./components/spinner";

export const EVENT_NAMES = [
    "open",
    "close"
] as const;

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

const DEFAULT_WIDTH = "800px";
const DEFAULT_HEIGHT = "760px";

/**
 * Configuration options for `Tebex.portal.init()`.
 */
export type PortalOptions = {
    /**
     * TODO
     */
    token: string;
    /**
     * The default language to use, defined as an ISO locale code - e.g. `"en_US" for American English, "de_DE" for German, etc.
     * @default `navigator.language`
     */
    locale?: string;
    /**
     * Tebex portal theme preset.
     * @default "light"
     */
    theme?: TebexTheme;
    /**
     * Tebex portal theme colors.
     * @default []
     */
    colors?: TebexColorConfig;
    /**
     * Whether to close the popup when the user clicks outside of the modal.
     * @default false
     */
    closeOnClickOutside?: boolean;
    /**
     * Whether to close the popup when the user presses the Escape key.
     * @default false
     */
    closeOnEsc?: boolean;
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
};

/**
 * Portal event type. You can subscribe to portal events with `Tebex.portal.on()`.
 */
export type PortalEvent = typeof EVENT_NAMES[number];

/**
 * Maps a {@link PortalEvent} to its event callback type.
 */
export type PortalEventMap = Implements<Record<PortalEvent, Function>, {
    "open": () => void;
    "close": () => void;
}>;

/**
 * Props passed through Zoid component.
 * @internal
 */
export type PortalZoidProps = {
    token: string;
    locale: string;
    colors: TebexColorConfig;
    closeOnClickOutside: boolean;
    closeOnEsc: boolean;
    defaultPaymentMethod?: string;
    theme: TebexTheme;
    onOpenWindow: (url: string) => void;
    onClosePopup: () => Promise<void>;
    isApplePayAvailable: boolean;
    isEmbedded: boolean;
    referrer: string;
    origin: string;
    path: string;
    params: string;
    version: string;
};

export default class Portal {

    token: string = null;
    locale: string = null;
    theme: TebexTheme = "default";
    colors: TebexColorDefinition[] = [];
    closeOnClickOutside = false;
    closeOnEsc = false;
    popupOnMobile = false;
    endpoint = "https://portal.tebex.io";

    isOpen = false;
    emitter = createNanoEvents<PortalEventMap>();
    lightbox: Lightbox = null;

    componentFactory: ZoidComponent<PortalZoidProps> = null;
    zoid: ZoidComponentInstance = null;

    #didRender = false;
    #onRender: Function;

    /**
     * Configure the Tebex portal settings.
     */
    init(options: PortalOptions) {
        assert(options.token && isString(options.token), "token option is required, and must be a string");
        this.token = options.token;
        this.locale = this.#resolveLocale(options) ?? this.locale;
        this.theme = this.#resolveTheme(options) ?? this.theme;
        this.colors = this.#resolveColors(options) ?? this.colors;
        this.popupOnMobile = this.#resolvePopupOnMobile(options) ?? this.popupOnMobile;
        this.endpoint = this.#resolveEndpoint(options) ?? this.endpoint;
        this.closeOnClickOutside = this.#resolveCloseOnClickOutside(options) ?? this.closeOnClickOutside;
        this.closeOnEsc = this.#resolveCloseOnEsc(options) ?? this.closeOnEsc;)
    }

    /**
     * Subscribe to Tebex portal events, such as when the embed is opened or closed.
     */
    on<E extends PortalEvent>(event: E, callback: PortalEventMap[E]): Unsubscribe {
        if (!EVENT_NAMES.includes(event)) {
            warn(`invalid event name "${ event }"`);
            return () => {};
        }

        return this.emitter.on(event, callback);
    }

    /**
     * Launch the Tebex portal panel.
     * On desktop, the panel will launch in a "lightbox" mode that covers the screen. On mobile, it will be opened as a new page.
     */
    async launch() {
        if (!this.popupOnMobile && isMobile(DEFAULT_WIDTH, DEFAULT_HEIGHT)) {
            await this.#createComponentInstance(document.body, true);
            this.isOpen = true;
            this.emitter.emit("open");
            return;
        }

        await this.#showLightbox();
    }

    /**
     * Close the Tebex portal panel.
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
     * Render the Tebex portal panel immediately, into a specified HTML element.
     * If `popupOnMobile` is true, then on mobile devices the portal will be immediately opened as a new page instead.
     */
    async render(element: HTMLElement, width: CssDimension, height: CssDimension, popupOnMobile = this.popupOnMobile) {
        // Zoid requires that elements are already in the page, otherwise it throws a confusing error.
        assert(isInDocument(element), "Target element must already be inserted into the page before it can be used");

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

    #resolveLocale(options: PortalOptions) {
        if (isNullOrUndefined(options.locale))
            return null;

        if (!isNonEmptyString(options.locale)) {
            warn(`invalid locale option "${ options.locale }" - must be a non-empty string`);
            return null;
        }
        
        return options.locale;
    }

    #resolveTheme(options: PortalOptions) {
        if (isNullOrUndefined(options.theme))
            return null;

        if(!THEME_NAMES.includes(options.theme)) {
            const list = THEME_NAMES.map(n => `"${ n }"`).join(", ");
            warn(`invalid theme option "${ options.theme }" - must be one of ${ list }`);
            return null;
        }

        return options.theme;
    }

    #resolveColors(options: PortalOptions) {
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

    #resolvePopupOnMobile(options: PortalOptions) {
        if (isNullOrUndefined(options.popupOnMobile))
            return null;

        if (!isBoolean(options.popupOnMobile)) {
            warn(`invalid popupOnMobile option "${ options.popupOnMobile }" - must be a boolean`);
            return null;
        }

        return options.popupOnMobile;
    }

    #resolveEndpoint(options: PortalOptions) {
        if (isNullOrUndefined(options.endpoint))
            return null;

        if (!isNonEmptyString(options.endpoint)) {
            warn(`invalid endpoint option "${ options.endpoint }" - must be a non-empty string`);
            return null;
        }

        return options.endpoint;
    }

    #resolveCloseOnClickOutside(options: PortalOptions) {
        if (isNullOrUndefined(options.closeOnClickOutside))
            return null;

        if (!isBoolean(options.closeOnClickOutside)) {
            warn(`invalid closeOnClickOutside option "${ options.closeOnClickOutside }" - must be a boolean`);
            return null;
        }

        return options.closeOnClickOutside;
    }

    #resolveCloseOnEsc(options: PortalOptions) {
        if (isNullOrUndefined(options.closeOnEsc))
            return null;

        if (!isBoolean(options.closeOnEsc)) {
            warn(`invalid closeOnEsc option "${ options.closeOnEsc }" - must be a boolean`);
            return null
        }

        return options.closeOnEsc;
    }

    #onRequestLightboxClose = async () => {
        if (this.isOpen)
            await this.close();
    };

    async #showLightbox() {
        if (!this.lightbox)
            this.lightbox = new Lightbox();

        this.lightbox.setOptions({
            name: "portal",
            closeOnClickOutside: this.closeOnClickOutside,
            closeOnEsc: this.closeOnEsc,
            closeHandler: this.#onRequestLightboxClose
        });

        await this.lightbox.show();
        await this.#createComponentInstance(this.lightbox.holder, false);

        this.isOpen = true;
        this.emitter.emit("open");
    }

    #createComponentFactory(width: CssDimension = DEFAULT_WIDTH, height: CssDimension = DEFAULT_HEIGHT) {
        this.componentFactory = zoid.create({
            tag: "tebex-js-portal-component",
            url: () => this.endpoint,
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

    async #createComponentInstance(container: HTMLElement, popup: boolean) {
        const url = new URL(window.location.href);

        if (!this.componentFactory)
            this.#createComponentFactory();

        this.zoid = this.componentFactory({
            token: this.token,
            locale: this.locale,
            colors: this.colors,
            closeOnClickOutside: this.closeOnClickOutside,
            closeOnEsc: this.closeOnEsc,
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