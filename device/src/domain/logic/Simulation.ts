import { VisualStimulus } from "../enums";
import IEvent from "../interfaces/IEvent";
import SimulationState from "../models/SimulationState";
import ISensor from "../interfaces/ISensor";
import UtilityBrain from "./UtilityBrain";
import IMqttClient from "../ports/IMqttClient";
import ICalibratable from "../interfaces/ICalibratable";

export default class Simulation {
    private state: SimulationState;
    private dogBrain: UtilityBrain;
    private dogSensors: ISensor[];
    private worldEvents: IEvent[];
    private mqttClient: IMqttClient;
    private tickCounter: number = 0;

    constructor(dogBrain: UtilityBrain, dogSensors: ISensor[], worldEvents: IEvent[], mqttClient: IMqttClient) {
        this.state = new SimulationState();
        this.dogBrain = dogBrain;
        this.dogSensors = dogSensors;
        this.worldEvents = worldEvents;
        this.mqttClient = mqttClient;
        this.setupCalibration();
    }

    private setupCalibration() {
        const TARGET_TOPIC = "dog/config/calibration";
        this.mqttClient.subscribe(TARGET_TOPIC);
        this.mqttClient.onMessage((topic, payload) => {
            if (topic.trim() === TARGET_TOPIC) {
                console.log(`🔧 Calibration reçue pour ${payload.sensor_id}`);
                this.dispatchCalibration(payload);
            }
        });
    }

    private dispatchCalibration(payload: any) {
        const targetSensor = this.dogSensors.find(s => s.id === payload.sensor_id);
        if (targetSensor && this.isCalibratable(targetSensor)) {
            targetSensor.calibrate(payload.settings);
        }
    }

    private isCalibratable(sensor: any): sensor is ICalibratable {
        return typeof sensor.calibrate === 'function';
    }

    public tick() {
        this.tickCounter++;

        console.log(`\n--- TICK #${this.tickCounter} ---`);

        this.applyEntropy();
        this.processEvents();

        this.logStatus();

        const action = this.dogBrain.decide(this.state);
        console.log(`🧠 DÉCISION : [ ${action.name.toUpperCase()} ]`);

        action.execute(this.state);

        this.publishSensorData();
    }

    private applyEntropy() {
        this.state.hunger = Math.min(100, this.state.hunger + .5);
        this.state.bladder = Math.min(100, this.state.bladder + .5);
        this.state.energy = Math.max(0, this.state.energy - .5);
        this.state.fun = Math.max(0, this.state.fun - 1);

        if (this.state.is_sleeping) {
            this.state.fun = Math.min(100, this.state.fun + 0.8);
        }

        const targetTemp = 38.5;
        const targetHeart = 70;
        this.state.bodyTemperature += (targetTemp - this.state.bodyTemperature) * 0.1;
        this.state.currentHeartBeat += (targetHeart - this.state.currentHeartBeat) * 0.1;
    }

    private processEvents() {
        for (const event of this.worldEvents) {
            if (event.shouldOccur(this.state)) {
                event.execute(this.state);
            }
        }
    }

    private publishSensorData() {
        this.dogSensors.forEach(sensor => {
            const data = sensor.read(this.state);
            this.mqttClient.publish(sensor.id, data);
        });
    }

    private logStatus() {
        const bar = (val: number, max: number = 100) => {
            const size = 10;
            const filled = Math.round((val / max) * size);
            const empty = size - filled;
            return `[${'█'.repeat(filled)}${' '.repeat(empty)}] ${Math.round(val)}%`;
        };

        console.log(`🍖 Faim   : ${bar(this.state.hunger)}`);
        console.log(`💧 Vessie : ${bar(this.state.bladder)}`);
        console.log(`⚡ Énergie : ${bar(this.state.energy)}`);
        console.log(`🎉 Fun    : ${bar(this.state.fun)}`);
        console.log(`💓 Cardio : ${Math.round(this.state.currentHeartBeat)} BPM | ${this.state.bodyTemperature.toFixed(1)}°C`);
    }
}