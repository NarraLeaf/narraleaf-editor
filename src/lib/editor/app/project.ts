import {Editor} from "@lib/editor/editor";
import {Character, CharacterConfig} from "@lib/editor/app/elements/character";
import {Image} from "@lib/editor/app/elements/image";
import {SrcManager} from "@lib/editor/app/srcManager";

type ProjectConfig = {
    editor: Editor;
};

export class Project {
    private config: ProjectConfig;
    private characters: Character[] = [];
    private images: Image[] = [];
    public readonly srcManager = new SrcManager();

    public constructor(config: ProjectConfig) {
        this.config = config;
    }

    public addCharacter(character: Character | CharacterConfig): this {
        if (Character.isCharacter(character)) {
            this.characters.push(character);
        } else {
            this.characters.push(new Character(character));
        }
        return this;
    }

    public getCharacters(): Character[] {
        return [...this.characters];
    }

    public addImage(image: Image): this {
        this.images.push(image);
        return this;
    }

    public getImages(): Image[] {
        return [...this.images];
    }
}
