import { VisualStimulus } from "../enums";
import IEvent from "../events/IEvent";
import SimulationState from "../models/SimulationState";
import IMqttClient from "../ports/mqtt/IMqttClient";
import ISensor from "../sensors/ISensor";
import UtilityBrain from "./UtilityBrain";

export class DogSimulator {
    private state: SimulationState;
    private brain: UtilityBrain;
    private sensors: ISensor[];
    private events: IEvent[];
    private mqttClient: IMqttClient;
    private tickCounter: number = 0;

    /**
     * @param brain L'instance du cerveau chargée de prendre les décisions
     * @param sensors La liste des capteurs connectés au chien
     * @param events La liste des événements possibles dans cet univers
     */
    constructor(brain: UtilityBrain, sensors: ISensor[], events: IEvent[], mqttClient: IMqttClient) {
        this.state = new SimulationState();
        this.brain = brain;
        this.sensors = sensors;
        this.events = events;
        this.mqttClient = mqttClient;
    }

    /**
     * Fait avancer la simulation d'un pas de temps (Tick).
     */
    public tick() {
        this.tickCounter++;
        console.log(`\n===============================================================`);
        console.log(`⏱️  TICK #${this.tickCounter} | Heure Simulée: ${this.getFormattedTime()}`);
        console.log(`===============================================================`);

        // Appliquer l'usure naturelle du corps (Faim, Vessie, Ennui)
        this.applyEntropy();
        // Vérifier si des événements externes se produisent (Facteur, Chat, Orage)
        this.processEvents();

        // Affichage de l'état perçu avant la décision
        this.logContext();
        // Le chien analyse son état et choisit quoi faire.
        const selectedAction = this.brain.decide(this.state);

        console.log(`\n🧠 DÉCISION : LE CHIEN CHOISIT DE -> [ ${selectedAction.name.toUpperCase()} ]`);

        // L'action modifie l'état réel (BPM monte, Faim baisse, etc.)
        selectedAction.execute(this.state);

        console.log(`\n📡 ENVOI DES DONNÉES CAPTEURS (MQTT) :`);
        this.sensors.forEach(sensor => {
            const data = sensor.read(this.state);
            this.mqttClient.publish(sensor.id, data);
        });

        this.logStatusSummary();
    }

    /**
     * Gère les événements aléatoires définis dans l'index.
     */
    private processEvents() {
        this.state.currentVisualStimulus = VisualStimulus.NONE;

        let eventOccurred = false;

        for (const event of this.events) {
            if (event.shouldOccur(this.state)) {
                event.execute(this.state);
                eventOccurred = true;
            }
        }
    }

    /**
     * Simule le passage du temps sur le métabolisme passif.
     */
    private applyEntropy() {
        // La faim monte lentement
        this.state.satietyLevel = Math.max(0, this.state.satietyLevel - 0.02);
        // La vessie se remplit
        this.state.bladderFillLevel = Math.min(1, this.state.bladderFillLevel + 0.04);
        // L'ennui monte si on ne fait rien
        this.state.boredomLevel = Math.min(1, this.state.boredomLevel + 0.05);
        // Récupération naturelle ou dégradation légère du stress
        if (this.state.stressLevel > 0) {
            this.state.stressLevel = Math.max(0, this.state.stressLevel - 0.01);
        }
    }

    private logContext() {
        console.log(`📊 État Interne : ` +
            `Faim: ${(1 - this.state.satietyLevel).toFixed(2)} | ` +
            `Vessie: ${this.state.bladderFillLevel.toFixed(2)} | ` +
            `Energy: ${this.state.energyLevel.toFixed(2)} | ` +
            `Stress: ${this.state.stressLevel.toFixed(2)} | ` +
            `Vue: ${this.state.currentVisualStimulus}`
        );
    }

    private logStatusSummary() {
        console.log(`\nMagistral State Update:`);
        console.log(`   ❤️  BPM: ${this.state.currentHeartRate.toFixed(0)}`);
        console.log(`   🌡️  Temp: ${this.state.bodyTemperature.toFixed(1)}°C`);
        console.log(`   🐕 Posture: ${this.state.currentPosture}`);
    }

    private getFormattedTime(): string {
        // Simule une horloge qui avance : 1 tick = 10 minutes
        // Départ arbitraire à 08:00 du matin + les ticks
        const startHour = 8;
        const totalMinutes = (startHour * 60) + (this.tickCounter * 10);

        const hours = Math.floor(totalMinutes / 60) % 24;
        const minutes = totalMinutes % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
}