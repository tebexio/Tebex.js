type AssertFn = (condition: boolean, err?: string) => asserts condition;

/**
 * @internal
 */
export const err = (msg = "", prefix = "Tebex.js error") => {
    throw new Error(prefix + (msg && prefix ? ": " : "") + msg.trim());
};

/**
 * @internal
 */
export const logError = (msg = "") => {
    console.error("Tebex.js error" + (msg ? ": " : "") + msg.trim());
};

/**
 * @internal
 */
export const warn = (msg = "") => {
    console.warn("Tebex.js warning" + (msg ? ": " : "") + msg.trim());
};

/**
 * @internal
 */
export const assert: AssertFn = (condition, msg = "assert failed") => {
    if (!condition)
        err(msg);
};
