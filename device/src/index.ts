import mqtt from "mqtt";

const CLOCK: number = 2000;
const TOPIC: string = "uppa/jveluz/test";
const BROKER: string = "mqtt://test.mosquitto.org";

let currentBattery = 100;

interface Payload {
    deviceId: string;
    timestamp: string;
    metrics: {
        stress: number;
        heart_rate: number;
        battery: number;
    }
}

console.log("-----------------------------------------");
console.log("   🚀 Démarrage du Casque Simulé IoT");
console.log("-----------------------------------------");

const client = mqtt.connect(BROKER);

client.on("connect", () => {
    console.log(`✅ Connecté au broker: ${BROKER}`);
    console.log(`📡 Publication sur le topic: ${TOPIC}`);
    setInterval(main, CLOCK);
});

client.on("error", (error: any) => {
    console.error("❌ Erreur de connexion MQTT:", error);
});

function generateData(): Payload {
    const now = Date.now();
    const timeStep = now / 1000;

    // Oscille entre 30 et 70, avec des pics aléatoires
    let stress = 50 + Math.sin(timeStep) * 20 + (Math.random() - 0.5) * 10;

    // Scénario : Toutes les 30 secondes, on génère un pic de stress CRITIQUE (>80)
    if (Math.floor(timeStep) % 30 >= 25) {
        stress += 40;
    }

    // On borne entre 0 et 100
    stress = Math.max(0, Math.min(100, Math.round(stress)));

    // Simulation bpm (Lié au stress + variation)
    const bpm = Math.round(60 + (stress * 0.5) + (Math.random() * 10));

    // Simulation batterie
    currentBattery = Math.max(0, currentBattery - 0.02); // Perd 0.02% par cycle

    return {
        deviceId: "simulated-helmet-01",
        timestamp: new Date().toISOString(),
        metrics: {
            stress: stress,
            heart_rate: bpm,
            battery: parseFloat(currentBattery.toFixed(1)) // Garde 1 décimale
        }
    };
}

async function main() {
    const payload = generateData();
    const message: string = JSON.stringify(payload);

    client.publish(TOPIC, message, (error: any) => {
        if (error) {
            console.error("Erreur de publication:", error);
            return;
        }
        const stress = payload.metrics.stress;
        const icon = stress > 80 ? '🔴' : (stress > 50 ? '🟠' : '🟢');
        console.log(`[📤 ENVOI] ${icon} Stress: ${stress}% | ❤️ BPM: ${payload.metrics.heart_rate} | 🔋 Bat: ${payload.metrics.battery}%`);
    });
}