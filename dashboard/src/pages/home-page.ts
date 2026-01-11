import { html, LitElement, css } from "lit";
import { customElement, state } from "lit/decorators.js";

import "../components/line-chart";
import "../components/horizontal-bar-chart";

import { SensorRepository } from "../data/SensorRepository";
import { AIRepository } from "../data/AIRepository";

import type { DogGlobalState } from "../interfaces/sensor";

// État initial
const INITIAL_STATE: DogGlobalState = {
    heart: { bpm: 70, temperature_c: 38.5, alert_tachycardia: false, alert_fever: false },
    bladder: { pressure_pa: 0, estimated_fill_pct: 0, urgent: false },
    tail: { frequency_hz: 0, is_happy: false, is_sad: false },
    vision: { detected_object: "NONE" },
    brain: { neural_activity_hz: 10, is_sleeping: false },
    gastric: { stomach_volume_ml: 500, capacity_max: 500, is_hungry: false }
};

@customElement('home-page')
export default class HomePage extends LitElement {

    private sensorRepository = new SensorRepository();
    private aiRepository = new AIRepository();

    @state()
    private dogState: DogGlobalState = INITIAL_STATE;

    @state()
    private aiThought: string | null = "En attente de connexion neurale...";

    connectedCallback() {
        super.connectedCallback();
        this.sensorRepository.subscribe((newState) => {
            this.dogState = { ...this.dogState, ...newState };
        });
        this.aiRepository.subscribe((newThought) => {
            this.aiThought = newThought;
        });
    }

    // --- ACTIONS DE CALIBRATION ---

    private handleCalibrateHeart() {
        const bpmInput = this.shadowRoot?.getElementById('conf-bpm') as HTMLInputElement;
        const tempInput = this.shadowRoot?.getElementById('conf-temp') as HTMLInputElement;
        if (bpmInput && tempInput) {
            this.sensorRepository.calibrateSensor("dog/sensors/heart", {
                bpm_threshold: Number(bpmInput.value),
                temp_threshold: Number(tempInput.value)
            });
            alert("✅ Calibration Cœur envoyée !");
        }
    }

    private handleCalibrateBladder() {
        const pressureInput = this.shadowRoot?.getElementById('conf-pressure') as HTMLInputElement;
        if (pressureInput) {
            this.sensorRepository.calibrateSensor("dog/sensors/bladder", {
                max_pressure: Number(pressureInput.value)
            });
            alert("✅ Calibration Vessie envoyée !");
        }
    }

    private handleCalibrateTail() {
        // Récupération des 3 paramètres de calibration émotionnelle
        const sensInput = this.shadowRoot?.getElementById('conf-sens') as HTMLInputElement;
        const maxJoyInput = this.shadowRoot?.getElementById('conf-max-joy') as HTMLInputElement;
        const threshInput = this.shadowRoot?.getElementById('conf-happy-thresh') as HTMLInputElement;

        if (sensInput && maxJoyInput && threshInput) {
            this.sensorRepository.calibrateSensor("dog/sensors/tail", {
                sensitivity: Number(sensInput.value),
                max_joy_hz: Number(maxJoyInput.value),
                happy_threshold: Number(threshInput.value)
            });
            alert("✅ Calibration Émotionnelle (Queue) envoyée !");
        }
    }

    private handleCalibrateGastric() {
        const stomachInput = this.shadowRoot?.getElementById('conf-stomach') as HTMLInputElement;
        if (stomachInput) {
            this.sensorRepository.calibrateSensor("dog/sensors/gastric", {
                stomach_capacity: Number(stomachInput.value)
            });
            alert("✅ Calibration Digestion envoyée !");
        }
    }

    // --- HELPERS ---

    private getGlobalStatus() {
        const { heart, bladder } = this.dogState;
        if (heart.alert_tachycardia || heart.alert_fever || bladder.urgent) return 'CRITICAL';
        return 'NORMAL';
    }

    private getVisionIcon(objectName: string) {
        const map: Record<string, string> = {
            'CAT': '🐱', 'MAILMAN': '📬', 'SQUIRREL': '🐿️',
            'FOOD_BOWL': '🍖', 'OWNER': '👤', 'NONE': '👁️'
        };
        return map[objectName] || '❓';
    }

    private formatSleepTime(ts?: number) {
        if (!ts) return "--";
        const diffMinutes = Math.floor((Date.now() - ts) / 60000);
        return `Il y a ${diffMinutes} min`;
    }

    protected render() {
        const { heart, bladder, tail, vision, brain, gastric } = this.dogState;
        const status = this.getGlobalStatus();
        const timestamp = new Date().toLocaleTimeString();

        // Couleurs
        const heartColor = heart.alert_tachycardia ? '#ef4444' : '#3b82f6';
        const tempColor = heart.alert_fever ? '#ef4444' : '#06b6d4';
        const brainColor = brain.is_sleeping ? '#6366f1' : '#10b981';

        let bladderColor = '#10b981';
        if (bladder.estimated_fill_pct > 50) bladderColor = '#f59e0b';
        if (bladder.estimated_fill_pct > 80) bladderColor = '#ef4444';

        const stomachFillPct = (gastric.stomach_volume_ml / gastric.capacity_max) * 100;
        let stomachColor = '#10b981';
        if (stomachFillPct < 50) stomachColor = '#f59e0b';
        if (stomachFillPct < 20) stomachColor = '#ef4444';

        return html`
            <div class="container">
                
                <header>
                    <div>
                        <h1>Cyber-Dog Monitor</h1>
                        <div class="meta">Système Biologique • MAJ: ${timestamp}</div>
                    </div>
                    <div class="badge status-${status}">
                        ${status === 'NORMAL' ? '🟢 Système Nominal' : '🔴 ALERTE'}
                    </div>
                </header>

                <div class="ai-panel">
                    <div class="ai-avatar">🐕</div>
                    <div class="ai-content">
                        <h3>Flux de Pensée</h3>
                        <p>« ${this.aiThought} »</p>
                    </div>
                </div>

                <div class="grid-kpi">
                    <div class="card">
                        <div class="card-header">Activité Neurale</div>
                        <div class="value-big" style="color: ${brainColor}">
                            ${brain.is_sleeping ? 'ZZZ...' : 'ÉVEIL'}
                        </div>
                        <div style="font-size:0.8rem; color:#9ca3af; margin-top:5px; display:flex; justify-content:space-between;">
                            <span>${brain.neural_activity_hz} Hz</span>
                            <span>${brain.is_sleeping ? 'Mode Veille' : 'Actif'}</span>
                        </div>
                        <div style="margin-top:10px; font-size:0.75rem; color:#6b7280; border-top: 1px solid #f3f4f6; padding-top:5px;">
                            Dernier sommeil : <strong>${this.formatSleepTime(brain.last_sleep_ts)}</strong>
                        </div>
                    </div>

                    <div class="card" style="position: relative; overflow: hidden;">
                        <div class="card-header">Vision</div>
                        <div class="vision-text">
                            ${this.getVisionIcon(vision.detected_object)} ${vision.detected_object}
                        </div>
                        ${brain.is_sleeping ? html`
                            <div style="
                                position: absolute; top:0; left:0; right:0; bottom:0;
                                background: rgba(255,255,255,0.9); backdrop-filter: blur(3px);
                                display: flex; align-items: center; justify-content: center;
                                flex-direction: column; color: #6b7280; font-weight: bold; z-index: 10;
                            ">
                                <span style="font-size: 2.5rem;">🙈</span>
                                <span style="margin-top: 10px;">YEUX FERMÉS</span>
                            </div>
                        ` : ''}
                    </div>

                    <div class="card">
                        <div class="card-header">Cardio ${heart.alert_tachycardia ? '⚠️' : ''}</div>
                        <div class="value-big" style="color: ${heartColor}">
                            ${heart.bpm}<span class="unit">BPM</span>
                        </div>
                        <div style="font-size:0.8rem; color:#9ca3af; margin-top:5px;">
                            ${heart.alert_tachycardia ? 'Tachycardie détectée' : 'Rythme normal'}
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">Température ${heart.alert_fever ? '🔥' : '🌡️'}</div>
                        <div class="value-big" style="color: ${tempColor}">
                            ${heart.temperature_c}<span class="unit">°C</span>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">Estomac ${gastric.is_hungry ? '🍗' : '✅'}</div>
                        <div class="value-big" style="color: ${stomachColor}">
                            ${gastric.stomach_volume_ml}<span class="unit">mL</span>
                        </div>
                        <div style="height: 12px; width: 100%; margin-top: 10px;">
                            <horizontal-bar-chart .value=${stomachFillPct} .max=${100} .color=${stomachColor}></horizontal-bar-chart>
                        </div>
                        <div style="font-size:0.8rem; color:#9ca3af; margin-top:5px;">
                             ${gastric.is_hungry ? 'Besoin calorique' : 'Satiété OK'}
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">Vessie ${bladder.urgent ? '⚠️' : ''}</div>
                        <div class="value-big">
                            ${bladder.estimated_fill_pct}<span class="unit">%</span>
                        </div>
                        <div style="height: 12px; width: 100%; margin-top: 10px;">
                            <horizontal-bar-chart .value=${bladder.estimated_fill_pct} .max=${100} .color=${bladderColor}></horizontal-bar-chart>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">Queue (Émotion)</div>
                        <div class="value-big">${tail.frequency_hz}<span class="unit">Hz</span></div>
                        <div style="margin-top:5px;">
                            ${tail.is_happy
                ? html`<span class="badge" style="background:#d1fae5; color:#065f46">HAPPY (Joy)</span>`
                : tail.is_sad
                    ? html`<span class="badge" style="background:#fee2e2; color:#b91c1c">SAD (Null)</span>`
                    : html`<span class="badge" style="background:#f3f4f6; color:#4b5563">NEUTRAL</span>`
            }
                        </div>
                    </div>
                </div>

                <div class="grid-charts">
                    <div class="card">
                        <div class="card-header">Historique Cardiaque</div>
                        <div class="chart-container">
                            <line-chart chartTitle="BPM" color="${heartColor}" .value=${heart.bpm} .label=${timestamp} .min=${40} .max=${200}></line-chart>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">Activité Caudale</div>
                        <div class="chart-container">
                            <line-chart chartTitle="Hz" color="#8b5cf6" .value=${tail.frequency_hz} .label=${timestamp} .min=${0} .max=${10}></line-chart>
                        </div>
                    </div>
                </div>

                <div class="config-section">
                    <h2 style="margin:0 0 20px 0; font-size:1.2rem; color:#1f2937; border-bottom:1px solid #e5e7eb; padding-bottom:10px;">
                        🔧 Calibration Capteurs (Admin)
                    </h2>
                    
                    <div class="config-grid">
                        
                        <div class="config-card">
                            <h4>Biométrie (Heart)</h4>
                            <div class="input-group">
                                <label>Seuil Alerte BPM</label>
                                <input type="number" id="conf-bpm" value="140">
                            </div>
                            <div class="input-group">
                                <label>Seuil Alerte Temp (°C)</label>
                                <input type="number" id="conf-temp" value="39.5" step="0.1">
                            </div>
                            <button class="btn-calibrate" @click=${this.handleCalibrateHeart}>Appliquer</button>
                        </div>

                        <div class="config-card">
                            <h4>Accéléromètre (Tail)</h4>
                            <div class="input-group">
                                <label>Sensibilité (x)</label>
                                <input type="number" id="conf-sens" value="1.0" step="0.1">
                            </div>
                            <div class="input-group">
                                <label>Max Joy (Hz à 100%)</label>
                                <input type="number" id="conf-max-joy" value="5.0" step="0.5">
                            </div>
                            <div class="input-group">
                                <label>Seuil Bonheur (Hz)</label>
                                <input type="number" id="conf-happy-thresh" value="2.0" step="0.5">
                            </div>
                            <button class="btn-calibrate" @click=${this.handleCalibrateTail}>Appliquer</button>
                        </div>

                        <div class="config-card">
                            <h4>Digestion (Gastric)</h4>
                            <div class="input-group">
                                <label>Capacité Estomac (mL)</label>
                                <input type="number" id="conf-stomach" value="500">
                            </div>
                            <button class="btn-calibrate" @click=${this.handleCalibrateGastric}>Appliquer</button>
                        </div>

                        <div class="config-card">
                            <h4>Hydraulique (Bladder)</h4>
                            <div class="input-group">
                                <label>Pression Max (Pa)</label>
                                <input type="number" id="conf-pressure" value="5000">
                            </div>
                            <button class="btn-calibrate" @click=${this.handleCalibrateBladder}>Appliquer</button>
                        </div>

                    </div>
                </div>

            </div>
        `;
    }

    static styles = css`
        :host {
            display: block;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #f3f4f6;
            min-height: 100vh;
            color: #1f2937;
            padding-bottom: 60px;
        }

        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }

        /* Header */
        header {
            position: sticky; top: 10px; z-index: 100;
            background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(8px);
            border-radius: 16px; padding: 15px 25px;
            display: flex; justify-content: space-between; align-items: center;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid rgba(255,255,255,0.5);
            margin-bottom: 30px;
        }
        h1 { margin: 0; font-size: 1.5rem; color: #111827; }
        .meta { color: #6b7280; font-size: 0.85rem; margin-top: 4px; }

        /* Badges */
        .badge { padding: 6px 16px; border-radius: 999px; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; }
        .status-NORMAL { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
        .status-WARNING { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .status-CRITICAL { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; animation: pulse 2s infinite; }

        /* AI Panel */
        .ai-panel {
            background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); color: white;
            padding: 25px; border-radius: 20px; display: flex; gap: 20px; align-items: center;
            box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5); margin-bottom: 24px;
        }
        .ai-avatar { font-size: 3rem; background: rgba(255,255,255,0.2); border-radius: 50%; padding: 10px; }
        .ai-content h3 { margin: 0 0 5px 0; font-size: 0.9rem; opacity: 0.8; text-transform: uppercase; }
        .ai-content p { margin: 0; font-size: 1.4rem; font-weight: 600; font-style: italic; font-family: 'Georgia', serif; }

        /* Grids & Cards */
        .grid-kpi { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 24px; }
        .grid-charts { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; margin-bottom: 24px; }
        
        .card {
            background: white; border-radius: 16px; padding: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;
            display: flex; flex-direction: column;
        }
        .card-header { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #9ca3af; margin-bottom: 10px; display: flex; justify-content: space-between; }
        .value-big { font-size: 2.5rem; font-weight: 800; color: #1f2937; line-height: 1; }
        .unit { font-size: 1rem; color: #6b7280; font-weight: 500; margin-left: 4px; }
        .vision-text { font-size: 1.8rem; font-weight: 700; color: #4b5563; }
        .chart-container { height: 250px; width: 100%; position: relative; }

        /* Config */
        .config-section { margin-top: 40px; background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e5e7eb; }
        .config-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 20px; }
        .config-card { background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
        .config-card h4 { margin: 0 0 15px 0; color: #4b5563; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em; }
        
        .input-group { margin-bottom: 12px; }
        .input-group label { display: block; font-size: 0.85rem; color: #6b7280; margin-bottom: 5px; }
        input[type="number"] { width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; box-sizing: border-box; }
        
        button.btn-calibrate {
            background-color: #4b5563; color: white; border: none; width: 100%; padding: 10px;
            border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 10px; transition: background 0.2s;
        }
        button.btn-calibrate:hover { background-color: #1f2937; }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
            100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }

        @media (max-width: 768px) {
            header { flex-direction: column; text-align: center; }
            .grid-charts { grid-template-columns: 1fr; }
            .ai-panel { flex-direction: column; text-align: center; }
        }
    `;
}