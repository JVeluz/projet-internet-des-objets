import ICalibratable from "../interfaces/ICalibratable";
import ISensor from "../interfaces/ISensor";
import SimulationState from "../models/SimulationState";

export default class TailSensor implements ISensor, ICalibratable {
    id = "dog/sensors/tail";

    private sensitivity: number = 1.0;

    calibrate(config: Record<string, any>): void {
        if (config.sensitivity) this.sensitivity = config.sensitivity;
        console.log(`🔧 [Tail] Calibration : Sensibilité x${this.sensitivity}`);
    }

    read(state: SimulationState) {
        let baseHz = (state.fun / 100) * 6.0;

        const noise = Math.random() * 0.2;
        const finalHz = (baseHz * this.sensitivity) + noise;

        return {
            frequency_hz: parseFloat(finalHz.toFixed(1)),
            is_happy: state.fun > 50,
        };
    }
}