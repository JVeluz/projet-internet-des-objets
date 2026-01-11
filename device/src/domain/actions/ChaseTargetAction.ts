import { VisualStimulus } from "../enums";
import SimulationState from "../models/SimulationState";
import IAction, { clamp } from "../interfaces/IAction";

export class ChaseTargetAction implements IAction {
    name = "Chasser la Proie";

    calculateUtility(state: SimulationState): number {
        if (state.is_sleeping) return 0.0;

        const prey = [VisualStimulus.CAT, VisualStimulus.SQUIRREL, VisualStimulus.MAILMAN];

        if (prey.includes(state.currentVisualStimulus)) {
            return state.energy / 100;
        }
        return 0.0;
    }

    execute(state: SimulationState): void {
        console.log(`🐕 Le chien cout après : ${state.currentVisualStimulus}`);

        state.energy = clamp(state.energy - 15, 0, 100);
        state.fun = clamp(state.fun + 30, 0, 100);

        state.currentHeartBeat = 160 + (Math.random() * 20);
        state.bodyTemperature += 0.5;
    }
}