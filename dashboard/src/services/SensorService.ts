import { SensorRepository } from "../data/SensorRepository";
import type { SensorPayload } from "../interfaces/SensorPayload";

export const SafetyStatus = {
    NORMAL: 'NORMAL',
    WARNING: 'WARNING',
    CRITICAL: 'CRITICAL'
} as const;

export type SafetyStatus = typeof SafetyStatus[keyof typeof SafetyStatus];

export interface SensorData {
    deviceId?: string;
    timestamp?: Date;
    metrics?: {
        stress?: number;
        heart_rate?: number;
        battery?: number;
    };
    advice?: string;
    status: SafetyStatus;
}

type Callback = (data: SensorData) => void;

export class SensorService {
    private sensorRepository = SensorRepository.getInstance();
    private subscribers: Callback[] = [];

    constructor(sensorRepository?: SensorRepository) {
        if (sensorRepository) this.sensorRepository = sensorRepository;

        this.sensorRepository.subscribe((rawData) => {
            const processedData = this.process(rawData);
            this.notify(processedData);
        });
    }

    private process(raw: SensorPayload): SensorData {
        const stress: number | undefined = raw.metrics?.stress;

        let status: SafetyStatus = SafetyStatus.NORMAL;
        if (stress) {
            if (stress > 80) {
                status = SafetyStatus.CRITICAL;
            } else if (stress > 50) {
                status = SafetyStatus.WARNING;
            }
        }

        return {
            deviceId: raw.deviceId,
            timestamp: raw.timestamp ? new Date(raw.timestamp) : undefined,
            metrics: {
                stress: stress,
                heart_rate: raw.metrics?.heart_rate,
                battery: raw.metrics?.battery
            },
            status: status,
            advice: raw.ai_advice
        };
    }

    public onStatusChange(callback: Callback) {
        this.subscribers.push(callback);
    }

    private notify(data: SensorData) {
        this.subscribers.forEach(callback => callback(data));
    }
}