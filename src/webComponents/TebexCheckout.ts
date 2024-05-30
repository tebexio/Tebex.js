import Checkout, {
    type CheckoutTheme,
    EVENT_NAMES
} from "../checkout";

import {
    createElement,
    isEnvBrowser
} from "../utils";

class TebexCheckout extends HTMLElement {

    checkout = new Checkout();

    #root: HTMLElement = null;
    #shadow: ShadowRoot = null;
    #height = 700;

    get ident() {
        return this.checkout.ident;
    }

    set ident(ident: string) {
        this.setAttribute("ident", ident);
    }

    get height() {
        return this.#height;
    }

    set height(height: number) {
        this.setAttribute("height", height.toString());
    }

    static get observedAttributes() {
        return ["ident", "height"];
    }

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: "open" });
        this.#root = createElement("div");
        this.#shadow.append(this.#root);

        // Emit checkout events as DOM events on the element
        for (let event of EVENT_NAMES) {
            this.checkout.on(event, (e) => {
                this.dispatchEvent(new CustomEvent(event, { detail: e }));
            });
        }
    }

    connectedCallback() {
        if (this.getAttribute("ident"))
            this.#render();
    }

    disconnectedCallback() {
        this.checkout.emitter.emit("close");
    }

    attributeChangedCallback(key: string, oldVal: string, newVal: string) {
        if (oldVal === newVal)
            return;

        switch (key) {
            case "ident":
                this.checkout.ident = newVal;
                this.#render();
                break;
            case "height":
                this.#height = parseInt(newVal);
                this.#resize();
                break;
        }
    }

    #render() {
        let colors = [];

        if (this.hasAttribute("color-primary"))
            colors.push({ name: "primary", color: this.getAttribute("color-primary") });

        if (this.hasAttribute("color-secondary"))
            colors.push({ name: "secondary", color: this.getAttribute("color-secondary") });
    
        this.checkout.init({
            ident: this.getAttribute("ident"),
            theme: this.getAttribute("theme") as CheckoutTheme,
            colors: colors,
            endpoint: this.getAttribute("endpoint"),
        });

        this.checkout.render(this.#root, "100%", this.#height, false);
    }

    #resize() {
        const zoid = this.checkout.zoid;
        if (!zoid)
            return;
        zoid.resize({ height: this.#height });
    }
}

if (isEnvBrowser())
    customElements.define("tebex-checkout", TebexCheckout);