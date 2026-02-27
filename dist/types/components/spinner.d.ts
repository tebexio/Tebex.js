type SpinnerOptions = {
    doc?: Document;
    props: {
        cspNonce?: string;
        isEmbedded?: boolean;
    };
};
export declare const spinnerHtml: () => any;
export declare const spinnerRender: ({ doc, props }: SpinnerOptions) => any;
export {};
