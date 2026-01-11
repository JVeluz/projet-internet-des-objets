import { VisualStimulus } from "../enums";
import SimulationState from "../models/SimulationState";
import IEvent from "../interfaces/IEvent";

export class MailmanArrivalEvent implements IEvent {
    name = "Arrivée Facteur";

    shouldOccur(state: SimulationState): boolean {
        return Math.random() < 0.02;
    }

    execute(state: SimulationState): void {
        console.log("📨 ÉVÉNEMENT : Le facteur est là !");

        state.currentVisualStimulus = VisualStimulus.MAILMAN;

        state.fun = Math.min(100, state.fun + 20);
        state.currentHeartBeat = 110;
    }
}