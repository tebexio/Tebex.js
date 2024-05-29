/**
 * @internal
 */
export declare const createElement: (type: string) => HTMLElement;
/**
 * @internal
 */
export declare const setAttributes: (el: Element, attrs: Record<string, number | string | boolean | null>) => void;
/**
 * Custom JSX render function
 * @internal
 */
export declare const h: (type: string, attrs: Record<string, any>, ...children: (Element | Element[])[]) => Element;
