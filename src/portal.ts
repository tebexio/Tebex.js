import type { TebexColorConfig, TebexTheme } from "./common";

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
};

export default class Portal {


}