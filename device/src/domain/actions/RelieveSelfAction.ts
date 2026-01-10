import { DogPosture, TailState } from "../enums";
import SimulationState from "../models/SimulationState";
import IAction, { clamp } from "./IAction";

export class RelieveSelfAction implements IAction {
    name = "Besoins Naturels";

    calculateUtility(state: SimulationState): number {
        // On prend le pire des deux besoins
        const urgency = Math.max(state.bladderFillLevel, state.bowelPressure);

        // Courbe très exponentielle : l'urgence arrive d'un coup
        return Math.pow(urgency, 4);
    }

    execute(state: SimulationState): void {
        console.log("💩 Le chien se soulage...");
        state.currentPosture = DogPosture.POOPING_POSITION;
        state.tailState = TailState.TUCKED_BETWEEN_LEGS; // Concentration
        state.currentSpeed = 0;

        // Soulagement
        state.bladderFillLevel = 0;
        state.bowelPressure = 0;

        // Soulagement psychologique
        state.stressLevel = clamp(state.stressLevel - 0.2, 0, 1);
    }
}