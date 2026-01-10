import { VisualStimulus } from "../enums";
import SimulationState from "../models/SimulationState";
import IEvent from "./IEvent";

export class MailmanArrivalEvent implements IEvent {
    name = "Arrivée Facteur";

    shouldOccur(state: SimulationState): boolean {
        // Le facteur ne passe pas la nuit !
        if (state.isNightTime) return false;
        // 2% de chance
        return Math.random() < 0.02;
    }

    execute(state: SimulationState): void {
        console.log("📨 ÉVÉNEMENT : Le facteur approche de la boîte aux lettres...");
        state.currentVisualStimulus = VisualStimulus.MAILMAN;
        state.stressLevel = Math.min(1, state.stressLevel + 0.5); // Gros stress
        state.currentHeartRate += 30;
    }
}