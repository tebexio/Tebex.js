import {
    h,
    createElement,
    assert,
    isEnvBrowser,
    nextFrame,
    transitionEnd,
} from "../utils";

import styles from "./lightbox.css?inline";

export type LightboxClickOutsideHandler = (e: MouseEvent) => void;
export type LightboxEscKeyHandler = (e: KeyboardEvent) => void;

let globalIsLightboxOpen = false;

export class Lightbox {

    body: HTMLElement;
    root: HTMLElement;
    holder: HTMLElement;

    name: string | null = null;
    clickOutsideHandler: LightboxClickOutsideHandler | null = null;
    escKeyHandler: LightboxEscKeyHandler | null = null;

    // TODO: add options here to configure name, click handling, etc
    constructor() {
        assert(isEnvBrowser());

        this.body = document.body;
        const stylesheet = createElement("style");
        stylesheet.append(styles);
        this.body.append(stylesheet);

        this.root = this.render();
        this.holder = this.root.querySelector(".tebex-js-lightbox__holder");
    }

    render() {
        return (
            <div class={[ "tebex-js-lightbox", this.name ? `tebex-js-lightbox--${this.name}` : null ]}>
                <div class="tebex-js-lightbox__holder" role="dialog"></div>
            </div>
        );
    }

    async show() {
        assert(!globalIsLightboxOpen, "There is already a lightbox open");
        globalIsLightboxOpen = true;
        this.body.append(this.root);
        await nextFrame();
        this.root.classList.add("tebex-js-lightbox--visible");
        await transitionEnd(this.root);
        this.body.addEventListener("click", this.#onClickOutside);
        this.body.addEventListener("keydown", this.#onKeyPress);
    }

    async hide(transition = true) {
        this.body.removeEventListener("click", this.#onClickOutside);
        this.body.removeEventListener("keydown", this.#onKeyPress);
        this.root.classList.remove("tebex-js-lightbox--visible");
        if (transition) {
            await nextFrame();
            await transitionEnd(this.root);
        }
        this.body.removeChild(this.root);
        globalIsLightboxOpen = false;
    }

    destroy() {
        if (!this.root.parentNode)
            return;
        this.hide(false);
    }

    #onClickOutside = (e: MouseEvent) => {
        if (!this.clickOutsideHandler)
            return;
        // @ts-expect-error: e.target type isn't necessarily Element 
        if (!this.holder.contains(e.target))
            this.clickOutsideHandler(e);
    }

    #onKeyPress = (e: KeyboardEvent) => {
        if (!this.escKeyHandler)
            return;
        if (e.key === "Escape")
            this.escKeyHandler(e);
    }
};