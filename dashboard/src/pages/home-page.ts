import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "../components/line-chart";

interface SensorData {
    deviceId: string;
    timestamp: string;
    metrics: { stress: number; heart_rate: number; battery: number; };
    alert: string;
}

@customElement('home-page')
export default class HomePage extends LitElement {

    @state()
    private data: SensorData = {
        deviceId: "---", timestamp: "--:--:--",
        metrics: { stress: 0, heart_rate: 0, battery: 0 }, alert: "NONE"
    };

    private refreshInterval: number | undefined;

    protected createRenderRoot(): HTMLElement | DocumentFragment { return this; }

    connectedCallback() {
        super.connectedCallback();
        this.refreshInterval = setInterval(() => this.simulateData(), 1000);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.refreshInterval) clearInterval(this.refreshInterval);
    }

    private simulateData() {
        const time = Date.now() / 1000;
        this.data = {
            deviceId: "casque_demo_01",
            timestamp: new Date().toLocaleTimeString(),
            metrics: {
                stress: Math.max(0, Math.min(100, Math.round(50 + Math.sin(time) * 20 + (Math.random() - 0.5) * 10))),
                // On simule un rythme cardiaque un peu différent
                heart_rate: Math.round(80 + Math.cos(time) * 10 + Math.random() * 5),
                battery: 85
            },
            alert: "NORMAL"
        };
    }

    protected render() {
        const { metrics, deviceId, timestamp } = this.data;

        return html`
            <div style="font-family: sans-serif; padding: 20px;">
                <h1>Monitor: ${deviceId}</h1>
                
                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                    <div>
                        <h3>Stress</h3>
                        <p style="font-size: 2em; margin: 0;">${metrics.stress}%</p>
                    </div>
                    <div>
                        <h3>Coeur</h3>
                        <p style="font-size: 2em; margin: 0;">${metrics.heart_rate} BPM</p>
                    </div>
                </div>

                <hr>

                <section style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: 300px;">
                    
                    <div style="border: 1px solid #ddd; padding: 10px; height: 100%;">
                        <line-chart 
                            chartTitle="Niveau de Stress" 
                            color="rgb(255, 99, 132)" 
                            .value=${metrics.stress} 
                            .label=${timestamp}
                        ></line-chart>
                    </div>

                    <div style="border: 1px solid #ddd; padding: 10px; height: 100%;">
                        <line-chart 
                            chartTitle="Rythme Cardiaque (BPM)" 
                            color="rgb(54, 162, 235)" 
                            .value=${metrics.heart_rate} 
                            .label=${timestamp}
                        ></line-chart>
                    </div>

                </section>
            </div>
        `;
    }
}