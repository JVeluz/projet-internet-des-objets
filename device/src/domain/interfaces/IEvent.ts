import SimulationState from "../models/SimulationState";

export default interface IEvent {
    name: string;

    /**
     * Détermine si l'événement se produit à ce tick.
     */
    shouldOccur(state: SimulationState): boolean;

    /**
     * Applique les conséquences de l'événement sur l'environnement ou le chien.
     */
    execute(state: SimulationState): void;
}