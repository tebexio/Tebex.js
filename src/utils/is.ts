/**
 * @internal
 */
export const isUndefined = (value: unknown): value is undefined => value === undefined;

/**
 * @internal
 */
export const isNull = (value: unknown): value is null => value === null;

/**
 * @internal
 */
export const isNullOrUndefined = (value: unknown): value is (null | undefined) => value === undefined || value == null;

/**
 * @internal
 */
export const isString = (value: unknown): value is string => typeof value === "string";

/**
 * @internal
 */
export const isNumberNaN = Number.isNaN;

/**
 * @internal
 */
export const isNumber = (value: unknown): value is number => typeof value === "number" && !isNumberNaN(value);

/**
 * @internal
 */
export const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";

/**
 * @internal
 */
export const isFunction = <T = Function>(value: unknown): value is T => typeof value === "function";

/**
 * @internal
 */
export const isArray = <T = any[]>(value: any): value is T => Array.isArray(value);

/**
 * @internal
 */
export const isObject = <
    T = Record<string | number | symbol, unknown>
>(value: unknown): value is T => typeof value === "object" && value !== null && !isArray(value);

/**
 * @internal
 */
export const isPrimitive = (value: unknown): value is string | number | boolean => 
    value == null || (typeof value !== "object" && typeof value !== "function")