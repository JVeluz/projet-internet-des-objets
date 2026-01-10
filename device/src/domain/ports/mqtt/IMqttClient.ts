export default interface IMqttClient {
    publish(topic: string, payload: any): void;
}