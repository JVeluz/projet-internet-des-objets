import ICalibratable from "../interfaces/ICalibratable";
import ISensor from "../interfaces/ISensor";
import SimulationState from "../models/SimulationState";

export default class TailSensor implements ISensor, ICalibratable {
    id = "dog/sensors/tail";

    private sensitivity: number = 1.0;
    private maxJoyHz: number = 5.0;
    private happyThresholdHz: number = 2.0;

    calibrate(config: Record<string, any>): void {
        if (config.sensitivity) this.sensitivity = config.sensitivity;
        if (config.max_joy_hz) this.maxJoyHz = config.max_joy_hz;
        if (config.happy_threshold) this.happyThresholdHz = config.happy_threshold;

        console.log(`🔧 [Tail] Calibration : MaxJoy=${this.maxJoyHz}Hz | Seuil Bonheur=${this.happyThresholdHz}Hz`);
    }

    read(state: SimulationState) {
        let baseHz = 0;

        if (!state.is_sleeping) {
            baseHz = (state.fun / 100) * this.maxJoyHz
        }

        const noise = Math.random() * 0.2;
        const finalHz = (baseHz * this.sensitivity) + noise;

        const isHappy = finalHz >= this.happyThresholdHz;
        const isSad = !isHappy && finalHz < 1.0;

        return {
            frequency_hz: parseFloat(finalHz.toFixed(1)),
            is_happy: isHappy,
            is_sad: isSad
        };
    }
}