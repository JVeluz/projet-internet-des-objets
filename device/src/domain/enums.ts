export enum DogPosture {
    SLEEPING = 'SLEEPING',
    LYING = 'LYING',
    SITTING = 'SITTING',
    STANDING = 'STANDING',
    WALKING = 'WALKING',
    RUNNING = 'RUNNING',
    POOPING_POSITION = 'POOPING_POSITION' // Soyons réalistes !
}

export enum TailState {
    RELAXED_DOWN = 'RELAXED_DOWN',
    WAGGING_SLOW = 'WAGGING_SLOW',
    WAGGING_FAST = 'WAGGING_FAST',
    STIFF_UP = 'STIFF_UP', // Alerte / Agressif
    TUCKED_BETWEEN_LEGS = 'TUCKED' // Peur
}

export enum VisualStimulus {
    NONE = 'NONE',
    CAT = 'CAT',
    MAILMAN = 'MAILMAN',
    SQUIRREL = 'SQUIRREL',
    OWNER = 'OWNER',
    FOOD_BOWL = 'FOOD_BOWL'
}