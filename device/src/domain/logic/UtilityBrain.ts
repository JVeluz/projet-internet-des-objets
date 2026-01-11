import IAction from "../interfaces/IAction";
import SimulationState from "../models/SimulationState";

export default class UtilityBrain {
    private actions: IAction[];

    constructor(actions: IAction[]) {
        this.actions = actions;
    }

    public decide(state: SimulationState): IAction {
        const scoredActions = this.actions.map(action => {
            return {
                action: action,
                score: action.calculateUtility(state)
            };
        });

        this.logThoughtProcess(scoredActions);

        return this.select(scoredActions);
    }

    /**
     * Sélectionne une action basée sur une probabilité proportionnelle à son score.
     */
    private select(scoredActions: { action: IAction, score: number }[]): IAction {
        const candidates = scoredActions.filter(item => item.score > 0);
        if (candidates.length === 0) {
            return this.actions[0];
        }

        const totalScore = candidates.reduce((sum, item) => sum + item.score, 0);

        let randomValue = Math.random() * totalScore;

        for (const item of candidates) {
            randomValue -= item.score;
            if (randomValue <= 0) {
                return item.action;
            }
        }
        throw Error('');
    }

    private selectBestScore(scoredActions: { action: IAction, score: number }[]): IAction {
        let best = scoredActions[0];
        for (const item of scoredActions) {
            if (item.score > best.score) {
                best = item;
            }
        }
        return best.action;
    }

    private logThoughtProcess(scoredActions: { action: IAction, score: number }[]) {
        const sorted = [...scoredActions].sort((a, b) => b.score - a.score);
        console.log("--- Cerveau du Chien ---");
        sorted.forEach(item => {
            const bar = "█".repeat(Math.round(item.score * 10));
            console.log(`${item.action.name.padEnd(15)} : [${bar.padEnd(10)}] ${item.score.toFixed(2)}`);
        });
    }
}