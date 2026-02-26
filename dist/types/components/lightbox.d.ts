export type LightboxCloseHandler = (e: MouseEvent | KeyboardEvent) => void;
export type LightboxOptions = {
    name: string;
    closeOnClickOutside: boolean;
    closeOnEsc: boolean;
    closeHandler: LightboxCloseHandler;
};
export declare class Lightbox {
    #private;
    body: HTMLElement;
    root: HTMLElement;
    holder: HTMLElement;
    constructor(options?: Partial<LightboxOptions>);
    setOptions(options: Partial<LightboxOptions>): void;
    render(): any;
    showSpinner(): void;
    hideSpinner(): void;
    show(): Promise<void>;
    hide(transition?: boolean): Promise<void>;
    destroy(): void;
}
/**
 * Clears the global lightbox open state - used for testing.
 * @internal
 * @ignore
 */
export declare const __clearGlobalLightboxOpen: () => void;
