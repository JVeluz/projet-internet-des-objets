import { Observable } from "./Observable";

export class SocketClient<T> extends Observable<T> {
    private socket: WebSocket | null = null;
    private url: string;

    constructor(url: string) {
        super();
        this.url = url;
        this.connect();
    }

    private connect() {
        this.socket = new WebSocket(this.url);
        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data) as T;
                this.notify(data);
            } catch (e) {
                console.error(`Erreur parsing ${this.url}`, e);
            }
        };
        this.socket.onclose = () => setTimeout(() => this.connect(), 3000);
    }

    public send(data: any): void {
        if (!this.socket) return;
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
            console.log("📤 [WS] Envoi :", data);
        } else {
            console.warn("⚠️ [WS] Socket non connecté, envoi impossible.");
        }
    }
}