import { assert } from "./err";
import { isObject } from "./is";

const camelToDash = (str: string) => 
    str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);

/**
 * @internal
 */
export const createElement = (type: string) =>
    document.createElement(type);

/**
 * @internal
 */
export const setAttributes = (el: Element, attrs: Record<string, number | string | boolean | null>) => {
    assert(isObject(attrs));

    for (let key in attrs) {
        const attr = camelToDash(key);
        const value = attrs[key];

        if (value === true)
            el.setAttribute(attr, '');
        else if (value === false || value === null || value === undefined)
            el.removeAttribute(attr);
        else
            el.setAttribute(attr, value + '');
    }
};

/**
 * Custom JSX render function
 * @internal
 */
export const h = (type: string, attrs: Record<string, any>, ...children: (Element | Element[])[]): Element => {
    const el = createElement(type);

    if (attrs)
        setAttributes(el, attrs);

    for (let child of children.flat())
        el.append(child);

    return el;
};