export default interface ICalibratable {
    /**
     * @param config Un objet JSON contenant les clés/valeurs à mettre à jour
     */
    calibrate(config: Record<string, any>): void;
}