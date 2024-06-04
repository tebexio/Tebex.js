import Checkout, {
    type CheckoutTheme,
    EVENT_NAMES
} from "../checkout";

import {
    isEnvBrowser,
    createElement,
    getAttribute,
    setAttribute,
    assert
} from "../utils";

export class TebexCheckout extends HTMLElement {

    checkout = new Checkout();

    _root: HTMLElement = null;
    _shadow: ShadowRoot = null;
    _mode: "inline" | "popover" = "popover";
    _height = 700;
    _open = false;
    _didInit = false;
    _didConnect = false;

    get ident() {
        return this.checkout.ident;
    }

    set ident(ident: string) {
        setAttribute(this, "ident", ident);
    }

    get open() {
        return this._open;
    }

    set open(open: boolean) {
        setAttribute(this, "open", open);
    }

    get height() {
        return this._height;
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
        this._shadow = this.attachShadow({ mode: "open" });
        this._root = createElement("div");
        this._shadow.append(this._root);
    }

    connectedCallback() {
        this._didConnect = true;

        // Emit checkout events as DOM events on the element
        for (let event of EVENT_NAMES) {
            this.checkout.on(event, (e) => {
                this.dispatchEvent(new CustomEvent(event, { detail: e }));
            });
        }
        
        if (getAttribute(this, "ident"))
            this.#init();
    }

    disconnectedCallback() {
        this.checkout.destroy();
        this.checkout = new Checkout();
        // Go back to initial state
        this._didConnect = false;
        this._open = false;
        this._didInit = false;
        this._didConnect = false;
    }

    attributeChangedCallback(key: string, oldVal: string, newVal: string) {
        if (oldVal === newVal)
            return;

        switch (key) {
            case "ident":
                assert(!this._didInit, "This checkout element already has an ident - to use a new ident, create a new element");
                this.#init();
                break;
            case "open":
                this._open = (oldVal === "false" || !oldVal) && (newVal === "" || !!newVal);
                this.#updatePopupState();
                break;
            case "height":
                this._height = parseInt(newVal);
                this.#updateSize();
                break;
        }
    }

    #init() {
        if (this._didInit || !this._didConnect)
            return;
        
        this._didInit = true;

        let colors = [];

        if (this.hasAttribute("color-primary"))
            colors.push({ name: "primary", color: getAttribute(this, "color-primary") });

        if (this.hasAttribute("color-secondary"))
            colors.push({ name: "secondary", color: getAttribute(this, "color-secondary") });
    
        this.checkout.init({
            ident: getAttribute(this, "ident"),
            theme: getAttribute(this, "theme") as CheckoutTheme,
            colors: colors,
            popupOnMobile: getAttribute(this, "popup-on-mobile") !== null,
            endpoint: getAttribute(this, "endpoint"),
        });

        this._mode = this.hasAttribute("inline") ? "inline" : "popover";

        if (this._mode === "inline")
            this.checkout.render(this._root, "100%", this._height, false);

        else if (this._mode === "popover")
            this.#updatePopupState();
    }

    #updatePopupState() {
        // Opening and closing the checkout is only for "popover" mode
        if (this._mode !== "popover")
            return;

        // Checkout isn't in DOM yet, can't render
        if (!this._didConnect)
            return;

         // Checkout didn't init with an ident yet! Do nothing; this function will be called again after init
        if (!this._didInit)
            return;

        if (this._open && !this.checkout.isOpen)
            this.checkout.launch();

        if (!this._open && this.checkout.isOpen)
            this.checkout.close();
    }

    #updateSize() {
        // Resizing only makes sense in "inline" mode
        if (this._mode !== "inline")
            return;

        // Check that a Zoid instance is actually available
        const zoid = this.checkout.zoid;
        if (!zoid)
            return;

        zoid.resize({ height: this._height });
    }
}

if (isEnvBrowser())
    customElements.define("tebex-checkout", TebexCheckout);