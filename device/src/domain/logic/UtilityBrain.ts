import IAction from "../actions/IAction";
import SimulationState from "../models/SimulationState";

export default class UtilityBrain {
    private actions: IAction[];

    constructor(availableActions: IAction[]) {
        this.actions = availableActions;
    }

    /**
     * Le cœur du système : Analyse l'état et retourne l'action choisie.
     */
    public decide(state: SimulationState): IAction {
        // 1. Calculer les scores pour toutes les actions disponibles
        const scoredActions = this.actions.map(action => {
            return {
                action: action,
                score: action.calculateUtility(state)
            };
        });

        // (Optionnel) Log pour le débogage : voir ce que le chien "pense"
        this.logThoughtProcess(scoredActions);

        // 2. Sélectionner l'action gagnante
        // Vous avez deux choix ici : "Winner Takes All" ou "Probabiliste"
        // Selon votre demande, voici la version Probabiliste (Roulette Wheel)
        return this.selectProbabilistic(scoredActions);
    }

    /**
     * Sélectionne une action basée sur une probabilité proportionnelle à son score.
     * Ex: Action A (0.8) a 4x plus de chance d'être prise que Action B (0.2).
     */
    private selectProbabilistic(scoredActions: { action: IAction, score: number }[]): IAction {
        // Filtrer les actions avec un score de 0 (impossible à faire)
        const candidates = scoredActions.filter(item => item.score > 0);

        // Cas limite : Si aucune action n'a de score (le chien est comateux ?)
        // On retourne la première action de la liste (souvent Idle) par défaut
        if (candidates.length === 0) {
            return this.actions[0];
        }

        // Somme totale des scores pour la normalisation
        const totalScore = candidates.reduce((sum, item) => sum + item.score, 0);

        // Tirer un nombre aléatoire entre 0 et le Total
        let randomValue = Math.random() * totalScore;

        // Algorithme de la "Roulette"
        for (const item of candidates) {
            randomValue -= item.score;
            if (randomValue <= 0) {
                return item.action;
            }
        }

        // Fallback de sécurité (ne devrait théoriquement jamais être atteint)
        return candidates[candidates.length - 1].action;
    }

    /**
     * Alternative : Sélectionne simplement l'action avec le score le plus haut.
     * Utile si vous trouvez que le chien fait trop de choix "bizarres".
     */
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
        // Trie pour l'affichage uniquement
        const sorted = [...scoredActions].sort((a, b) => b.score - a.score);
        console.log("--- Cerveau du Chien ---");
        sorted.forEach(item => {
            const bar = "█".repeat(Math.round(item.score * 10));
            console.log(`${item.action.name.padEnd(15)} : [${bar.padEnd(10)}] ${item.score.toFixed(2)}`);
            // if (item.score > 0.05) { // N'affiche que les pensées pertinentes
            // }
        });
    }
}