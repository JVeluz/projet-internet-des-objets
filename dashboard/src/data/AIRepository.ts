import { WS_AI_URL } from "../config";
import { Observable } from "./Observable";
import { SocketClient } from "./SocketClient";

export interface AIPayload {
    advice: string;
}

export class AIRepository extends Observable<string> {

    private socket = new SocketClient<AIPayload>(WS_AI_URL);

    private lastAdvice: string | null = "En attente d'analyse neurale...";

    constructor() {
        super();
        this.socket.subscribe((payload) => {
            if (payload && payload.advice) {
                const cleanAdvice = payload.advice;
                this.lastAdvice = cleanAdvice;
                this.notify(cleanAdvice);
            }
        });
    }

    public getLastAdvice(): string | null {
        return this.lastAdvice;
    }
}