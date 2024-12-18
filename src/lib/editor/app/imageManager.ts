import {Image} from "@lib/editor/app/game/elements/image";

export class ImageFolder {
    private images: Image[];
    private readonly children: ImageFolder[];
    private readonly name: string | null = null;
    private readonly depth: number;

    constructor(name: string, depth: number) {
        this.name = name;
        this.depth = depth;
        this.children = [];
        this.images = [];
    }

    public addImage(image: Image): this {
        this.images.push(image);
        return this;
    }

    public getImages(): Image[] {
        return [...this.images];
    }

    public removeImage(image: Image): this {
        this.images = this.images.filter((i) => i !== image);
        return this;
    }

    public addChild(child: ImageFolder): this {
        this.children.push(child);
        return this;
    }

    /**
     * Moves an image from this folder to another.
     */
    public moveImage(image: Image, folder: ImageFolder): this {
        this.removeImage(image);
        folder.addImage(image);
        return this;
    }

    public getChildren(): ImageFolder[] {
        return [...this.children];
    }

    public getName(): string | null {
        return this.name;
    }

    public createChild(name: string): ImageFolder {
        if (this.depth >= ImageManager.MAX_FOLDER_DEPTH) {
            throw new Error("Folder depth limit reached");
        }

        const child = new ImageFolder(name, this.depth + 1);
        this.addChild(child);
        return child;
    }

    public isAbleToCreateChild(): boolean {
        return this.depth < ImageManager.MAX_FOLDER_DEPTH;
    }
}

export class ImageManager {
    static MAX_FOLDER_DEPTH = 128;
    private rootFolder: ImageFolder = new ImageFolder("ROOT", 0);

    public getRootFolder(): ImageFolder {
        return this.rootFolder;
    }
}
