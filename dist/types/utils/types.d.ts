/**
 * @internal
 * https://stackoverflow.com/questions/77886222/can-a-typescript-type-implement-an-interface
 */
export type Implements<T, U extends T> = U;
