export declare const THEME_NAMES: readonly ["auto", "default", "light", "dark"];
export declare const COLOR_NAMES: readonly ["primary", "secondary", "background", "surface", "surface-variant", "success", "warning", "error", "green", "red", "fields", "field-border"];
/**
 * Theme preset for the embedded Tebex UI.
 */
export type TebexTheme = typeof THEME_NAMES[number];
/**
 * Color name used for theming embedded Tebex UI.
 */
export type TebexColorName = typeof COLOR_NAMES[number];
/**
 * Color definition. The `color` property can be set to any valid CSS color, so long as it does not rely on CSS Variables.
 */
export type TebexColorDefinition = {
    name: TebexColorName;
    color: string;
};
/**
 * Configuration for theming colors in the embedded Tebex UI.
 *
 * Accepts either:
 * - an array of {@link TebexColorDefinition} objects, or
 * - an object mapping {@link TebexColorName} keys mapped to string color values.
 */
export type TebexColorConfig = TebexColorDefinition[] | Partial<Record<TebexColorName, string>>;
