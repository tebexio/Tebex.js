import { h } from "../utils";

import styles from "./spinner.css?inline";
import prerenderStyles from "./prerender.css?inline";

type SpinnerOptions = {
    doc?: Document,
    props: {
        cspNonce?: string
        isEmbedded?: boolean
    }
};

export const spinnerHtml = () => {
    return (
        <div class="tebex-js-spinner"></div>
    );
}

export const spinnerRender = ({ doc, props }: SpinnerOptions) => {
    let html = null;

    // When the spinner is embedded in the lightbox, the lightbox will handle the spinner itself.
    if (props.isEmbedded) {
        html = (
            <html>
                <body>
                </body>
            </html>
        );
    } else {
        html = (
            <html>
                <body>
                    <style nonce={props.cspNonce}>{prerenderStyles}</style>
                    <style nonce={props.cspNonce}>{styles}</style>
                    {spinnerHtml()}
                </body>
            </html>
        );
    }

    // move elements to iframe document
    if (doc)
        doc.adoptNode(html);

    return html;
};