import React from "react";

type SideBarRegistry = {
    [key: string]: SideBarItem;
};
export type SideBarConfig = {
    name: string;
    component: React.FunctionComponentElement<unknown> | null;
    icon: React.ReactNode;
};
type SideBarState = {
    registry: SideBarRegistry;
    current: string | null;
};

export enum SideBarPosition {
    Left = "left",
    Right = "right",
    Bottom = "bottom",
}

export class SideBarItem {
    private data: SideBarConfig;
    private defaultComponent: React.FunctionComponentElement<unknown> | null = null;

    constructor(data: SideBarConfig) {
        this.data = data;
        this.defaultComponent = data.component;
    }

    public getName(): string {
        return this.data.name;
    }

    public getComponent<T extends Record<string, any>>(): React.FunctionComponentElement<T> | null {
        return this.data.component as React.FunctionComponentElement<T> | null;
    }

    public getIcon(): React.ReactNode {
        return this.data.icon;
    }

    public setComponent(component: React.FunctionComponentElement<unknown> | null): this {
        this.data.component = component;
        return this;
    }

    public clearComponent(): this {
        this.data.component = null;
        return this;
    }

    public resetComponent(): this {
        this.data.component = this.defaultComponent;
        return this;
    }
}

export class SideBar {
    public static isSideBar(obj: unknown): obj is SideBar {
        return obj instanceof SideBar;
    }

    private data: SideBarState;

    constructor(data: SideBarState = {
        registry: {},
        current: null,
    }) {
        this.data = data;
    }

    public getCurrentKey(): string | null {
        return this.data.current;
    }

    public getCurrent(): SideBarItem | null {
        return this.data.current ? this.data.registry[this.data.current] : null;
    }

    public setCurrent(key: string | null): this {
        if (key && !this.data.registry[key]) {
            throw new Error(`Sidebar "${key}" is not registered`);
        }
        this.data.current = key;
        return this;
    }

    public hide(): this {
        this.data.current = null;
        return this;
    }

    public get(key: string): SideBarItem | null {
        return this.data.registry[key] || null;
    }

    public register(key: string, config: SideBarItem): this {
        this.data.registry[key] = config;
        return this;
    }

    public entries(): [string, SideBarItem][] {
        return Object.entries(this.data.registry);
    }

    public isCurrentComponent(component: React.FunctionComponent<any>): boolean {
        return this.getCurrent()?.getComponent()?.type === component;
    }
}
