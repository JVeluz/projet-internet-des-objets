import { DogPosture, TailState } from "../enums";
import SimulationState from "../models/SimulationState";
import IAction, { clamp } from "./IAction";

export class IdleAction implements IAction {
    name = "Errer";

    calculateUtility(state: SimulationState): number {
        // Score constant bas. 
        // Toutes les autres actions doivent battre 0.1 pour s'activer.
        return 0.5;
    }

    execute(state: SimulationState): void {
        console.log("... Le chien trottine sans but ...");
        state.currentPosture = DogPosture.WALKING;
        state.tailState = TailState.RELAXED_DOWN;
        state.currentSpeed = 3; // km/h

        state.currentHeartRate = 70 + (Math.random() * 10);
        state.energyLevel = clamp(state.energyLevel - 0.05, 0, 1); // Ça fatigue un peu
        state.boredomLevel = clamp(state.boredomLevel + 0.05, 0, 1); // L'ennui monte
    }
}