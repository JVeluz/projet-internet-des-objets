import { DogPosture, TailState } from "../enums";
import SimulationState from "../models/SimulationState";
import IAction, { clamp } from "./IAction";

export class SleepAction implements IAction {
    name = "Dormir";

    calculateUtility(state: SimulationState): number {
        const fatigue = 1.0 - state.energyLevel;

        // Si on dort déjà, on a tendance à vouloir continuer (hystérésis)
        const inertia = state.currentPosture === DogPosture.SLEEPING ? 0.2 : 0.0;

        // Bonus s'il fait nuit
        const nightBonus = state.isNightTime ? 0.3 : 0.0;

        return clamp(fatigue + inertia + nightBonus, 0, 1);
    }

    execute(state: SimulationState): void {
        console.log("💤 Zzzzz...");
        state.currentPosture = DogPosture.SLEEPING;
        state.tailState = TailState.RELAXED_DOWN;

        state.energyLevel = clamp(state.energyLevel + 0.1, 0, 1);
        state.currentHeartRate = 50; // Cardio au repos
        state.stressLevel = clamp(state.stressLevel - 0.1, 0, 1); // Dormir calme

        // Le métabolisme continue
        state.bladderFillLevel += 0.02;
        state.satietyLevel -= 0.01;
    }
}