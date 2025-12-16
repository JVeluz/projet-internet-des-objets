export const SafetyStatus = {
    NORMAL: 'NORMAL',
    WARNING: 'WARNING',
    CRITICAL: 'CRITICAL'
} as const;

export type SafetyStatus = typeof SafetyStatus[keyof typeof SafetyStatus];

export interface SensorPayload {
    deviceId: string;
    timestamp?: string;
    metrics: {
        stress: number;
        heart_rate: number;
        battery: number;
    };
    status: SafetyStatus;
}

export interface SensorData {
    status: SafetyStatus;
    metrics?: { stress: number; heart_rate: number; battery: number; };
    deviceId?: string;
    timestamp?: Date;
}