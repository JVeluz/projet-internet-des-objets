import SimulationState from "../models/SimulationState";

export default interface ISensor {
    id: string;
    /**
     * Capture une métrique
     * @param state L'état acctuel
     */
    read(state: SimulationState): Object
}