import type { SensorPayload } from "../interfaces/SensorPayload";

type Callback = (data: SensorPayload) => void;

const URL: string = "ws://127.0.0.1:1880/ws/sensors";

export class SensorRepository {

    private static instance: SensorRepository | null = null;
    private socket: WebSocket | null = null;
    private subscribers: Callback[] = [];

    public static getInstance(): SensorRepository {
        if (!SensorRepository.instance) {
            SensorRepository.instance = new SensorRepository();
        }
        return SensorRepository.instance;
    }

    private constructor() {
        this.connect();
    }

    private connect() {
        console.log(`🔌 Connexion au WebSocket ${URL}...`);
        this.socket = new WebSocket(URL);

        this.socket.onmessage = (event) => {
            try {
                const rawData = JSON.parse(event.data);
                this.notify(rawData);
            } catch (e) {
                console.error("❌ Erreur de parsing JSON dans SensorRepository", e);
            }
        };

        this.socket.onopen = () => console.log("✅ WebSocket connecté !");

        this.socket.onclose = () => {
            console.warn("⚠️ WebSocket coupé. Reconnexion dans 3s...");
            setTimeout(() => this.connect(), 3000);
        };
    }

    public subscribe(callback: Callback) {
        this.subscribers.push(callback);
    }

    private notify(data: SensorPayload) {
        this.subscribers.forEach(callback => callback(data));
    }
}