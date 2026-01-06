import Checkout from "./checkout";
import Portal from "./portal";
import "./webComponents";
/**
 * Current Tebex.js package version
 */
export declare const version: string;
export type { TebexTheme } from "./common";
/**
 * Tebex checkout API
 */
export declare const checkout: Checkout;
export type { CheckoutOptions, CheckoutEvent, CheckoutEventMap, CheckoutZoidProps } from "./checkout";
/**
 * Tebex payment portal API
 */
export declare const portal: Portal;
export type { PortalOptions, PortalEvent, PortalEventMap, PortalZoidProps } from "./portal";
/**
 * Legacy APIs
 * @deprecated
 */
export * from "./legacy";
declare const _default: {
    events: {
        OPEN: string;
        /**
         * Current Tebex.js package version
         */
        CLOSE: string;
        PAYMENT_COMPLETE: string;
        PAYMENT_ERROR: string;
    };
    version: string;
    checkout: Checkout;
    portal: Portal;
};
export default _default;
