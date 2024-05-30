import Checkout, { CheckoutTheme, EVENT_NAMES } from "../checkout";
import { createElement, isEnvBrowser } from "../utils";

class TebexCheckout extends HTMLElement {

    checkout = new Checkout();

    #root: HTMLElement = null;
    #shadow: ShadowRoot = null;

    get ident() {
        return this.checkout.ident;
    }

    set ident(ident: string) {
        this.checkout.ident = ident;
        this.setAttribute("ident", ident);
    }

    static get observedAttributes() {
        return ["ident"];
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
        if (key === "ident")
            this.#render();
    }

    #render() {
        let colors = [];

        if (this.hasAttribute("primary-color"))
            colors.push({ name: "primary", color: this.getAttribute("primary-color") });

        if (this.hasAttribute("secondary-color"))
            colors.push({ name: "secondary", color: this.getAttribute("secondary-color") });
    
        this.checkout.init({
            ident: this.getAttribute("ident"),
            theme: this.getAttribute("theme") as CheckoutTheme,
            colors: colors,
            endpoint: this.getAttribute("endpoint"),
        });

        // TODO: customizable size
        this.checkout.render(this.#root, 800, 900, false);
    }
}

if (isEnvBrowser())
    customElements.define("tebex-checkout", TebexCheckout);