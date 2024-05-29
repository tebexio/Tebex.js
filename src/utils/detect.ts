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
    window.ApplePaySession && 
    // @ts-ignore
    ApplePaySession.canMakePayments();

/**
 * @internal
 */
export const isMobile = (width: string, height: string) => {
    if (!isEnvBrowser())
        return false;

    const query = window.matchMedia(`(max-width: ${ width }) or (max-height: ${ height })`);
    return query.matches;
};