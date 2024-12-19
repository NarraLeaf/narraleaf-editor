enum TreeItemType {
    Group,
    Item,
}

type ItemStat = {
    name: string;
} & (
    | {
    type: TreeItemType.Item;
    content: Item<any>;
}
    | {
    type: TreeItemType.Group;
    content: Group<Item<any>>;
})

export abstract class ValidTreeItem<T> {
    abstract copy(): T;
    abstract onSetName(name: string): void;
}

export class Item<T extends ValidTreeItem<any>> {
    public static isItem(obj: unknown): obj is Item<any> {
        return obj instanceof Item;
    }

    private content: T;
    private group: Group<Item<T>> | null = null;
    private name: string;
    private _canRename: boolean = true;
    private _canDelete: boolean = true;

    constructor(name: string, content: T) {
        this.name = name;
        this.content = content;
    }

    public getContent(): T {
        return this.content;
    }

    public setCanRename(canRename: boolean): this {
        this._canRename = canRename;
        return this;
    }

    public setCanDelete(canDelete: boolean): this {
        this._canDelete = canDelete;
        return this;
    }

    public canRename(): boolean {
        return this._canRename;
    }

    public canDelete(): boolean {
        return this._canDelete;
    }

    public setContent(content: T): this {
        this.content = content;
        return this;
    }

    public setGroup(group: Group<Item<T>> | null): this {
        this.group = group;
        return this;
    }

    public getGroup(): Group<Item<T>> | null {
        return this.group;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): this {
        this.name = name;
        this.getContent().onSetName(name);
        return this;
    }

    public stat(): ItemStat {
        return {
            name: this.getName(),
            type: TreeItemType.Item,
            content: this,
        };
    }

    public copy(): Item<T> {
        return new Item(this.getName(), this.getContent().copy());
    }
}

export type GroupConfig = {
    canRename: boolean;
    canDelete: boolean;
};

export class Group<T extends Item<any>> {
    static DefaultConfig: GroupConfig = {
        canRename: true,
        canDelete: true,
    }
    private static KeyPrefixes = {
        Group: "GROUP",
        Item: "ITEM",
    } as const;

    public static getKey(group: Group<Item<any>> | Item<any>, prefix: string = ""): string {
        if (Group.isGroup(group)) {
            return `${prefix ? prefix + "." : ""}${Group.KeyPrefixes.Group}:${group.getName()}`;
        } else {
            return `${prefix ? prefix + "." : ""}${Group.KeyPrefixes.Item}:${group.getName()}`;
        }
    }

    public static isGroup(obj: unknown): obj is Group<Item<any>> {
        return obj instanceof Group;
    }

    public config: GroupConfig;
    private items: (T | Group<T>)[] = [];
    private parent: Group<T> | null = null;
    private name: string;
    private configFrozen: boolean = false;

    constructor(name: string, config: Partial<GroupConfig> = {}) {
        this.name = name;
        this.config = Object.assign({}, Group.DefaultConfig, config);
    }

    public isConfigFrozen(): boolean {
        return this.configFrozen;
    }

    public freezeConfig(): this {
        this.configFrozen = true;
        this.config = Object.freeze(this.config);
        return this;
    }

    public getItems(): (T | Group<T>)[] {
        return this.items;
    }

    public addItem(item: T): this {
        if (item.getGroup() !== null) {
            item.getGroup()!.removeItem(item);
        }

        this.items.push(item.setGroup(this));
        return this;
    }

    public removeGroup(group: Group<T>): this {
        const index = this.items.indexOf(group);
        if (index !== -1) {
            this.items.splice(index, 1);
            group.setParent(null);
        }
        return this;
    }

    public addGroup(group: Group<T>): this {
        if (group.getParent() !== null) {
            if (group.isAncestorOf(this)) {
                throw new Error("Cannot add ancestor group");
            }
            group.getParent()!.removeGroup(group);
        }
        this.items.push(group);
        group.setParent(this);
        return this;
    }

    public removeItem(item: T): this {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
            item.setGroup(null);
        }
        return this;
    }

    public getParent(): Group<T> | null {
        return this.parent;
    }

    public isAncestorOf(group: Group<T>): boolean {
        let parent = group.getParent();
        while (parent !== null) {
            if (parent === this) {
                return true;
            }
            parent = parent.getParent();
        }
        return false;
    }

    public isDescendantOf(group: Group<T>): boolean {
        return group.isAncestorOf(this);
    }

    public entries(): [string, (T | Group<T>)][] {
        return this.items.map((item) => {
            return [Group.getKey(item, this.getName()), item];
        });
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): this {
        this.name = name;
        return this;
    }

    public stat(): ItemStat {
        return {
            name: this.getName(),
            type: TreeItemType.Group,
            content: this,
        };
    }

    public copy(): Group<T> {
        const group = new Group<T>(this.getName(), {...this.config});
        this.items.forEach((item) => {
            if (Item.isItem(item)) {
                group.addItem(item.copy() as T);
            } else {
                group.addGroup(item.copy());
            }
        });
        return group;
    }

    public newName(prefix: string): string {
        let i = 1;
        let name = `${prefix}-${i}`;
        const names = new Set(this.items.map((item) => item.getName()));
        while (names.has(name)) {
            i++;
            name = `${prefix}-${i}`;
        }
        return name;
    }

    public toChildren(): (T | Group<T>)[] {
        const groups: Group<T>[] = [];
        const items: T[] = [];
        this.items.forEach((item) => {
            if (Item.isItem(item)) {
                items.push(item);
            } else {
                groups.push(item);
            }
        });
        return [...groups, ...items];
    }

    private setParent(parent: Group<T> | null): this {
        this.parent = parent;
        return this;
    }
}

