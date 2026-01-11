import { WS_SENSORS_URL } from "../config";
import { SocketClient } from "../data/SocketClient";
import { Observable } from "../data/Observable";
import type { DogGlobalState } from "../interfaces/sensor";

const INITIAL_STATE: DogGlobalState = {
    heart: { bpm: 0, temperature_c: 0, alert_tachycardia: false, alert_fever: false },
    bladder: { pressure_pa: 0, estimated_fill_pct: 0, urgent: false },
    tail: { frequency_hz: 0, axis_data: { x: 0, y: 0, z: 0 } },
    vision: { detected_object: "WAITING..." }
};

export class SensorRepository extends Observable<DogGlobalState> {

    private socket = new SocketClient<DogGlobalState>(WS_SENSORS_URL);

    private state: DogGlobalState = INITIAL_STATE;

    constructor() {
        super();

        this.socket.subscribe((payload) => {
            console.log(payload);
            this.state = { ...this.state, ...payload };
            this.notify(this.state);
        });
    }

    public calibrateSensor(sensorId: string, settings: Record<string, number>) {
        const payload = {
            type: 'CALIBRATION',
            sensor_id: sensorId,
            settings: settings
        };

        this.socket.send(payload);
    }

    public getCurrentState(): DogGlobalState {
        return this.state;
    }
}