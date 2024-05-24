type AssertFn = (condition: boolean, err?: string) => asserts condition;

/**
 * @internal
 */
export const err = (msg = "") => {
    throw new Error("Tebex.js error: " + msg.trim());
};

/**
 * @internal
 */
export const warn = (msg = "") => {
    console.warn("Tebex.js warning: " + msg.trim());
};

/**
 * @internal
 */
export const assert: AssertFn = (condition, msg = "assert failed") => {
    if (!condition)
        err(msg);
};