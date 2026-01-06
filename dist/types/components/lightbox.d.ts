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
    show(): Promise<void>;
    hide(transition?: boolean): Promise<void>;
    destroy(): void;
}
