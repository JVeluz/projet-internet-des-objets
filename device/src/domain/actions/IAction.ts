import SimulationState from "../models/SimulationState";

export default interface IAction {
    name: string;
    /**
     * Calcule le score de désir (0.0 à 1.0)
     * @param state L'état actuel du chien
     */
    calculateUtility(state: SimulationState): number;

    /**
     * Applique les effets de l'action sur le corps
     * @param state L'état à modifier
     */
    execute(state: SimulationState): void;
}

// Petit helper pour garder les valeurs entre 0 et 1
const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

export { clamp }