import {Editor} from "@lib/editor/editor";

export type ToolBarRegistry = Record<string, ToolBarGroup> & object;

export enum ToolBarPosition {
    Left = "left",
    Right = "right",
}

type ToolBarPartRegistry = {
    folders: ToolBarFolder[];
    align: ToolBarPosition;
    isActive?: () => boolean;
};
type ToolBarFolderConfig = {
    name: string;
    items: ToolBarItem[];
};
type ToolBarItemConfig = {
    name: string;
    onClick: (ctx: IToolBarItemOnClickCtx) => void;
};

export class ToolBarGroup {
    private data: ToolBarPartRegistry;

    constructor(data: ToolBarPartRegistry) {
        this.data = data;
    }

    public getFolders(): ToolBarFolder[] {
        return this.data.folders;
    }

    public getAlign(): ToolBarPosition {
        return this.data.align;
    }

    public addFolder(folder: ToolBarFolder): this {
        this.data.folders.push(folder);
        return this;
    }

    public isActive(): boolean {
        return this.data.isActive ? this.data.isActive() : true;
    }
}

export class ToolBarFolder {
    private data: ToolBarFolderConfig;

    constructor(data: ToolBarFolderConfig) {
        this.data = data;
    }

    public getName(): string {
        return this.data.name;
    }

    public getItems(): ToolBarItem[] {
        return this.data.items;
    }

    public addItem(item: ToolBarItem): this {
        this.data.items.push(item);
        return this;
    }
}

export interface IToolBarItemOnClickCtx {
    editor: Editor;
}

export class ToolBarItem {
    private data: ToolBarItemConfig;

    constructor(data: ToolBarItemConfig) {
        this.data = data;
    }

    public getName(): string {
        return this.data.name;
    }

    public onClick(ctx: IToolBarItemOnClickCtx): void {
        this.data.onClick(ctx);
    }
}