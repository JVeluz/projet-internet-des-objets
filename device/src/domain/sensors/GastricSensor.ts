import ICalibratable from "../interfaces/ICalibratable";
import ISensor from "../interfaces/ISensor";
import SimulationState from "../models/SimulationState";

export default class GastricSensor implements ISensor, ICalibratable {
    id = "dog/sensors/gastric";

    private stomachCapacityMl: number = 500;

    calibrate(config: Record<string, any>): void {
        if (config.stomach_capacity) this.stomachCapacityMl = config.stomach_capacity;
        console.log(`🔧 [Gastric] Calibration : Capacité ${this.stomachCapacityMl}mL`);
    }

    read(state: SimulationState) {
        const hungerRatio = state.hunger / 100;
        const fillRatio = 1.0 - hungerRatio;

        const currentVolumeMl = fillRatio * this.stomachCapacityMl;

        const noise = (Math.random() * 10) - 5;

        return {
            stomach_volume_ml: Math.max(0, Math.round(currentVolumeMl + noise)),
            capacity_max: this.stomachCapacityMl,
            is_hungry: fillRatio < 0.2
        };
    }
}