import {Editor} from "@lib/editor/editor";
import {SrcManager} from "@lib/editor/app/srcManager";
import {ImageManager} from "@lib/editor/app/imageManager";
import {CharacterManager} from "@lib/editor/app/characterManager";

type ProjectConfig = {
    editor: Editor;
    name: string;
};

export class Project {
    public readonly sources = new SrcManager();
    public readonly characters: CharacterManager = new CharacterManager();
    public readonly images: ImageManager = new ImageManager();
    private config: ProjectConfig;

    public constructor(config: ProjectConfig) {
        this.config = config;
    }

    public getSourceManager(): SrcManager {
        return this.sources;
    }

    public getCharacterManager(): CharacterManager {
        return this.characters;
    }

    public getImageManager(): ImageManager {
        return this.images;
    }
}
