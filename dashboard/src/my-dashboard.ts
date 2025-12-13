import { Router } from "@lit-labs/router";
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import HomePage from "./pages/home-page";

@customElement('my-dashboard')
export default class MyDashboard extends LitElement {
    private readonly routes = new Router(this, [
        { path: '/*', render: () => new HomePage() },
    ]);

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this;
    }

    protected render(): unknown {
        return html`
            <header></header>
            <main class="container">
                ${this.routes.outlet()}
            </main>
            <footer></footer>
        `;
    }
}