import { describe, test, expect, beforeEach } from "vitest";

import {
    createElement,
    setAttribute,
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