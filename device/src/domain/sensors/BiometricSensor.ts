import SimulationState from "../models/SimulationState";
import ISensor from "./ISensor";

export default class BiometricSensor implements ISensor {
    id = "dog/sensors/heart";
    read(state: SimulationState) {
        // Ajout d'un bruit de mesure (+/- 3 BPM) pour faire réaliste
        const noise = Math.floor(Math.random() * 7) - 3;
        return {
            bpm: Math.max(30, Math.round(state.currentHeartRate + noise)),
            temp_c: state.bodyTemperature.toFixed(1)
        };
    }
}