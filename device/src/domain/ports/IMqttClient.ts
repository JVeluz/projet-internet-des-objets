export default interface IMqttClient {
    /**
     * Envoie un message sur un topic
     */
    publish(topic: string, payload: any): void;

    /**
     * S'abonne à un topic pour recevoir les messages
     */
    subscribe(topic: string): void;

    /**
     * Définit la fonction à exécuter quand un message arrive
     */
    onMessage(callback: (topic: string, message: any) => void): void;
}