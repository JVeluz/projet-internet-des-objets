import { TailState } from "../enums";
import SimulationState from "../models/SimulationState";
import IEvent from "./IEvent";

export class ThunderstormEvent implements IEvent {
    name = "Coup de Tonnerre";

    shouldOccur(state: SimulationState): boolean {
        // 1% de chance n'importe quand
        return Math.random() < 0.01;
    }

    execute(state: SimulationState): void {
        console.log("⚡ ÉVÉNEMENT : BOUM ! Un coup de tonnerre !");
        // Le tonnerre ne change pas forcément le stimulus visuel, mais le stress
        state.stressLevel = 1.0; // Panique
        state.tailState = TailState.TUCKED_BETWEEN_LEGS; // Queue entre les jambes (faudra adapter l'enum)
        state.currentHeartRate += 40;
    }
}