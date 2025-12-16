import { html, css, LitElement, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import Chart from 'chart.js/auto';

@customElement('horizontal-bar-chart')
export class HorizontalBarChart extends LitElement {

    @property({ type: Number }) value = 0;
    @property({ type: Number }) max = 100;
    @property({ type: String }) color = '#e5e7eb'; // Gris par défaut
    @property({ type: String }) label = '';

    @query('canvas') private canvasElement!: HTMLCanvasElement;
    private chartInstance: Chart | null = null;

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
        if (!this.chartInstance) return;
        if (changedProperties.has('value') || changedProperties.has('max') || changedProperties.has('color')) {
            this.refreshChart();
        }
    }

    private initChart() {
        this.chartInstance = new Chart(this.canvasElement, {
            type: 'bar',
            data: {
                labels: [this.label],
                datasets: [{
                    label: this.label,
                    data: [this.value],
                    backgroundColor: this.color,
                    borderRadius: 5,
                    barPercentage: 1.0,
                    categoryPercentage: 1.0
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 500
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: {
                        min: 0,
                        max: this.max,
                        display: false,
                    },
                    y: {
                        display: false
                    }
                }
            }
        });
    }

    private refreshChart() {
        if (!this.chartInstance) return;

        const dataset = this.chartInstance.data.datasets[0];

        dataset.data = [this.value];

        dataset.backgroundColor = this.color;

        if (this.chartInstance.options.scales?.x) {
            this.chartInstance.options.scales.x.max = this.max;
        }

        this.chartInstance.update();
    }
}