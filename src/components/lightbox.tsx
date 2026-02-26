import {
    h,
    createElement,
    assert,
    isEnvBrowser,
    nextFrame,
    transitionEnd,
} from "../utils";

import styles from "./lightbox.css?inline";

export type LightboxCloseHandler = (e: MouseEvent | KeyboardEvent) => void;

export type LightboxOptions = {
    name: string;
    closeOnClickOutside: boolean;
    closeOnEsc: boolean;
    closeHandler: LightboxCloseHandler;
};

let globalIsLightboxOpen = false;

export class Lightbox {

    body: HTMLElement;
    root: HTMLElement;
    holder: HTMLElement;

    #name: string | null = null;
    #closeOnClickOutside = false;
    #closeOnEsc = false;
    #closeHandler: LightboxCloseHandler | null = null;

    constructor(options: Partial<LightboxOptions> = {}) {
        assert(isEnvBrowser());

        this.body = document.body;
        const stylesheet = createElement("style");
        stylesheet.append(styles);
        this.body.append(stylesheet);

        this.setOptions(options);
        this.root = this.render();
        this.holder = this.root.querySelector(".tebex-js-lightbox__holder");
    }

    setOptions(options: Partial<LightboxOptions>) {
        this.#name = options?.name ?? "";
        this.#closeOnClickOutside = options?.closeOnClickOutside ?? false;
        this.#closeOnEsc = options?.closeOnEsc ?? false;
        this.#closeHandler = options?.closeHandler;
    }

    render() {
        return (
            <div class={["tebex-js-lightbox", this.#name ? `tebex-js-lightbox--${this.#name}` : null]}>
                <div class="tebex-js-lightbox__holder" role="dialog">
                    <div class="tebex-js-lightbox__spinner" id="tebex-js-lightbox-spinner"></div>
                </div>
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
        if (!this.#closeOnClickOutside)
            return;
        // @ts-expect-error: e.target type isn't necessarily Element 
        if (!this.holder.contains(e.target))
            this.#closeHandler(e);
    }

    #onKeyPress = (e: KeyboardEvent) => {
        if (!this.#closeOnEsc)
            return;
        if (e.key === "Escape")
            this.#closeHandler(e);
    }
};

/**
 * Clears the global lightbox open state - used for testing.
 * @internal
 * @ignore
 */
export const __clearGlobalLightboxOpen = () => {
    globalIsLightboxOpen = false;
}