
enum TreeItemType {
    Group,
    Item,
}

type ItemStat = {
    name: string;
} & (
    | {
    type: TreeItemType.Item;
    content: Item<unknown>;
}
    | {
    type: TreeItemType.Group;
    content: Group<Item<unknown>>;
})

export class Item<T> {
    public static isItem(obj: unknown): obj is Item<any> {
        return obj instanceof Item;
    }

    private content: T;
    private group: Group<Item<T>> | null = null;
    private name: string;

    constructor(name: string, content: T) {
        this.name = name;
        this.content = content;
    }

    public getContent(): T {
        return this.content;
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
        return this;
    }

    public stat(): ItemStat {
        return {
            name: this.getName(),
            type: TreeItemType.Item,
            content: this,
        };
    }
}

export class Group<T extends Item<any>> {
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

    private items: (T | Group<T>)[] = [];
    private parent: Group<T> | null = null;
    private name: string;

    constructor(name: string) {
        this.name = name;
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

    private setParent(parent: Group<T> | null): this {
        this.parent = parent;
        return this;
    }
}

