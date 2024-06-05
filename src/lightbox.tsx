import {
    h,
    createElement,
    assert,
    isEnvBrowser,
    nextFrame,
    transitionEnd,
} from "./utils";

import styles from "./styles/lightbox.css?inline";

export class Lightbox {

    body: HTMLElement;
    root: HTMLElement;
    holder: HTMLElement;

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
    }

    async hide() {
        this.root.classList.remove("tebex-js-lightbox--visible");
        await nextFrame();
        await transitionEnd(this.root);
        this.body.removeChild(this.root);
    }

    destroy() {
        if (this.root.parentNode)
            this.body.removeChild(this.root);
    }
};