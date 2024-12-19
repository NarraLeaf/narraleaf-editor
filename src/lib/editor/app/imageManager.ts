import {Image} from "@lib/editor/app/game/elements/image";
import {Group, Item} from "@lib/editor/app/tree";

type ImageItem = Item<Image>;

export class ImageManager {
    public static createImage(name: string): Image {
        return new Image({
            name,
            src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABjElEQVR42mNk"
        });
    }

    private readonly rootGroup: Group<ImageItem>;

    constructor() {
        this.rootGroup = new Group("$root", {
            canDelete: false,
            canRename: false,
        }).freezeConfig();
    }

    getRootGroup(): Group<ImageItem> {
        return this.rootGroup;
    }

    isRootGroup(group: Group<ImageItem>): boolean {
        return group === this.rootGroup;
    }
}
