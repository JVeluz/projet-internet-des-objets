export interface HeartData {
    bpm: number;
    temperature_c: number;
    alert_tachycardia: boolean;
    alert_fever: boolean;
}

export interface BladderData {
    pressure_pa: number;
    estimated_fill_pct: number;
    urgent: boolean;
}

export interface TailData {
    frequency_hz: number;
    is_happy: boolean;
}

export interface VisionData {
    detected_object: string;
    confidence?: number;
}

export interface BrainData {
    neural_activity_hz: number;
    is_sleeping: boolean;
    last_sleep_ts?: number;
    sleep_deprivation_minutes?: number;
}

export interface GastricData {
    stomach_volume_ml: number;
    capacity_max: number;
    is_hungry: boolean;
}

export interface DogGlobalState {
    heart: HeartData;
    bladder: BladderData;
    tail: TailData;
    vision: VisionData;
    brain: BrainData;
    gastric: GastricData;
    thought?: string;
}