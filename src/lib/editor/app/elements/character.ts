import {Character as GameCharacter} from "narraleaf-react";


export type CharacterConfig = {
    name: string | null;
};

export class Character {
    public static isCharacter(obj: any): obj is Character {
        return obj instanceof Character;
    }
    public static newCharacter(name?: string): Character {
        return new Character({
            name: name || null,
        });
    }

    public config: CharacterConfig;
    private readonly gameCharacter: GameCharacter;

    constructor(config: CharacterConfig) {
        this.config = config;
        this.gameCharacter = new GameCharacter(config.name, {});
    }

    public getGameCharacter(): GameCharacter {
        return this.gameCharacter;
    }
}
