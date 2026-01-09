import { isEnvBrowser, warn } from "../utils";

export const defineTebexPortal = () => {
    class TebexPortalElement extends HTMLElement {
        constructor() {
            super();
            warn("the <tebex-portal> web component is not currently supported");
        }
    }

    customElements.define("tebex-portal", TebexPortalElement);
    return TebexPortalElement;
}

if (isEnvBrowser())
    defineTebexPortal();