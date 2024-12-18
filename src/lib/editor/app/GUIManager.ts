import React from "react";
import {ToolBarGroup, ToolBarPosition, ToolBarRegistry} from "@lib/editor/app/ToolBar";
import {SideBar, SideBarPosition} from "@lib/editor/app/SideBar";
import {EventEmitter} from "events";
import {EditorEventToken} from "@lib/editor/type";

type MainContent = SideBar | React.ReactNode | null;
type GUIData = {
    sidebar: {
        [key in SideBarPosition]: SideBar;
    };
    main: {
        [K in MainContentPosition]: MainContent;
    };
    toolbar: ToolBarRegistry;
};

export enum MainContentPosition {
    Left = "left",
    Right = "right",
    Bottom = "bottom",
    Center = "center",
}

type GUIManagerEvents = {
    "event:editor.requestFlush": [];
    "event:editor.toolBar.requestFlush": [];
    "event:editor.sideBar.requestFlush": [];
    "event:editor.mainContent.requestFlush": [];
    "event:editor.clipboard.requestFlush": [];
};

export enum TabIndex {
    MainContent,
}

export class GUIManager {
    public static Events = {
        editor: {
            requestFlush: "event:editor.requestFlush",
            toolBar: {
                requestFlush: "event:editor.toolBar.requestFlush",
            },
            sideBar: {
                requestFlush: "event:editor.sideBar.requestFlush",
            },
            mainContent: {
                requestFlush: "event:editor.mainContent.requestFlush",
            },
            clipboard: {
                requestFlush: "event:editor.clipboard.requestFlush",
            },
        }
    } as const;

    readonly events: EventEmitter<GUIManagerEvents> = new EventEmitter();
    private data: GUIData;
    private updateCounter: number = 0;

    public get deps(): unknown[] {
        return [this.updateCounter];
    }

    constructor() {
        const sideBars: {
            [key in SideBarPosition]: SideBar;
        } = {
            left: new SideBar(),
            right: new SideBar(),
            bottom: new SideBar(),
        }
        this.data = {
            sidebar: sideBars,
            main: {
                left: sideBars.left,
                right: sideBars.right,
                bottom: sideBars.bottom,
                center: null,
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

    public renderMainContent(side: MainContentPosition): React.ReactElement[] {
        if (!this.data.main[side]) {
            return [];
        }

        const style = {
            height: "100%",
            width: "100%",
        };
        if (SideBar.isSideBar(this.data.main[side])) {
            const currentKey = this.data.main[side].getCurrentKey();
            return this.data.main[side].entries().map(([key, item]) => {
                return (
                    React.createElement("div", {
                        hidden: key !== currentKey,
                        key,
                        style,
                    }, item.getComponent())
                );
            })
        }
        if (React.isValidElement(this.data.main[side])) {
            return [
                React.createElement("div", {
                    key: "main",
                    style,
                }, this.data.main[side])
            ];
        }
        return [];
    }

    public setMainContent(side: MainContentPosition, content: MainContent): this {
        this.data.main[side] = content;
        return this.requestMainContentFlush();
    }

    public registerToolBarGroup(key: string, config: ToolBarGroup): this {
        this.data.toolbar[key] = config;
        return this.requestToolBarFlush();
    }

    public unregisterToolBarGroup(key: string): this {
        delete this.data.toolbar[key];
        return this.requestToolBarFlush();
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

    /**
     * Request a flush of the whole GUI
     *
     * If you want to update some part of the GUI, you should use the specific methods.
     */
    public requestFlush(): this {
        return this.emitEvent(GUIManager.Events.editor.requestFlush);
    }

    /**
     * Request a flush of the whole GUI and GUI-related hooks
     *
     * **Using this method may cause performance issues, use it only when necessary**
     */
    public requestElevatedFlush(): this {
        this.updateCounter++;
        return this.requestFlush();
    }

    public onRequestFlush(callback: () => void): EditorEventToken {
        return this.wrapEvent(GUIManager.Events.editor.requestFlush, callback);
    }

    public requestToolBarFlush(): this {
        return this.emitEvent(GUIManager.Events.editor.toolBar.requestFlush);
    }

    public onRequestToolBarFlush(callback: () => void): EditorEventToken {
        return this.wrapEvent(GUIManager.Events.editor.toolBar.requestFlush, callback);
    }

    public requestSideBarFlush(): this {
        return this.emitEvent(GUIManager.Events.editor.sideBar.requestFlush);
    }

    public onRequestSideBarFlush(callback: () => void): EditorEventToken {
        return this.wrapEvent(GUIManager.Events.editor.sideBar.requestFlush, callback);
    }

    public requestMainContentFlush(): this {
        return this.emitEvent(GUIManager.Events.editor.mainContent.requestFlush);
    }

    public onRequestMainContentFlush(callback: () => void): EditorEventToken {
        return this.wrapEvent(GUIManager.Events.editor.mainContent.requestFlush, callback);
    }

    public requestClipboardFlush(): this {
        return this.emitEvent(GUIManager.Events.editor.clipboard.requestFlush);
    }

    public onRequestClipboardFlush(callback: () => void): EditorEventToken {
        return this.wrapEvent(GUIManager.Events.editor.clipboard.requestFlush, callback);
    }

    private wrapEvent(key: keyof GUIManagerEvents, callback: () => void): EditorEventToken {
        this.events.on(key, callback);
        return {
            off: () => {
                this.events.off(key, callback);
            }
        };
    }

    private emitEvent(key: keyof GUIManagerEvents): this {
        this.events.emit(key);
        return this;
    }
}
