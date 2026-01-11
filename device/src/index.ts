import { loadInstances } from "./utils/Loader";
import IAction from "./domain/interfaces/IAction";
import IEvent from "./domain/interfaces/IEvent";
import ISensor from "./domain/interfaces/ISensor";
import Simulation from "./domain/logic/Simulation";
import UtilityBrain from "./domain/logic/UtilityBrain";
import MqttClient from "./infrastructure/MqttClient";

const CLOCK: number = 5000;

async function main() {
    console.clear();
    console.log("🟢 Démarrage du système Cyber-Chien...");

    const [dogActions, worldEvents, dogSensors] = await Promise.all([
        loadInstances<IAction>('domain/actions'),
        loadInstances<IEvent>('domain/events'),
        loadInstances<ISensor>('domain/sensors')
    ]);

    const mqttClient = new MqttClient("uppa/jveluz");
    const dogBrain = new UtilityBrain(dogActions);
    const simulation = new Simulation(dogBrain, dogSensors, worldEvents, mqttClient);

    console.log(`⏱️  Horloge réglée sur ${CLOCK}ms. Lancement de la boucle...`);
    console.log("---------------------------------------------------------------");

    simulation.tick();
    setInterval(() => simulation.tick(), CLOCK);
}

main().catch(console.error); 