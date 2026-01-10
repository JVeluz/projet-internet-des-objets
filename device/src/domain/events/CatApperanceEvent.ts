import { DogPosture, VisualStimulus } from "../enums";
import SimulationState from "../models/SimulationState";
import IEvent from "./IEvent";

export class CatAppearanceEvent implements IEvent {
    name = "Apparition Chat";

    shouldOccur(state: SimulationState): boolean {
        // 5% de chance par tick, mais seulement si le chien ne dort pas
        if (state.currentPosture === DogPosture.SLEEPING) return false;
        return Math.random() < 0.05;
    }

    execute(state: SimulationState): void {
        console.log("👀 ÉVÉNEMENT : Un chat traverse le jardin !");
        state.currentVisualStimulus = VisualStimulus.CAT;
        state.excitementLevel = 1.0; // Max excitation
        state.currentHeartRate += 20; // Sursaut cardiaque
    }
}