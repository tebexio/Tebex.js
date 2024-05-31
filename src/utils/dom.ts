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
export const getAttribute = (el: Element, name: string) =>
    el.getAttribute(name);

/**
 * @internal
 */
export const setAttribute = (el: Element, name: string, value: number | string | boolean | null) => {
    const attr = camelToDash(name);

    if (value === true)
        el.setAttribute(attr, "");
    else if (value === false || value === null || value === undefined)
        el.removeAttribute(attr);
    else
        el.setAttribute(attr, value + "");
};

/**
 * Custom JSX render function
 * @internal
 */
export const h = (type: string, attrs: Record<string, number | string | boolean | null>, ...children: (Element | Element[])[]): Element => {
    const el = createElement(type);

    if (isObject(attrs)) {
        for (let name in attrs)
            setAttribute(el, name, attrs[name]);
    }

    for (let child of children.flat())
        el.append(child);

    return el;
};