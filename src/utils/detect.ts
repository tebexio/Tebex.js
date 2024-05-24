import Bowser from "bowser";

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
export const isMobile = () => {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return browser.getPlatformType() !== "desktop";
};