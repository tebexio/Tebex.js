/**
 * @internal
 */
export declare const isUndefined: (value: unknown) => value is undefined;
/**
 * @internal
 */
export declare const isNull: (value: unknown) => value is null;
/**
 * @internal
 */
export declare const isNullOrUndefined: (value: unknown) => value is null;
/**
 * @internal
 */
export declare const isString: (value: unknown) => value is string;
/**
 * @internal
 */
export declare const isNumberNaN: (number: unknown) => boolean;
/**
 * @internal
 */
export declare const isNumber: (value: unknown) => value is number;
/**
 * @internal
 */
export declare const isBoolean: (value: unknown) => value is boolean;
/**
 * @internal
 */
export declare const isFunction: <T = Function>(value: unknown) => value is T;
/**
 * @internal
 */
export declare const isArray: <T = any[]>(value: any) => value is T;
/**
 * @internal
 */
export declare const isObject: <T = Record<string | number | symbol, unknown>>(value: unknown) => value is T;
/**
 * @internal
 */
export declare const isPrimitive: (value: unknown) => value is string | number | boolean;
