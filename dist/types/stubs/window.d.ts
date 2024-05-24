/**
 * Zoid does a weird infinite loop to check that document.body exists,
 * which could cause SSR builds to hang indefinitely if they imported Tebex.js.
 * This stubs in document.body inside non-browser environments.
 * @internal
 */
declare const _default: (Window & typeof globalThis) | {
    document: {
        body: {};
    };
};
export default _default;
