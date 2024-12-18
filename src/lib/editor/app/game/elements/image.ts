import {Image as GameImageConstructor} from "narraleaf-react";

// this will be fixed in the future
export type GameImage = InstanceType<typeof GameImageConstructor>;

export type ImageConfig = {
    name: string | null;
    src: string;
};

export class Image {
    public static isImage(obj: any): obj is Image {
        return obj instanceof Image;
    }

    private config: ImageConfig;
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
}
