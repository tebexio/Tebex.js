/**
 * @internal
 */
export declare const createElement: (type: string) => HTMLElement;
/**
 * @internal
 */
export declare const getAttribute: (el: Element, name: string) => string;
/**
 * @internal
 */
export declare const setAttribute: (el: Element, name: string, value: number | string | boolean | null) => void;
/**
 * Custom JSX render function
 * @internal
 */
export declare const h: (type: string, attrs: Record<string, number | string | boolean | null>, ...children: (Element | Element[])[]) => Element;
