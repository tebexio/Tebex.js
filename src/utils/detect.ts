/**
 * @internal
 */
export const isEnvBrowser = () => 
    typeof window !== "undefined" && typeof window.document !== "undefined";

/**
 * @internal
 */
export const isEnvNode = () => 
    typeof process !== "undefined" && process.versions != null && process.versions.node != null;

/**
 * @internal
 */
export const isApplePayAvailable = () => 
    isEnvBrowser() &&
    // @ts-ignore
    typeof window.ApplePaySession !== "undefined" && 
    // @ts-ignore
    window.ApplePaySession.canMakePayments();

/**
 * @internal
 */
export const isMobile = (width: string, height: string) => {
    if (!isEnvBrowser())
        return false;

    // If on some old device that doesn't support matchMedia, best be safe and treat it as a mobile?
    if (!window.matchMedia)
        return true;

    const query = window.matchMedia(`(max-width: ${ width }) or (max-height: ${ height })`);
    return query.matches;
};