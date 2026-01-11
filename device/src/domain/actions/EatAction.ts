import { VisualStimulus } from "../enums";
import SimulationState from "../models/SimulationState";
import IAction, { clamp } from "../interfaces/IAction";

export class EatAction implements IAction {
    name = "Manger";

    calculateUtility(state: SimulationState): number {
        if (state.is_sleeping) return 0.0;

        const urgency = state.hunger / 100;

        let score = Math.pow(urgency, 3);

        if (state.currentVisualStimulus === VisualStimulus.FOOD_BOWL) {
            score += 0.3;
        }

        return clamp(score, 0, 1);
    }

    execute(state: SimulationState): void {
        console.log("🍖 Miam miam...");

        state.hunger = 0;

        state.energy = clamp(state.energy + 5, 0, 100);
        state.bladder = clamp(state.bladder + 5, 0, 100);

        state.currentHeartBeat = 90;
    }
}