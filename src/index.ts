import Checkout from "./checkout";
import Portal from "./portal";
import * as legacy from "./legacy";

import "./webComponents";

/**
 * Current Tebex.js package version
 */
export const version = __VERSION__;

export type {
    TebexTheme
} from "./common";

/**
 * Tebex checkout API
 */
export const checkout = new Checkout();

export type {
    CheckoutOptions,
    CheckoutEvent,
    CheckoutEventMap,
    CheckoutZoidProps
} from "./checkout";

/**
 * Tebex payment portal API
 */
export const portal = new Portal();

export type {
    PortalOptions,
    PortalEvent,
    PortalEventMap,
    PortalZoidProps
} from "./portal";

/**
 * Legacy APIs
 * @deprecated
 */
export * from "./legacy";

export default {
    version,
    checkout,
    portal,
    ...legacy
};