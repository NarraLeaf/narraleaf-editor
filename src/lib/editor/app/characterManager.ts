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

    public removeCharacter(character: Character): this {
        this.characters = this.characters.filter((c) => c !== character);
        return this;
    }
}

export class CharacterManager {
    static DEFAULT_GROUP_NAME = "default";
    private groups: {
        [key: string]: CharacterGroup;
    } = {};
    private defaultGroup: CharacterGroup = new CharacterGroup()
        .addCharacter(Character.createNarrator());

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
            this.defaultGroup,
            ...Object.values(this.groups),
        ];
    }

    public entries(): [string, CharacterGroup][] {
        return [
            [CharacterManager.DEFAULT_GROUP_NAME, this.defaultGroup],
            ...Object.entries(this.groups),
        ];
    }

    public renameGroup(oldName: string, newName: string): this {
        if (this.groups[oldName]) {
            this.groups[newName] = this.groups[oldName];
            delete this.groups[oldName];
        }
        return this;
    }

    public newName(prefix: string): string {
        let i = 1;
        while (this.hasGroup(`${prefix}-${i}`)) {
            i++;
        }
        return `${prefix}-${i}`;
    }

    public isDefaultGroup(group: CharacterGroup): boolean {
        return group === this.defaultGroup;
    }

    public removeGroup(name: string): this {
        delete this.groups[name];
        return this;
    }
}
