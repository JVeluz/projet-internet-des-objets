import { html, LitElement, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import Chart from 'chart.js/auto';

@customElement('line-chart')
export class LineChart extends LitElement {

    @property({ type: String }) chartTitle = "Graphique";
    @property({ type: String }) color = "rgb(75, 192, 192)";
    @property({ type: Number }) maxDataPoints = 30;
    @property({ type: Number }) value = 0;
    @property({ type: String }) label = "";

    @query('canvas') private canvasElement!: HTMLCanvasElement;

    private chartInstance: Chart | null = null;

    private labelsBuffer: string[] = [];
    private dataBuffer: number[] = [];

    protected render() {
        return html`
            <canvas></canvas>
        `;
    }

    protected firstUpdated() {
        this.initChart();
    }

    protected updated(changedProperties: PropertyValues) {
        if ((changedProperties.has('value') || changedProperties.has('label')) && this.chartInstance) {
            this.addDataPoint(this.label, this.value);
        }
    }

    private initChart() {
        this.chartInstance = new Chart(this.canvasElement, {
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
                animation: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    private addDataPoint(label: string, data: number) {
        if (!this.chartInstance) return;

        this.labelsBuffer.push(label);
        this.dataBuffer.push(data);

        if (this.labelsBuffer.length > this.maxDataPoints) {
            this.labelsBuffer.shift();
            this.dataBuffer.shift();
        }

        this.chartInstance.update('none');
    }
}