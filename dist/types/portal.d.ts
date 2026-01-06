/// <reference path="../../src/types/zoid.d.ts" />
import { Unsubscribe } from "nanoevents";
import type { TebexColorConfig, TebexColorDefinition, TebexTheme } from "./common";
import { Lightbox } from "./components/lightbox";
import { ZoidComponent, ZoidComponentInstance } from "zoid";
import { CssDimension, Implements } from "./utils";
export declare const EVENT_NAMES: readonly ["open", "close"];
export declare const THEME_NAMES: readonly ["auto", "default", "light", "dark"];
export declare const COLOR_NAMES: readonly ["primary", "secondary", "background", "surface", "surface-variant", "success", "warning", "error", "green", "red", "fields", "field-border"];
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
    #private;
    locale: string;
    theme: TebexTheme;
    colors: TebexColorDefinition[];
    closeOnClickOutside: boolean;
    closeOnEsc: boolean;
    popupOnMobile: boolean;
    endpoint: string;
    isOpen: boolean;
    emitter: import("nanoevents").Emitter<{
        open: () => void;
        close: () => void;
    }>;
    lightbox: Lightbox;
    componentFactory: ZoidComponent<PortalZoidProps>;
    zoid: ZoidComponentInstance;
    /**
     * Configure the Tebex portal settings.
     */
    init(options: PortalOptions): void;
    /**
     * Subscribe to Tebex portal events, such as when the embed is opened or closed.
     */
    on<E extends PortalEvent>(event: E, callback: PortalEventMap[E]): Unsubscribe;
    /**
     * Launch the Tebex portal panel.
     * On desktop, the panel will launch in a "lightbox" mode that covers the screen. On mobile, it will be opened as a new page.
     */
    launch(): Promise<void>;
    /**
     * Close the Tebex portal panel.
     */
    close(): Promise<void>;
    /**
     * Close and destroy the element immediately, without waiting for CSS transitions.
     */
    destroy(): void;
    /**
     * Render the Tebex portal panel immediately, into a specified HTML element.
     * If `popupOnMobile` is true, then on mobile devices the portal will be immediately opened as a new page instead.
     */
    render(element: HTMLElement, width: CssDimension, height: CssDimension, popupOnMobile?: boolean): Promise<void>;
    /**
     * Await internal Zoid render tests - primarily exposed for tests.
     * @internal
     */
    renderFinished(): Promise<void>;
}
