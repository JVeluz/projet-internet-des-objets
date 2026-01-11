import ISensor from "../interfaces/ISensor";
import SimulationState from "../models/SimulationState";

export default class EyeSensor implements ISensor {
    id = "dog/vision";

    read(state: SimulationState) {
        if (state.is_sleeping) {
            return {
                detected_object: "NONE",
                confidence: 0
            };
        }
        return {
            detected_object: state.currentVisualStimulus,
        };
    }
}