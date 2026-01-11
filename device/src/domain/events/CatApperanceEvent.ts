import { VisualStimulus } from "../enums";
import SimulationState from "../models/SimulationState";
import IEvent from "../interfaces/IEvent";

export class CatAppearanceEvent implements IEvent {
    name = "Apparition Chat";

    shouldOccur(state: SimulationState): boolean {
        return Math.random() < 0.05;
    }

    execute(state: SimulationState): void {
        console.log("🐱 ÉVÉNEMENT : Un chat traverse le jardin !");

        state.currentVisualStimulus = VisualStimulus.CAT;

        state.fun = 100;
        state.currentHeartBeat = 140;
    }
}