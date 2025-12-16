import { html, LitElement, css } from "lit";
import { customElement, state } from "lit/decorators.js";

import "../components/line-chart";
import "../components/horizontal-bar-chart";

import { SensorRepository } from "../data/SensorRepository";
import { AIRepository } from "../data/AIRepository";

import { SafetyStatus, type SensorData } from "../interfaces/sensor";

@customElement('home-page')
export default class HomePage extends LitElement {

    private sensorService = new SensorRepository();
    private aiService = new AIRepository();

    @state()
    private sensorData: SensorData = { status: SafetyStatus.NORMAL };

    @state()
    private aiAdvice: string | null = null;

    static styles = css`
        :host {
            display: block;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #f0f2f5;
            min-height: 100vh;
            color: #1f2937;
            padding-bottom: 40px;
        }

        /* Container principal centré */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* --- HEADER (Glassmorphism) --- */
        header {
            position: sticky;
            top: 20px;
            z-index: 100;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            border-radius: 16px;
            padding: 15px 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            margin-bottom: 30px;
            border: 1px solid rgba(255,255,255,0.5);
        }

        h1 { margin: 0; font-size: 1.5rem; color: #111827; letter-spacing: -0.5px; }
        .meta { color: #6b7280; font-size: 0.85rem; margin-top: 4px; }

        /* Badges de statut */
        .badge {
            padding: 6px 16px;
            border-radius: 999px;
            font-weight: 700;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            transition: all 0.3s ease;
        }
        .status-NORMAL { background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
        .status-WARNING { background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .status-CRITICAL { 
            background-color: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; 
            animation: pulse 2s infinite;
        }

        /* --- GRILLES --- */
        .grid-kpi {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 24px;
        }

        .grid-charts {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            margin-bottom: 24px;
        }

        /* --- CARDS (Cartes) --- */
        .card {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            border: 1px solid #f3f4f6;
            display: flex;
            flex-direction: column;
        }

        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .card-header {
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            color: #9ca3af;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .value-big {
            font-size: 2.5rem;
            font-weight: 800;
            color: #1f2937;
            margin-bottom: 5px;
        }
        
        .unit { font-size: 1rem; color: #6b7280; font-weight: 500; margin-left: 4px; }

        /* --- Jauge Batterie --- */
        .battery-container { height: 12px; margin-top: 15px; border-radius: 6px; overflow: hidden; }

        /* --- Chart Containers --- */
        .chart-container {
            height: 300px; /* Hauteur fixe pour Chart.js */
            width: 100%;
            position: relative;
        }

        /* --- AI PANEL --- */
        .ai-panel {
            background: linear-gradient(135deg, #e0f2fe 0%, #eff6ff 100%);
            border-left: 6px solid #3b82f6;
            padding: 20px;
            border-radius: 12px;
            display: flex;
            gap: 15px;
            align-items: start;
        }
        .ai-icon { font-size: 2rem; }
        .ai-content h3 { margin: 0 0 5px 0; color: #1e40af; font-size: 1.1rem; }
        .ai-content p { margin: 0; color: #334155; line-height: 1.5; }

        /* Animation */
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
            100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }

        /* Responsive */
        @media (max-width: 768px) {
            header { flex-direction: column; gap: 10px; text-align: center; }
            .grid-charts { grid-template-columns: 1fr; }
            .value-big { font-size: 2rem; }
        }
    `;

    connectedCallback() {
        super.connectedCallback();
        this.sensorService.subscribe((newData) => { this.sensorData = newData; });
        this.aiService.subscribe((newAdvice) => { this.aiAdvice = newAdvice; });
    }

    protected render() {
        const { deviceId, timestamp, metrics, status } = this.sensorData;
        const advice = this.aiAdvice;
        console.log(metrics);


        const safeStress = metrics?.stress ?? 0;
        const safeBpm = metrics?.heart_rate ?? 0;
        const safeBattery = metrics?.battery ?? 0;
        console.log(safeBattery);

        const safeTime = timestamp ? timestamp.toLocaleTimeString() : "--:--:--";
        const safeId = deviceId ?? "N/A";

        let batteryColor = '#e5e7eb';
        if (safeBattery > 0) {
            if (safeBattery < 30) batteryColor = '#ef4444';
            else if (safeBattery < 60) batteryColor = '#f59e0b';
            else batteryColor = '#10b981';
        }

        let stressColor = '#10b981';
        if (safeStress > 50) stressColor = '#f59e0b';
        if (safeStress > 80) stressColor = '#ef4444';

        return html`
            <div class="container">
                <header>
                    <div>
                        <h1>Moniteur Patient</h1>
                        <div class="meta">ID: <strong>${safeId}</strong> • Dernière MAJ: ${safeTime}</div>
                    </div>
                    <div class="badge status-${status}">
                        ${status === 'NORMAL' ? '🟢 Stable' : status === 'WARNING' ? '🟠 Attention' : '🔴 Critique'}
                    </div>
                </header>

                <div class="grid-kpi">
                    <div class="card">
                        <div class="card-header">Niveau de Stress <span>🧠</span></div>
                        <div class="value-big" style="color: ${stressColor}">
                            ${safeStress}<span class="unit">%</span>
                        </div>
                        <div style="font-size:0.8rem; color:#9ca3af;">Seuil critique: 80%</div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">Fréquence Cardiaque <span>❤️</span></div>
                        <div class="value-big">
                            ${safeBpm}<span class="unit">BPM</span>
                        </div>
                        <div style="font-size:0.8rem; color:#9ca3af;">Moyenne repos: 60-100</div>
                    </div>

                    <div class="card">
                        <div class="card-header">Batterie Capteur <span>🔋</span></div>
                        <div style="display:flex; justify-content:space-between; align-items:baseline;">
                            <div class="value-big">${safeBattery}<span class="unit">%</span></div>
                        </div>
                        <div style="height: 12px; width: 100%; margin-top: 10px;">
                            <horizontal-bar-chart 
                                .value=${safeBattery} 
                                .max=${100} 
                                .color=${batteryColor}
                            ></horizontal-bar-chart>
                        </div>
                    </div>
                </div>

                <div class="grid-charts">
                    <div class="card">
                        <div class="card-header">Historique Stress (30s)</div>
                        <div class="chart-container">
                            <line-chart 
                                chartTitle="Stress (%)" 
                                color="rgb(236, 72, 153)" 
                                .value=${safeStress} 
                                .label=${safeTime}
                            ></line-chart>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">Historique Cardiaque (30s)</div>
                        <div class="chart-container">
                            <line-chart 
                                chartTitle="BPM" 
                                color="rgb(59, 130, 246)" 
                                .value=${safeBpm} 
                                .label=${safeTime}
                            ></line-chart>
                        </div>
                    </div>
                </div>

                ${advice ? html`
                    <div class="ai-panel fade-in">
                        <div class="ai-icon">🤖</div>
                        <div class="ai-content">
                            <h3>Analyse Assistant IA</h3>
                            <p>${advice}</p>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}