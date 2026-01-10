import SimulationState from "../models/SimulationState";
import ISensor from "./ISensor";

export default class GpsTracker implements ISensor {
    id = "dog/sensors/gps";
    read(state: SimulationState) {
        return {
            posture: state.currentPosture,
            speed_kmh: state.currentSpeed.toFixed(1),
            tail_state: state.tailState,
            location_context: state.currentVisualStimulus // Ce que le chien voit
        };
    }
}