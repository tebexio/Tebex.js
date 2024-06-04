import Checkout from "../checkout";
export declare class TebexCheckout extends HTMLElement {
    #private;
    checkout: Checkout;
    _root: HTMLElement;
    _shadow: ShadowRoot;
    _mode: "inline" | "popover";
    _height: number;
    _open: boolean;
    _didInit: boolean;
    _didConnect: boolean;
    get ident(): string;
    set ident(ident: string);
    get open(): boolean;
    set open(open: boolean);
    get height(): number;
    set height(height: number);
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(key: string, oldVal: string, newVal: string): void;
    renderFinished(): Promise<void>;
}
