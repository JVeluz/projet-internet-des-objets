import SimulationState from "../models/SimulationState";
import IAction, { clamp } from "../interfaces/IAction";

export class WanderAction implements IAction {
    name = "Errer";

    calculateUtility(state: SimulationState): number {
        if (state.is_sleeping) return 0.0;
        return 0.25;
    }

    execute(state: SimulationState): void {
        console.log("... Le chien trottine ...");

        state.energy = clamp(state.energy - 1, 0, 100);
        state.fun = clamp(state.fun - 1, 0, 100);
        state.hunger = clamp(state.hunger + 1, 0, 100);

        state.currentHeartBeat = 70 + (Math.random() * 5);
        state.bodyTemperature = 38.5;
    }
}