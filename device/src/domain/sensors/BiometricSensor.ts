import ISensor from "../interfaces/ISensor";
import ICalibratable from "../interfaces/ICalibratable";
import SimulationState from "../models/SimulationState";

export default class BiometricSensor implements ISensor, ICalibratable {
    id = "dog/sensors/heart";

    private bpmHighThreshold: number = 140;
    private tempHighThreshold: number = 39.5;

    calibrate(config: Record<string, any>): void {
        if (config.bpm_threshold) this.bpmHighThreshold = config.bpm_threshold;
        if (config.temp_threshold) this.tempHighThreshold = config.temp_threshold;
        console.log(`🔧 [Heart] Calibration mise à jour : Alerte BPM > ${this.bpmHighThreshold}`);
    }

    read(state: SimulationState) {
        const bpm = Math.round(state.currentHeartBeat + (Math.random() * 2));
        const temp = parseFloat((state.bodyTemperature + (Math.random() * 0.1)).toFixed(1));

        return {
            bpm: bpm,
            temperature_c: temp,
            alert_tachycardia: bpm > this.bpmHighThreshold,
            alert_fever: temp > this.tempHighThreshold
        };
    }
}