import { describe, test, expect, beforeEach } from "vitest";

import {
    createElement,
    setAttributes,
    h
} from "./dom";

describe("createElement", () => {

    test("Creates a HTML element with the given tag name", () => {
        expect(createElement("div").outerHTML).toEqual("<div></div>");
        expect(createElement("span").outerHTML).toEqual("<span></span>");
        expect(createElement("a").outerHTML).toEqual("<a></a>");
    });

});

describe("setAttributes", () => {

    let el: HTMLElement;

    beforeEach(() => {
        el = createElement("div");
    });

    test("Adds attributes to a HTML element with string values", () => {
        setAttributes(el, { test: "123" });
        expect(el.outerHTML).toEqual(`<div test="123"></div>`);
    });

    test("Adds attributes to a HTML element with number values", () => {
        setAttributes(el, { test: 123 });
        expect(el.outerHTML).toEqual(`<div test="123"></div>`);
        setAttributes(el, { test: 0 });
        expect(el.outerHTML).toEqual(`<div test="0"></div>`);
    });

    test("Adds attributes to a HTML element with boolean values", () => {
        setAttributes(el, { test: true });
        expect(el.outerHTML).toEqual(`<div test=""></div>`);
    });

    test("Removes attributes from a HTML element if the new value is null", () => {
        setAttributes(el, { test: true });
        expect(el.outerHTML).toEqual(`<div test=""></div>`);
        setAttributes(el, { test: null });
        expect(el.outerHTML).toEqual(`<div></div>`);
    });

    test("Removes attributes from a HTML element if the new value is false", () => {
        setAttributes(el, { test: true });
        expect(el.outerHTML).toEqual(`<div test=""></div>`);
        setAttributes(el, { test: false });
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