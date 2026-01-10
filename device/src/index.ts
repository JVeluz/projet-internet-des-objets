import IAction from "./domain/actions/IAction";
import IEvent from "./domain/events/IEvent";
import { DogSimulator } from "./domain/logic/DogSimulator";
import UtilityBrain from "./domain/logic/UtilityBrain";
import ISensor from "./domain/sensors/ISensor";
import MqttClient from "./infrastructure/mqtt/mqttClient";
import { loadInstances } from "./loader";

const CLOCK = 5000; // 5 secondes par cycle de simulation

async function main() {
    console.clear();
    console.log("🟢 Démarrage du système Cyber-Chien...");

    const [dogActions, worldEvents, dogSensors] = await Promise.all([
        loadInstances<IAction>('domain/actions'),
        loadInstances<IEvent>('domain/events'),
        loadInstances<ISensor>('domain/sensors')
    ]);

    const dogBrain = new UtilityBrain(dogActions);

    const mqttClient = new MqttClient("UPPA/jveluz");

    const cyberDog = new DogSimulator(dogBrain, dogSensors, worldEvents, mqttClient);

    console.log(`⏱️  Horloge réglée sur ${CLOCK}ms. Lancement de la boucle...`);
    console.log("---------------------------------------------------------------");

    cyberDog.tick();

    setInterval(() => cyberDog.tick(), CLOCK);
}

main().catch(console.error);