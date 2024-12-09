import React from "react";

type SideBarRegistry = {
    [key: string]: SideBarConfig;
};
type SideBarConfig = {
    name: string;
    component: React.ReactNode;
    icon: React.ReactNode;
};
type SideBarState = {
    registry: SideBarRegistry;
    current: string | null;
};

type GUIData = {
    sidebar: {
        left: SideBarState;
        right: SideBarState;
        bottom: SideBarState;
    },
};

export class GUIManager {
    private data: GUIData;

    constructor() {
        this.data = {
            sidebar: {
                left: {
                    registry: {},
                    current: null,
                },
                right: {
                    registry: {},
                    current: null,
                },
                bottom: {
                    registry: {},
                    current: null,
                },
            },
        };
    }

    public registerSizeBar(side: "left" | "right" | "bottom", key: string, config: SideBarConfig): this {
        this.data.sidebar[side].registry[key] = config;
        return this;
    }

}
