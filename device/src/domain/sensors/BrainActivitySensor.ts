import ISensor from "../interfaces/ISensor";
import SimulationState from "../models/SimulationState";

export default class BrainActivitySensor implements ISensor {
    id = "dog/sensors/brain";

    read(state: SimulationState) {
        let hz = 0;

        if (state.is_sleeping) {
            hz = 2 + Math.random();
        } else {
            const funBoost = (state.fun / 100) * 10;
            hz = 10 + funBoost + (Math.random() * 2);
        }

        const minutesSinceLastSleep = Math.floor((Date.now() - state.lastSleepTimestamp) / 60000);

        return {
            neural_activity_hz: parseFloat(hz.toFixed(1)),
            is_sleeping: state.is_sleeping,
            last_sleep_ts: state.lastSleepTimestamp,
            // Optionnel : Une métrique de "dette de sommeil" calculée ici
            sleep_deprivation_minutes: minutesSinceLastSleep
        };
    }
}