import { VisualStimulus, DogPosture, TailState } from "../enums";
import SimulationState from "../models/SimulationState";
import IAction, { clamp } from "./IAction";

export class ChaseTargetAction implements IAction {
    name = "Chasser la Proie";

    calculateUtility(state: SimulationState): number {
        const prey = [VisualStimulus.CAT, VisualStimulus.SQUIRREL, VisualStimulus.MAILMAN];

        if (prey.includes(state.currentVisualStimulus)) {
            // Si j'ai de l'énergie, le score est 1.0 (Priorité max)
            // Si je suis épuisé (0.1), le score baisse drastiquement
            return 1.0 * state.energyLevel;
        }
        return 0.0;
    }

    execute(state: SimulationState): void {
        console.log(`BORK! BORK! Le chien course : ${state.currentVisualStimulus}`);
        state.currentPosture = DogPosture.RUNNING;
        state.tailState = TailState.STIFF_UP;
        state.currentSpeed = 25; // km/h

        // Impact physique violent
        state.currentHeartRate = 160 + (Math.random() * 20); // 160-180 BPM
        state.energyLevel = clamp(state.energyLevel - 0.15, 0, 1); // Ça fatigue vite
        state.excitementLevel = 1.0;
        state.bodyTemperature += 0.5; // On chauffe
    }
}