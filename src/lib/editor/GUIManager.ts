import React from "react";
import {ToolBarGroup, ToolBarRegistry} from "@lib/editor/ToolBar";
import {SideBar, SideBarConfig, SideBarPosition} from "@lib/editor/SideBar";

type GUIData = {
    sidebar: {
        [key in SideBarPosition]: SideBar;
    };
    main: {
        left: React.ReactNode;
        right: React.ReactNode;
    };
    toolbar: ToolBarRegistry;
};

export class GUIManager {
    private data: GUIData;

    constructor() {
        this.data = {
            sidebar: {
                left: new SideBar(),
                right: new SideBar(),
                bottom: new SideBar(),
            },
            main: {
                left: null,
                right: null,
            },
            toolbar: {},
        };
    }

    public getSideBars(): {
        left: SideBarConfig | null;
        right: SideBarConfig | null;
        bottom: SideBarConfig | null;
    } {
        return {
            left: this.getSideBar(SideBarPosition.Left),
            right: this.getSideBar(SideBarPosition.Right),
            bottom: this.getSideBar(SideBarPosition.Bottom),
        };
    }

    public getSideBar(side: SideBarPosition): SideBarConfig | null {
        return this.data.sidebar[side].getCurrent();
    }

    public getMainContent(side: "left" | "right"): React.ReactNode {
        return this.data.main[side];
    }

    public setMainContent(side: "left" | "right", content: React.ReactNode): this {
        this.data.main[side] = content;
        return this;
    }

    public registerToolBar(key: string, config: ToolBarGroup): this {
        this.data.toolbar[key] = config;
        return this;
    }

    public getToolBarGroup(key: string): ToolBarGroup | null {
        return this.data.toolbar[key] || null;
    }

    public getToolBarGroups(): ToolBarRegistry {
        return this.data.toolbar;
    }

    public getToolBarGroupsByPosition(): {
        left: ToolBarGroup[];
        right: ToolBarGroup[];
    } {
        const left: ToolBarGroup[] = [];
        const right: ToolBarGroup[] = [];
        for (const group of Object.values(this.data.toolbar)) {
            if (group.getAlign() === "left") {
                left.push(group);
            } else if (group.getAlign() === "right") {
                right.push(group);
            }
        }
        return {
            left,
            right,
        };
    }
}
