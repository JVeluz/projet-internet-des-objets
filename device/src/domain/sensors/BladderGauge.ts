import SimulationState from "../models/SimulationState";
import ISensor from "./ISensor";

export default class BladderGauge implements ISensor {
    id = "dog/sensors/bladder";
    read(state: SimulationState) {
        return {
            fill_pct: (state.bladderFillLevel * 100).toFixed(0) + "%",
            urgent: state.bladderFillLevel > 0.85
        };
    }
}