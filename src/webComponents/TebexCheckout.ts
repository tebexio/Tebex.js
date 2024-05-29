import Checkout from "../checkout";
import { createElement, isEnvBrowser } from "../utils";

class TebexCheckout extends HTMLElement {

    #shadow: ShadowRoot = null;
    #checkout = new Checkout();

    static get observedAttributes() {
        return [
            "ident",
            "primaryColor",
            "secondaryColor",
            "endpoint"
        ];
    }

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.#checkout.init({
            ident: this.getAttribute("ident")
        });
        const el = createElement("div");
        this.#shadow.append(el);
        this.#checkout.render(el, 800, 900);
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(key: string, oldVal: string, newVal: string) {
    }
}

if (isEnvBrowser())
    customElements.define("tebex-checkout", TebexCheckout);