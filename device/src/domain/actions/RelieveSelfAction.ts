import SimulationState from "../models/SimulationState";
import IAction from "../interfaces/IAction";

export class RelieveSelfAction implements IAction {
    name = "Besoins Naturels";

    calculateUtility(state: SimulationState): number {
        if (state.is_sleeping) return 0.0;

        const urgency = state.bladder / 100;
        // on s'en fiche à 50%, mais à 90% c'est la panique
        return Math.pow(urgency, 4);
    }

    execute(state: SimulationState): void {
        console.log("💩 Le chien se soulage...");
        state.bladder = 0;
    }
}