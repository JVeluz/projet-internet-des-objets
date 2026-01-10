import { VisualStimulus, DogPosture, TailState } from "../enums";
import SimulationState from "../models/SimulationState";
import IAction, { clamp } from "./IAction";

export class EatAction implements IAction {
    name = "Manger";

    calculateUtility(state: SimulationState): number {
        // Courbe : (1 - satiété)^2. 
        // Ex: Satiété 0.8 (un peu faim) -> Score 0.04 (Ignorable)
        // Ex: Satiété 0.2 (très faim) -> Score 0.64 (Important)
        // Bonus si on voit une gamelle
        const hunger = 1.0 - state.satietyLevel;
        let score = Math.pow(hunger, 2);

        if (state.currentVisualStimulus === VisualStimulus.FOOD_BOWL) {
            score += 0.2; // Bonus d'opportunité
        }

        return clamp(score, 0, 1);
    }

    execute(state: SimulationState): void {
        console.log("🐕 Le chien mange gloutonnement...");
        state.currentPosture = DogPosture.STANDING;
        state.tailState = TailState.WAGGING_SLOW; // Content

        // Impact physiologique
        state.satietyLevel = clamp(state.satietyLevel + 0.2, 0, 1);
        state.bowelPressure = clamp(state.bowelPressure + 0.05, 0, 1); // La digestion avance
        state.currentHeartRate = 90; // Manger augmente un peu le cardio
    }
}