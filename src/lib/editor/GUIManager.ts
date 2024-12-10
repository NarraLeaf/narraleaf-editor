import React from "react";
import {ToolBarGroup, ToolBarPosition, ToolBarRegistry} from "@lib/editor/ToolBar";
import {SideBar, SideBarPosition} from "@lib/editor/SideBar";
import {EventEmitter} from "events";
import {EditorEventToken} from "@lib/editor/type";

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
    readonly events: EventEmitter<{
        "event:editor.requestFlush": [];
    }> = new EventEmitter();
    private data: GUIData;
    private updateCounter: number = 0;

    public get deps(): unknown[] {
        return [this.updateCounter];
    }

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
        left: SideBar | null;
        right: SideBar | null;
        bottom: SideBar | null;
    } {
        return {
            left: this.getSideBar(SideBarPosition.Left),
            right: this.getSideBar(SideBarPosition.Right),
            bottom: this.getSideBar(SideBarPosition.Bottom),
        };
    }

    public getSideBar(side: SideBarPosition): SideBar | null {
        return this.data.sidebar[side];
    }

    public getMainContent(side: "left" | "right"): React.ReactNode {
        return this.data.main[side];
    }

    public setMainContent(side: "left" | "right", content: React.ReactNode): this {
        this.data.main[side] = content;
        return this.requestFlush();
    }

    public registerToolBarGroup(key: string, config: ToolBarGroup): this {
        this.data.toolbar[key] = config;
        return this.requestFlush();
    }

    public unregisterToolBarGroup(key: string): this {
        delete this.data.toolbar[key];
        return this.requestFlush();
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
            if (!group.isActive()) {
                continue;
            }
            if (group.getAlign() === ToolBarPosition.Left) {
                left.push(group);
            } else if (group.getAlign() === ToolBarPosition.Right) {
                right.push(group);
            }
        }
        return {
            left,
            right,
        };
    }

    public requestFlush(): this {
        this.events.emit("event:editor.requestFlush");
        return this;
    }

    public requestElevatedFlush(): this {
        this.updateCounter++;
        return this.requestFlush();
    }

    public onRequestFlush(callback: () => void): EditorEventToken {
        this.events.on("event:editor.requestFlush", callback);
        return {
            off: () => {
                this.events.off("event:editor.requestFlush", callback);
            }
        };
    }
}
