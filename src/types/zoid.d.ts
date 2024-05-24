declare module "zoid" {
    export enum PROP_TYPE {
        STRING = "string",
        OBJECT = "object",
        FUNCTION = "function",
        BOOLEAN = "boolean",
        NUMBER = "number",
        ARRAY = "array",
    }

    type PropTypes =
        | "string"
        | "object"
        | "function"
        | "boolean"
        | "number"
        | "array";

    export enum PROP_SERIALIZATION {
        JSON = "json",
        DOTIFY = "dotify",
        BASE64 = "base64",
    }

    type PropSerialization = "json" | "dotify" | "base64";

    export enum CONTEXT {
        IFRAME = "iframe",
        POPUP = "popup",
    }

    type ContextTypes = "iframe" | "popup";

    export enum EVENT {
        RENDER = "zoid-render",
        RENDERED = "zoid-rendered",
        DISPLAY = "zoid-display",
        ERROR = "zoid-error",
        CLOSE = "zoid-close",
        DESTROY = "zoid-destroy",
        PROPS = "zoid-props",
        RESIZE = "zoid-resize",
        FOCUS = "zoid-focus",
    }

    type EventTypes =
        | "zoid-render"
        | "zoid-rendered"
        | "zoid-display"
        | "zoid-error"
        | "zoid-close"
        | "zoid-destroy"
        | "zoid-props"
        | "zoid-resize"
        | "zoid-focus";

    export type Zoid = {
        // https://github.com/krakenjs/zoid/blob/main/docs/api/create.md
        create: (opts?: Partial<ComponentConfig>) => any;
        destroy: any;
        destroyComponents: any;
        destroyAll: any;
        PROP_TYPE: PROP_TYPE;
        PROP_SERIALIZATION: PROP_SERIALIZATION;
        CONTEXT: CONTEXT;
        EVENT: EVENT;
        PopupOpenError: any;
        isChild(): boolean;
        xprops: any;
    };

    type ComponentProps = Record<
        string,
        {
            type: PropTypes;
            required: boolean;
        }
    >;

    export type ComponentConfig = {
        tag: string;
        url: string | ((props: ComponentProps) => string);
        props?: ComponentProps;
        dimensions?: {
            width: string | number;
            height: string | number;
        };
        autoResize?: {
            width?: boolean;
            height?: boolean;
            element?: string;
            scroll?: boolean;
        };
        prerenderTemplate?: ({ doc: Document, props: ComponentProps }) => HTMLElement;
        attributes?: {
            iframe: {
                allow: string
            }
        };
        allowedParentDomains?: string | Array<string | RegExp>;
        defaultContext?: ContextTypes;
        validate?: ({ props: ComponentProps }) => void;
        eligable?: ({ props: any }) => boolean;
    }

    export function PopupOpenError(): void;
    export function create(config: ComponentConfig): Zoid;
    export function destroy(): void;
    export function destroyComponents(): void;
    export function destroyAll(): void;
}

declare module "zoid/dist/zoid.frame.js" {
    import {
        PopupOpenError,
        create,
        destroy,
        destroyComponents,
        destroyAll,
        PROP_TYPE,
        PROP_SERIALIZATION,
        CONTEXT,
        EVENT,
        Zoid,
    } from "zoid";

    export {
        PopupOpenError,
        create,
        destroy,
        destroyComponents,
        destroyAll,
        PROP_TYPE,
        PROP_SERIALIZATION,
        CONTEXT,
        EVENT,
        Zoid,
    };
}
