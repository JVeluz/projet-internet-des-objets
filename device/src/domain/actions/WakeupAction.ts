import IAction from "../interfaces/IAction";
import SimulationState from "../models/SimulationState";

export class WakeupAction implements IAction {
    name = "Se Réveiller";

    calculateUtility(state: SimulationState): number {
        if (!state.is_sleeping) {
            return 0.0;
        }
        return 0.1;
    }

    execute(state: SimulationState): void {
        console.log("🌅 Le chien s'étire, baille et se réveille...");

        state.is_sleeping = false;
        state.currentHeartBeat = 75;
        state.bodyTemperature += 0.2;
    }
}