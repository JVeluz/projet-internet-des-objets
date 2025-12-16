import { WS_SENSORS_URL } from "../config";
import { SocketClient } from "../data/SocketClient";
import { Observable } from "../data/Observable";
import { SafetyStatus, type SensorData, type SensorPayload } from "../interfaces/sensor";

export class SensorRepository extends Observable<SensorData> {

    private socket = new SocketClient<SensorPayload>(WS_SENSORS_URL);

    private state: SensorData = {
        status: SafetyStatus.NORMAL,
        metrics: { stress: 0, heart_rate: 0, battery: 0 },
        deviceId: "---"
    };

    constructor() {
        super();
        this.socket.subscribe((payload) => {
            this.state.deviceId = payload.deviceId;
            this.state.timestamp = payload.timestamp ? new Date(payload.timestamp) : new Date();
            if (payload.metrics) {
                this.state.metrics = payload.metrics;
            }
            this.state.status = payload.status || SafetyStatus.NORMAL;
            this.notify({ ...this.state });
        });
    }
}