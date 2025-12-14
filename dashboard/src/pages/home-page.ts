import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { SensorService, type SensorData } from "../services/SensorService";

import "../components/line-chart";

interface SensorState {
    deviceId: string;
    timestamp: string;
    metrics: {
        stress: number;
        heart_rate: number;
        battery: number;
    };
    alert: string;
}

@customElement('home-page')
export default class HomePage extends LitElement {

    private sensorService = new SensorService();

    @state()
    private sensorState: SensorState = {
        deviceId: "---",
        timestamp: "--:--:--",
        metrics: { stress: 0, heart_rate: 0, battery: 0 },
        alert: "NONE"
    };

    protected createRenderRoot(): HTMLElement | DocumentFragment { return this; }

    connectedCallback() {
        super.connectedCallback();

        this.sensorService.onStatusChange((sensorData: SensorData) => {
            console.log("Donnée reçue dans la Vue :", sensorData);

            this.sensorState = {
                deviceId: sensorData.deviceId || "Casque-01",
                timestamp: sensorData.timestamp ? new Date(sensorData.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString(),
                metrics: {
                    stress: sensorData.metrics?.stress || 0,
                    heart_rate: sensorData.metrics?.heart_rate || 0,
                    battery: sensorData.metrics?.battery || 0
                },
                alert: sensorData.status || "NORMAL"
            };
        });
    }

    protected render() {
        const { metrics, deviceId, timestamp, alert } = this.sensorState;

        const statusColor = alert === 'CRITICAL' ? 'red' : 'black';

        return html`
            <div style="font-family: sans-serif; padding: 20px;">
                <header style="display:flex; justify-content:space-between; align-items:center;">
                    <h1>Monitor: ${deviceId}</h1>
                    <div style="text-align:right;">
                        <small>Dernière màj : ${timestamp}</small>
                        <h3 style="color: ${statusColor}; margin:0;">Statut : ${alert}</h3>
                    </div>
                </header>
                
                <div style="display: flex; gap: 20px; margin-bottom: 20px; margin-top: 20px;">
                    <div>
                        <h3>Stress</h3>
                        <p style="font-size: 2em; margin: 0;">${metrics.stress}%</p>
                    </div>
                    <div>
                        <h3>Coeur</h3>
                        <p style="font-size: 2em; margin: 0;">${metrics.heart_rate} BPM</p>
                    </div>
                    <div>
                        <h3>Batterie</h3>
                        <p style="font-size: 2em; margin: 0;">${metrics.battery}%</p>
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