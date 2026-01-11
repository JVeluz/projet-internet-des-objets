import SimulationState from "../models/SimulationState";
import IEvent from "../interfaces/IEvent";

export class ThunderstormEvent implements IEvent {
    name = "Coup de Tonnerre";

    shouldOccur(state: SimulationState): boolean {
        return Math.random() < 0.01;
    }

    execute(state: SimulationState): void {
        console.log("⚡ ÉVÉNEMENT : BOUM ! Tonnerre !");

        state.fun = 0;
        state.energy = Math.max(0, state.energy - 10);

        // La peur peut provoquer... des accidents
        if (state.bladder > 50) {
            state.bladder = Math.min(100, state.bladder + 20);
        }

        state.currentHeartBeat = 180;
        state.bodyTemperature += 1.0; // Coup de chaud
    }
}