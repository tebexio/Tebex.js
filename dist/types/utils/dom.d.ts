/**
 * @internal
 */
export declare const createElement: <T extends HTMLElement>(type: string) => T;
/**
 * @internal
 */
export declare const getAttribute: (el: Element, name: string) => string;
/**
 * @internal
 */
export declare const setAttribute: (el: Element, name: string, value: number | string | boolean | null | string[]) => void;
/**
 * @internal
 */
export declare const isInShadowDom: (el: Element) => boolean;
/**
 * @internal
 */
export declare const isInDocument: (el: Element) => boolean;
/**
 * Custom JSX render function
 * @internal
 */
export declare const h: (type: string, attrs: Record<string, number | string | boolean | null>, ...children: (Element | Element[])[]) => Element;
