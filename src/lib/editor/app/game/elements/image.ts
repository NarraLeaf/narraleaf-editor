import {Image as GameImageConstructor} from "narraleaf-react";
import {ValidTreeItem} from "@lib/editor/app/tree";

// this will be fixed in the future
export type GameImage = InstanceType<typeof GameImageConstructor>;

export type ImageConfig = {
    name: string | null;
    src: string;
};

export class Image
    implements ValidTreeItem<Image> {
    public static isImage(obj: any): obj is Image {
        return obj instanceof Image;
    }

    public config: ImageConfig;
    private readonly gameImage: GameImage;

    constructor(config: ImageConfig) {
        this.config = config;
        this.gameImage = new GameImageConstructor({
            src: config.src,
            name: config.name || undefined,
        });
    }

    public getGameImage(): GameImage {
        return this.gameImage;
    }

    copy(): Image {
        return new Image({
            name: this.config.name,
            src: this.config.src,
        });
    }

    onSetName(name: string) {
        this.config.name = name;
    }
}
