type AssertFn = (condition: boolean, err?: string) => asserts condition;
/**
 * @internal
 */
export declare const err: (msg?: string) => never;
/**
 * @internal
 */
export declare const warn: (msg?: string) => void;
/**
 * @internal
 */
export declare const assert: AssertFn;
export {};
