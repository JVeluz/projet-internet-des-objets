import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('home-page')
export default class HomePage extends LitElement {

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this;
    }

    protected render(): unknown {
        return html`
            <h1>BONJOUR</h1>
        `;
    }
}