import SimulationState from "../models/SimulationState";
import IEvent from "../interfaces/IEvent";

export class ThunderstormEndsEvent implements IEvent {
    name = "Fin de l'Orage";

    shouldOccur(state: SimulationState): boolean {
        // 10% de chance à chaque tick que l'orage s'arrête
        return Math.random() < 0.10;
    }

    execute(state: SimulationState): void {
        console.log("🌤️ ÉVÉNEMENT : Le ciel s'éclaircit, l'orage est fini.");

        state.fun = Math.min(100, state.fun + 40);
        state.currentHeartBeat = Math.max(70, state.currentHeartBeat - 50);
    }
}