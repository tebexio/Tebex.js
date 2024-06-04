export declare class Lightbox {
    body: HTMLElement;
    root: HTMLElement;
    holder: HTMLElement;
    constructor();
    render(): any;
    show(): Promise<void>;
    hide(): Promise<void>;
    destroy(): void;
}
