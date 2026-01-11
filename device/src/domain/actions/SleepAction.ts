import SimulationState from "../models/SimulationState";
import IAction, { clamp } from "../interfaces/IAction";

export class SleepAction implements IAction {
    name = "Dormir";

    calculateUtility(state: SimulationState): number {
        const fatigue = 1.0 - (state.energy / 100);
        if (state.is_sleeping && state.energy < 80)
            return 1.0
        return Math.pow(fatigue, 3);
    }

    execute(state: SimulationState): void {
        console.log("💤 Zzzzz...");

        state.energy = clamp(state.energy + 5, 0, 100);

        state.bladder = clamp(state.bladder + 2, 0, 100);
        state.hunger = clamp(state.hunger + 1, 0, 100);

        state.currentHeartBeat = 50;

        state.is_sleeping = true;
        state.lastSleepTimestamp = Date.now();
    }
}