import { VisualStimulus } from "../enums";
import SimulationState from "../models/SimulationState";
import IEvent from "../interfaces/IEvent";

export class MailmanEscapeEvent implements IEvent {
    name = "Départ du Facteur";

    shouldOccur(state: SimulationState): boolean {
        if (state.currentVisualStimulus !== VisualStimulus.MAILMAN) {
            return false;
        }
        return Math.random() < 0.30;
    }

    execute(state: SimulationState): void {
        console.log("🚚 ÉVÉNEMENT : Le facteur redémarre et s'éloigne !");

        state.currentVisualStimulus = VisualStimulus.NONE;

        // Satisfaction : "J'ai bien défendu la maison !"
        state.fun = Math.min(100, state.fun + 20);

        if (state.currentHeartBeat > 100) {
            state.currentHeartBeat -= 30;
        }
    }
}