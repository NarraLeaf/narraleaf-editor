import {Image} from "@lib/editor/app/game/elements/image";
import {Group, Item} from "@lib/editor/app/tree";

type ImageItem = Item<Image>;

export class ImageManager {
    private readonly rootGroup: Group<ImageItem>;

    constructor() {
        this.rootGroup = new Group("$root");
    }

    getRootGroup(): Group<ImageItem> {
        return this.rootGroup;
    }

    isRootGroup(group: Group<ImageItem>): boolean {
        return group === this.rootGroup;
    }
}
