import mqtt from "mqtt";
import IMqttClient from "../../domain/ports/mqtt/IMqttClient";

export default class MqttClient implements IMqttClient {
    private client;
    private connected: boolean = false;
    private brokerUrl: string;
    private rootTopic: string;

    /**
     * @param brokerUrl L'URL du broker (ex: "mqtt://test.mosquitto.org")
     */
    constructor(rootTopic: string, brokerUrl: string = "mqtt://test.mosquitto.org") {
        this.brokerUrl = brokerUrl;
        this.rootTopic = rootTopic;
        this.client = mqtt.connect(this.brokerUrl);
        this.setupListeners();
    }

    /**
     * Implémentation de la méthode de l'interface.
     * Convertit automatiquement l'objet en JSON string.
     */
    publish(topic: string, payload: any): void {
        const completeTopic: string = this.rootTopic + "/" + topic
        if (!this.connected) {
            console.warn(`⚠️ [MQTT] Non connecté. Impossible d'envoyer sur ${completeTopic}`);
            return;
        }
        try {
            const message = JSON.stringify(payload);
            this.client.publish(completeTopic, message, (error: any) => {
                if (error) {
                    console.error(`❌ [MQTT] Erreur d'envoi sur ${completeTopic}:`, error);
                }
                else {
                    console.log(`🚀 [MQTT] Sent -> ${completeTopic}`);
                }
            });
        } catch (error) {
            console.error("❌ [MQTT] Erreur JSON:", error);
        }
    }

    /**
     * Gestion interne des événements de la librairie MQTT
     */
    private setupListeners(): void {
        this.client.on("connect", () => {
            console.log(`✅ [MQTT] Connecté avec succès au broker: ${this.brokerUrl}`);
            this.connected = true;
        });

        this.client.on("error", (error: any) => {
            console.error("❌ [MQTT] Erreur de connexion:", error);
            this.connected = false;
        });

        this.client.on("reconnect", () => {
            console.log("🔄 [MQTT] Tentative de reconnexion...");
        });
    }
}