import { DogPosture, TailState, VisualStimulus } from "../enums";

export default class SimulationState {
    // ==========================================
    // 1. PHYSIOLOGIE (BESOINS VITAUX)
    // Ces variables pilotent les actions de survie
    // ==========================================

    /** Niveau d'énergie global (0.0 = épuisé, 1.0 = pleine forme) */
    energyLevel: number = 1.0;
    /** Remplissage de l'estomac (0.0 = affamé, 1.0 = plein) */
    satietyLevel: number = 0.5;
    /** Hydratation (0.0 = déshydraté, 1.0 = hydraté) */
    hydrationLevel: number = 0.8;
    /** Remplissage de la vessie (0.0 = vide, 1.0 = urgence absolue) */
    bladderFillLevel: number = 0.0;
    /** Pression intestinale (0.0 = vide, 1.0 = urgence) */
    bowelPressure: number = 0.0;
    /** Température corporelle réelle en Celsius (ex: 38.5) */
    bodyTemperature: number = 38.5;

    // ==========================================
    // 2. MÉTABOLISME & SIGNAUX VITAUX
    // Ces données sont celles que les capteurs "Simulés" liront
    // ==========================================

    /** Battements par minute réels */
    currentHeartRate: number = 70;
    /** Fréquence respiratoire (respirations par minute) */
    respiratoryRate: number = 20;

    // ==========================================
    // 3. PSYCHOLOGIE (NEURO-SIMULATION)
    // Ces variables pilotent le comportement social/réactif
    // ==========================================

    /** Niveau de stress/cortisol (0.0 = Zen, 1.0 = Panique) */
    stressLevel: number = 0.0;
    /** Niveau d'ennui (0.0 = Occupé, 1.0 = S'ennuie mortellement) */
    boredomLevel: number = 0.0;
    /** Niveau d'excitation/dopamine (0.0 = Calme, 1.0 = Foufou) */
    excitementLevel: number = 0.0;
    /** Envie sociale (0.0 = Solitaire, 1.0 = Veut des câlins) */
    socialNeed: number = 0.5;

    // ==========================================
    // 4. ÉTAT PHYSIQUE ACTUEL (RESULTAT DES ACTIONS)
    // Ce que le chien "fait" concrètement
    // ==========================================

    /** Position actuelle du corps */
    currentPosture: DogPosture = DogPosture.LYING;
    /** État actuel de la queue */
    tailState: TailState = TailState.RELAXED_DOWN;
    /** Vitesse actuelle de déplacement (km/h) */
    currentSpeed: number = 0;

    // ==========================================
    // 5. ENVIRONNEMENT PERÇU (LA VÉRITÉ TERRAIN)
    // Ce qui se trouve devant le chien (Input pour le cerveau)
    // ==========================================

    /** Ce que le chien a dans son champ de vision immédiat */
    currentVisualStimulus: VisualStimulus = VisualStimulus.NONE;
    /** Distance de l'objet vu en mètres */
    distanceToTarget: number = 0;
    /** Est-ce qu'il fait nuit ? (Influence le sommeil) */
    isNightTime: boolean = false;
}