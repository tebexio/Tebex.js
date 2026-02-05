import type {
    TebexTheme,
    TebexColorDefinition
} from "../common";

/**
 * Theme preset for the embedded Tebex UI.
 * Replaced with {@link TebexTheme} since it is shared between portal and checkout.
 * 
 * @deprecated use {@link TebexTheme}
 */
export type CheckoutTheme = TebexTheme;

/**
 * Color definition. The `color` property can be set to any valid CSS color, so long as it does not rely on CSS Variables.
 * Replaced with {@link TebexColorDefinition} since it is shared between portal and checkout.
 * 
 * @deprecated use {@link TebexColorDefinition}
 */
export type CheckoutColorDefinition = TebexColorDefinition;

