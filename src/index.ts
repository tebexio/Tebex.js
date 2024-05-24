import Checkout from "./checkout";
import * as legacy from "./legacy";

/**
 * Current Tebex.js package version
 */
export const version = __VERSION__;

/**
 * Tebex checkout API
 */
export const checkout = new Checkout();

/**
 * Legacy APIs
 * @deprecated
 */
export * from "./legacy";

export default {
    version,
    checkout,
    ...legacy
};