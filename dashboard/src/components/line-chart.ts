import { css, html, LitElement, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import Chart from 'chart.js/auto';

@customElement('line-chart')
export class LineChart extends LitElement {

    @property({ type: String }) chartTitle = "Graphique";
    @property({ type: String }) color = "rgb(75, 192, 192)";
    @property({ type: Number }) maxDataPoints = 30;
    @property({ type: Number }) value = 0;
    @property({ type: String }) label = "";

    // --- NOUVELLES PROPRIÉTÉS ---
    // Optionnelles (undefined par défaut) pour laisser Chart.js gérer si non fournies
    @property({ type: Number }) min?: number;
    @property({ type: Number }) max?: number;

    @query('canvas') private canvasElement!: HTMLCanvasElement;

    private chart: Chart | null = null;

    private labelsBuffer: string[] = [];
    private dataBuffer: number[] = [];

    static styles = css`
        canvas { width: 100%; height: 100%; }
    `;

    protected render() {
        return html`<canvas></canvas>`;
    }

    protected firstUpdated() {
        this.initChart();
    }

    protected updated(changedProperties: PropertyValues) {
        // 1. Mise à jour des DONNÉES (Ajout de point)
        if ((changedProperties.has('value') || changedProperties.has('label')) && this.chart) {
            this.addDataPoint(this.label, this.value);
        }

        // 2. Mise à jour de la CONFIGURATION (Min/Max/Couleur dynamiques)
        if (this.chart && (changedProperties.has('min') || changedProperties.has('max') || changedProperties.has('color'))) {
            this.updateChartConfig();
        }
    }

    private initChart() {
        this.chart = new Chart(this.canvasElement, {
            type: 'line',
            data: {
                labels: this.labelsBuffer,
                datasets: [{
                    label: this.chartTitle,
                    data: this.dataBuffer,
                    borderColor: this.color,
                    backgroundColor: this.color.replace('rgb', 'rgba').replace(')', ', 0.2)'),
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 800,
                    easing: 'easeOutQuart'
                },
                scales: {
                    y: {
                        // Si min n'est pas défini, on commence à 0 par défaut, sinon on respecte le min
                        beginAtZero: this.min === undefined,
                        min: this.min, // Injection du min
                        max: this.max  // Injection du max
                    }
                }
            }
        });
    }

    /**
     * Met à jour les axes et couleurs sans recréer tout le graphique
     */
    private updateChartConfig() {
        if (!this.chart) return;

        // Mise à jour des échelles
        if (this.chart.options.scales?.y) {
            this.chart.options.scales.y.min = this.min;
            this.chart.options.scales.y.max = this.max;
        }

        // Mise à jour des couleurs
        const dataset = this.chart.data.datasets[0];
        if (dataset) {
            dataset.borderColor = this.color;
            dataset.backgroundColor = this.color.replace('rgb', 'rgba').replace(')', ', 0.2)');
        }

        this.chart.update();
    }

    private addDataPoint(label: string, data: number) {
        if (!this.chart) return;

        this.labelsBuffer.push(label);
        this.dataBuffer.push(data);

        if (this.labelsBuffer.length > this.maxDataPoints) {
            this.labelsBuffer.shift();
            this.dataBuffer.shift();
        }

        this.chart.update('none'); // Mode 'none' pour performance (pas d'anim sur l'ajout de point)
    }
}