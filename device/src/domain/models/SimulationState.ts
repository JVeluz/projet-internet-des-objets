import { VisualStimulus } from "../enums";

export default class SimulationState {
    bladder: number = 0;
    hunger: number = 0;
    energy: number = 100;
    fun: number = 50;
    is_sleeping: boolean = false;
    lastSleepTimestamp: number = Date.now();
    bodyTemperature: number = 38.5;
    currentHeartBeat: number = 70;
    currentVisualStimulus: VisualStimulus = VisualStimulus.NONE;
}