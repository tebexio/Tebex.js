import {
    h,
    createElement,
    assert,
    isEnvBrowser,
    nextFrame,
    transitionEnd,
} from "./utils";

import styles from "./styles/lightbox.css?inline";

export type LightboxClickOutsideHandler = (e: MouseEvent) => void;
export type LightboxEscKeyHandler = (e: KeyboardEvent) => void;

export class Lightbox {

    body: HTMLElement;
    root: HTMLElement;
    holder: HTMLElement;

    clickOutsideHandler: LightboxClickOutsideHandler | null = null;
    escKeyHandler: LightboxEscKeyHandler | null = null;

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
            <div class="tebex-js-lightbox">
                <div class="tebex-js-lightbox__holder" role="dialog"></div>
            </div>
        );
    }

    async show() {
        this.body.append(this.root);
        await nextFrame();
        this.root.classList.add("tebex-js-lightbox--visible");
        await transitionEnd(this.root);
        this.body.addEventListener("click", this.#onClickOutside);
        this.body.addEventListener("keydown", this.#onKeyPress);
    }

    async hide() {
        this.body.removeEventListener("click", this.#onClickOutside);
        this.body.removeEventListener("keydown", this.#onKeyPress);
        this.root.classList.remove("tebex-js-lightbox--visible");
        await nextFrame();
        await transitionEnd(this.root);
        this.body.removeChild(this.root);
    }

    destroy() {
        if (!this.root.parentNode)
            return;
        this.body.removeEventListener("click", this.#onClickOutside);
        this.body.removeEventListener("keydown", this.#onKeyPress);
        this.root.classList.remove("tebex-js-lightbox--visible");
        this.body.removeChild(this.root);
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