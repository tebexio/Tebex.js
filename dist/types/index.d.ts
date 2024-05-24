import Checkout from "./checkout";
/**
 * Current Tebex.js package version
 */
export declare const version: string;
/**
 * Tebex checkout API
 */
export declare const checkout: Checkout;
/**
 * Legacy APIs
 * @deprecated
 */
export * from "./legacy";
declare const _default: {
    events: {
        OPEN: string;
        CLOSE: string;
        PAYMENT_COMPLETE: string;
        PAYMENT_ERROR: string;
    };
    version: string;
    checkout: Checkout;
};
export default _default;
