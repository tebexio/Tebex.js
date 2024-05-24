export declare class Lightbox {
    body: Element;
    root: Element;
    holder: Element;
    constructor();
    render(): any;
    show(): Promise<void>;
    hide(): Promise<void>;
}
