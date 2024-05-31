/**
 * CSS dimension, measured in pixels or percentages
 */
export type CssDimension = number | `${number}px` | `${number}%`;
/**
 * @internal
 */
export declare const nextFrame: () => Promise<void>;
/**
 * @internal
 */
export declare const transitionEnd: (el: Element) => Promise<void>;
