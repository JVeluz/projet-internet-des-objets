import ICalibratable from "../interfaces/ICalibratable";
import ISensor from "../interfaces/ISensor";
import SimulationState from "../models/SimulationState";

export default class BladderSensor implements ISensor, ICalibratable {
    id = "dog/sensors/bladder";

    private maxPressurePa: number = 5000;

    calibrate(config: Record<string, any>): void {
        if (config.max_pressure) this.maxPressurePa = config.max_pressure;
        console.log(`🔧 [Bladder] Calibration : Max Pressure = ${this.maxPressurePa} Pa`);
    }

    read(state: SimulationState) {
        const fillRatio = state.bladder / 100;
        const pressure = Math.pow(fillRatio, 2) * this.maxPressurePa;
        return {
            pressure_pa: Math.round(pressure),
            estimated_fill_pct: Math.round(state.bladder),
            urgent: state.bladder > 80
        };
    }
}