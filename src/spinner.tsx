import { h } from "./utils";

import styles from "./styles/spinner.css";

type SpinnerOptions = {
    doc?: Document,
    props: {
        cspNonce?: string
    }
};

export const spinnerRender = ({ doc, props }: SpinnerOptions) => {
    const html = (
        <html>
            <body>
                <style nonce={ props.cspNonce }>{ styles }</style>
                <div class="tebex-js-spinner"></div>
            </body>
        </html>
    );

    // move elements to iframe document
    if (doc)
        doc.adoptNode(html);

    return html;
};