import Checkout from "./checkout";
import * as legacy from "./legacy";

import "./webComponents";

/**
 * Current Tebex.js package version
 */
export const version = __VERSION__;

/**
 * Tebex checkout API
 */
export const checkout = new Checkout();

export type {
    CheckoutOptions,
    CheckoutColorDefinition,
    CheckoutEvent,
    CheckoutEventMap,
    CheckoutTheme,
    CheckoutZoidProps
} from "./checkout";

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