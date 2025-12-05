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

/**
 * Theme preset for the embedded Tebex UI.
 */
export type TebexTheme = typeof THEME_NAMES[number];

/**
 * Color name used for theming embedded Tebex UI.
 */
export type TebexColorName = typeof COLOR_NAMES[number];

