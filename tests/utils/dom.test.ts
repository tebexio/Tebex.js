import { describe, test, expect, beforeEach, afterEach } from "vitest";

import {
    createElement,
    setAttribute,
    isInShadowDom,
    isInDocument,
    h
} from "../../src/utils/dom";

describe("createElement", () => {

    test("Creates a HTML element with the given tag name", () => {
        expect(createElement("div").outerHTML).toEqual("<div></div>");
        expect(createElement("span").outerHTML).toEqual("<span></span>");
        expect(createElement("a").outerHTML).toEqual("<a></a>");
    });

});

describe("setAttribute", () => {

    let el: HTMLElement;

    beforeEach(() => {
        el = createElement("div");
    });

    test("Adds attribute to a HTML element with string values", () => {
        setAttribute(el, "test", "123");
        expect(el.outerHTML).toEqual(`<div test="123"></div>`);
    });

    test("Adds attribute to a HTML element with number values", () => {
        setAttribute(el, "test", 123);
        expect(el.outerHTML).toEqual(`<div test="123"></div>`);
        setAttribute(el, "test", 0);
        expect(el.outerHTML).toEqual(`<div test="0"></div>`);
    });

    test("Adds attribute to a HTML element with boolean values", () => {
        setAttribute(el, "test", true);
        expect(el.outerHTML).toEqual(`<div test=""></div>`);
    });

     test("Adds attribute to a HTML element with array values", () => {
        setAttribute(el, "test", ["one", "two", "three"]);
        expect(el.outerHTML).toEqual(`<div test="one two three"></div>`);
    });

    test("Removes attribute from a HTML element if the new value is null", () => {
        setAttribute(el, "test", true);
        expect(el.outerHTML).toEqual(`<div test=""></div>`);
        setAttribute(el, "test", null);
        expect(el.outerHTML).toEqual(`<div></div>`);
    });

    test("Removes attribute from a HTML element if the new value is false", () => {
        setAttribute(el, "test", true);
        expect(el.outerHTML).toEqual(`<div test=""></div>`);
        setAttribute(el, "test", false);
        expect(el.outerHTML).toEqual(`<div></div>`);
    });

});

describe("isInShadowDom", () => {

    afterEach(() => {
        document.body.innerHTML = "";
    });

    test("Returns true if the element is in a shadow DOM element", () => {
        class CustomElement extends HTMLElement {};
        customElements.define("test-el", CustomElement);
        const root = document.createElement("test-el");
        const shadowRoot = root.attachShadow({ mode: "open" });
        const el = document.createElement("div");
        shadowRoot.append(el);
        expect(isInShadowDom(el)).toBe(true);
    });

    test("Does return true for non-shadow-DOM elements", () => {
        const el = document.createElement("div");
        expect(isInShadowDom(el)).toBe(false);

        document.body.append(el);
        expect(isInShadowDom(el)).toBe(false);
    });

});

describe("isInDocument", () => {

    afterEach(() => {
        document.body.innerHTML = "";
    });

    test("Returns true if the element is in the page", () => {
        const el = document.createElement("div");
        document.body.append(el);
        expect(isInDocument(el)).toBe(true);
    });

    test("Returns true if the element is in a shadow DOM element", () => {
        class CustomElement extends HTMLElement {};
        customElements.define("test-el2", CustomElement);
        const root = document.createElement("test-el2");
        const shadowRoot = root.attachShadow({ mode: "open" });
        const el = document.createElement("div");
        shadowRoot.append(el);
        expect(isInDocument(el)).toBe(true);
    });

    test("Does return true for non-page elements", () => {
        const el = document.createElement("div");
        expect(isInDocument(el)).toBe(false);
    });

});

describe("h (JSX render function)", () => {

    test("Creates a HTML element with the given tag name and attributes", () => {
        expect(h("div", {}).outerHTML).toEqual("<div></div>");
        expect(h("span", { test: "123" }).outerHTML).toEqual(`<span test="123"></span>`);
    });

    test("Inserts children into HTML element", () => {
        expect(h("div", {}, h("span", {}), h("a", {})).outerHTML).toEqual(`<div><span></span><a></a></div>`);
    });

    test("Flattens child list", () => {
        expect(h("div", {}, h("span", {}), [h("a", {})]).outerHTML).toEqual(`<div><span></span><a></a></div>`);
    });

});