import { WS_AI_URL } from "../config";
import { Observable } from "./Observable";
import { SocketClient } from "./SocketClient";

interface AIPayload {
    advice: string;
}

export class AIRepository extends Observable<string> {

    private socket = new SocketClient<AIPayload>(WS_AI_URL);

    private lastAdvice: string | null = null;

    constructor() {
        super();
        this.socket.subscribe((payload) => {
            const cleanAdvice = payload.advice;
            this.lastAdvice = cleanAdvice;
            this.notify(cleanAdvice);
        });
    }

    public getLastAdvice(): string | null {
        return this.lastAdvice;
    }
}