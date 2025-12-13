import mqtt from "mqtt";

const CLOCK: number = 2000;
const TOPIC: string = "uppa/jveluz/test";

const client = mqtt.connect("mqtt://test.mosquitto.org");

client.on("connect", () => {
    console.log("✅ Connecté au broker MQTT");
    setInterval(main, CLOCK);
});

client.on("error", (error) => {
    console.error("❌ Erreur de connexion:", error);
});

async function main() {
    const payload = { value: 30 };
    const message: string = JSON.stringify(payload);
    client.publish(TOPIC, message, () => { });
}