export type LightboxClickOutsideHandler = (e: MouseEvent) => void;
export type LightboxEscKeyHandler = (e: KeyboardEvent) => void;
export declare class Lightbox {
    #private;
    body: HTMLElement;
    root: HTMLElement;
    holder: HTMLElement;
    clickOutsideHandler: LightboxClickOutsideHandler | null;
    escKeyHandler: LightboxEscKeyHandler | null;
    constructor();
    render(): any;
    show(): Promise<void>;
    hide(): Promise<void>;
    destroy(): void;
}
