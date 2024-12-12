import {Character} from "@lib/editor/app/elements/character";

export class CharacterGroup {
    private characters: Character[] = [];

    public addCharacter(character: Character): this {
        this.characters.push(character);
        return this;
    }

    public getCharacters(): Character[] {
        return [...this.characters];
    }
}

export class CharacterManager {
    private groups: {
        [key: string]: CharacterGroup;
    } = {};
    private defaultGroup: CharacterGroup = new CharacterGroup();

    public addGroup(name: string): this {
        this.groups[name] = new CharacterGroup();
        return this;
    }

    public getGroup(name: string): CharacterGroup | null {
        return this.groups[name] || null;
    }

    public hasGroup(name: string): boolean {
        return name in this.groups;
    }

    public getDefaultGroup(): CharacterGroup {
        return this.defaultGroup;
    }

    public values(): CharacterGroup[] {
        return [
            ...Object.values(this.groups),
            this.defaultGroup,
        ];
    }

    public entries(): [string, CharacterGroup][] {
        return [
            ...Object.entries(this.groups),
            ["default", this.defaultGroup],
        ];
    }
}
