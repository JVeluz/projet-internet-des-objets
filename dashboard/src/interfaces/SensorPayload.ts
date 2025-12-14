export interface SensorPayload {
    deviceId?: string;
    timestamp?: string;
    metrics?: {
        stress?: number;
        heart_rate?: number;
        battery?: number;
    };
    // Optionnel : si tu envoies des conseils IA plus tard
    ai_advice?: string;
}