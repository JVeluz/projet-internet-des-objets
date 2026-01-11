import { VisualStimulus } from "../enums";
import SimulationState from "../models/SimulationState";
import IEvent from "../interfaces/IEvent";

export class CatEscapeEvent implements IEvent {
    name = "Fuite du Chat";

    shouldOccur(state: SimulationState): boolean {
        if (state.currentVisualStimulus !== VisualStimulus.CAT) {
            return false;
        }
        return Math.random() < 0.25;
    }

    execute(state: SimulationState): void {
        console.log("💨 ÉVÉNEMENT : Le chat a sauté par-dessus la clôture !");

        state.currentVisualStimulus = VisualStimulus.NONE;

        state.fun = Math.max(0, state.fun - 15);

        if (state.currentHeartBeat > 120) {
            state.currentHeartBeat -= 40;
        }
    }
}