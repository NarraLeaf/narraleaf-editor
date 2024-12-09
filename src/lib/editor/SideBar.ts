import React from "react";

type SideBarRegistry = {
    [key: string]: SideBarConfig;
};
export type SideBarConfig = {
    name: string;
    component: React.ReactNode;
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

export class SideBar {
    private data: SideBarState;

    constructor(data: SideBarState = {
        registry: {},
        current: null,
    }) {
        this.data = data;
    }

    public getRegistry(): SideBarRegistry {
        return this.data.registry;
    }

    public getCurrent(): SideBarConfig | null {
        return this.data.current ? this.data.registry[this.data.current] : null;
    }
}
