import Checkout, {
    type CheckoutTheme,
    EVENT_NAMES
} from "../checkout";

import {
    isEnvBrowser,
    createElement,
    getAttribute,
    setAttribute
} from "../utils";

class TebexCheckout extends HTMLElement {

    checkout = new Checkout();

    #root: HTMLElement = null;
    #shadow: ShadowRoot = null;
    #mode: "inline" | "popover" = "popover";
    #open = false;
    #height = 700;
    #didInit = false;

    get ident() {
        return this.checkout.ident;
    }

    set ident(ident: string) {
        setAttribute(this, "ident", ident);
    }

    get open() {
        return this.#open;
    }

    set open(open: boolean) {
        setAttribute(this, "open", open);
    }

    get height() {
        return this.#height;
    }

    set height(height: number) {
        setAttribute(this, "height", height);
    }

    static get observedAttributes() {
        return [
            "ident",
            "open",
            "height"
        ];
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
        if (getAttribute(this, "ident"))
            this.#init();
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
                this.#init();
                break;
            case "open":
                this.#open = (oldVal === "false" || !oldVal) && (newVal === "" || !!newVal);
                this.#launchOrClose();
                break;
            case "height":
                this.#height = parseInt(newVal);
                this.#resize();
                break;
        }
    }

    #init() {
        if (this.#didInit)
            return;
        
        this.#didInit = true;

        let colors = [];

        if (this.hasAttribute("color-primary"))
            colors.push({ name: "primary", color: getAttribute(this, "color-primary") });

        if (this.hasAttribute("color-secondary"))
            colors.push({ name: "secondary", color: getAttribute(this, "color-secondary") });
    
        this.checkout.init({
            ident: getAttribute(this, "ident"),
            theme: getAttribute(this, "theme") as CheckoutTheme,
            colors: colors,
            endpoint: getAttribute(this, "endpoint"),
        });

        this.#mode = this.hasAttribute("inline") ? "inline" : "popover";

        if (this.#mode === "inline")
            this.checkout.render(this.#root, "100%", this.#height, false);

        else if (this.#mode === "popover")
            this.#launchOrClose();
    }

    #launchOrClose() {
        // Opening and closing the checkout is only for "popover" mode
        if (this.#mode !== "popover")
            return;

        // Checkout didn't init with an ident yet! Do nothing; this function will be called again after init
        if (!this.#didInit)
            return;

        if (this.#open && !this.checkout.isOpen)
            this.checkout.launch();

        if (!this.#open && this.checkout.isOpen)
            this.checkout.close();
    }

    #resize() {
        // Resizing only makes sense in "inline" mode
        if (this.#mode !== "inline")
            return;

        // Check that a Zoid instance is actually available
        const zoid = this.checkout.zoid;
        if (!zoid)
            return;

        zoid.resize({ height: this.#height });
    }
}

if (isEnvBrowser())
    customElements.define("tebex-checkout", TebexCheckout);