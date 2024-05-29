import { describe, test, expect, beforeEach } from "vitest";

import { Lightbox } from "../src/lightbox";

describe("Lightbox", () => {

    let lightbox: Lightbox;

    beforeEach(() => {
        lightbox = new Lightbox();
    });

    test("Class members are all defined after construction", () => {
        expect(lightbox.body).toBeInstanceOf(Element);
        expect(lightbox.root).toBeInstanceOf(Element);
        expect(lightbox.holder).toBeInstanceOf(Element);
    });

    test("Root element is assigned to lightbox.root", () => {
        expect(lightbox.root.outerHTML).toEqual(`<div class="tebex-js-lightbox"><div class="tebex-js-lightbox__holder" role="dialog"></div></div>`);
    });

    test("Holder element is assigned to lightbox.holder", () => {
        expect(lightbox.holder.outerHTML).toEqual(`<div class="tebex-js-lightbox__holder" role="dialog"></div>`);
    });

    // TODO: test open and close -- might need to test inside a playwright instance??

});