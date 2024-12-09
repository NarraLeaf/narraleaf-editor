import React from "react";

export type ToolBarRegistry = Record<string, ToolBarGroup> & object;
export enum ToolBarPosition {
    Left = "left",
    Right = "right",
}
type ToolBarPartRegistry = {
    folders: ToolBarFolder[];
    align: ToolBarPosition;
};
type ToolBarFolderConfig = {
    name: string;
    icon: React.ReactNode;
    items: ToolBarItem[];
};
type ToolBarItemConfig = {
    name: string;
    icon: React.ReactNode;
    onClick: () => void;
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
}

export class ToolBarFolder {
    private data: ToolBarFolderConfig;

    constructor(data: ToolBarFolderConfig) {
        this.data = data;
    }

    public getName(): string {
        return this.data.name;
    }

    public getIcon(): React.ReactNode {
        return this.data.icon;
    }

    public getItems(): ToolBarItem[] {
        return this.data.items;
    }

    public addItem(item: ToolBarItem): this {
        this.data.items.push(item);
        return this;
    }
}

export class ToolBarItem {
    private data: ToolBarItemConfig;

    constructor(data: ToolBarItemConfig) {
        this.data = data;
    }

    public getName(): string {
        return this.data.name;
    }

    public getIcon(): React.ReactNode {
        return this.data.icon;
    }

    public onClick(): void {
        this.data.onClick();
    }
}