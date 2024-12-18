import {GUIManager} from "./app/GUIManager";
import {EventEmitter} from "events";
import {EditorEventToken, IGUIEventContext} from "@lib/editor/type";
import React from "react";
import {Project} from "@lib/editor/app/project";
import {ClipboardManager} from "@lib/editor/app/ClipboardManager";
import {Focusable} from "@lib/editor/app/focusable";

export enum ModifierKeys {
    Ctrl = 0x1,
    Shift = 0x2,
    Alt = 0x4,
}

export class Editor {
    public static Keys = {
        Enter: "Enter",
        Escape: "Escape",
        Tab: "Tab",
        Backspace: "Backspace",
        Delete: "Delete",
        ArrowDown: "ArrowDown",
        ArrowUp: "ArrowUp",
        ArrowLeft: "ArrowLeft",
        ArrowRight: "ArrowRight",
        Space: " ",
        Control: "Control",
        Shift: "Shift",
        Alt: "Alt",
        Meta: "Meta",
        CapsLock: "CapsLock",
        PageUp: "PageUp",
        PageDown: "PageDown",
        Home: "Home",
        End: "End",
        Insert: "Insert",
        F1: "F1",
        F2: "F2",
        F3: "F3",
        F4: "F4",
        F5: "F5",
        F6: "F6",
        F7: "F7",
        F8: "F8",
        F9: "F9",
        F10: "F10",
        F11: "F11",
        F12: "F12",
        C: "c",
        V: "v",
        X: "x",
        Z: "z",
        Y: "y",
    };
    public static Constants = {
        ContextMenuPrefix: "__EditorContextMenu__",
    } as const;
    public static ModifierKeys = ModifierKeys;
    public static Events = {
        Editor: {
            KeyPressed: "event:editor.keyPressed",
            KeysPressed: "event:editor.keysPressed",
            Resize: "event:editor.resize",
        },
    }

    public static getCtx(editor: Editor): IGUIEventContext {
        return {
            editor,
        } satisfies IGUIEventContext;
    }

    public GUI: GUIManager = new GUIManager();
    public focus: Focusable = new Focusable();
    public events: EventEmitter = new EventEmitter<{
        "event:editor.keyPressed": [string],
        "event:editor.resize": [],
        "event:editor.keysPressed": [string, ModifierKeys[]],
    }>().setMaxListeners(Infinity);
    public readonly constants = {
        ui: {
            animationDuration: "duration-100"
        }
    } as const;
    private readonly clipboard: ClipboardManager;
    private project: Project;

    constructor() {
        this.project = this.getNewProject("Untitled");
        this.clipboard = new ClipboardManager(this);
    }

    public onKeyPress(key: React.KeyboardEvent["key"], callback: () => void): EditorEventToken {
        const listener = (k: string) => {
            if (k === key) {
                callback();
            }
        };
        this.events.on(Editor.Events.Editor.KeyPressed, listener);
        return {
            off: () => {
                this.events.off(Editor.Events.Editor.KeyPressed, listener);
            }
        };
    }

    public onKeysPress(key: React.KeyboardEvent["key"], ModifierKeys: number, callback: () => void): EditorEventToken {
        const listener = (k: string, c: ModifierKeys[]) => {
            if (k === key) {
                const meetsControlKeys = c.every((ModifierKey) => {
                    return ModifierKeys & ModifierKey;
                });
                if (meetsControlKeys) {
                    callback();
                }
            }
        };
        this.events.on(Editor.Events.Editor.KeysPressed, listener);
        return {
            off: () => {
                this.events.off(Editor.Events.Editor.KeysPressed, listener);
            }
        };
    }

    public onResize(callback: () => void): EditorEventToken {
        this.events.on(Editor.Events.Editor.Resize, callback);
        return {
            off: () => {
                this.events.off(Editor.Events.Editor.Resize, callback);
            }
        };
    }

    public getProject(): Project {
        return this.project;
    }

    public getNewProject(name: string): Project {
        return new Project({
            editor: this,
            name: name,
        });
    }

    public setProject(project: Project): this {
        this.project = project;
        return this;
    }

    public getClipboard(): ClipboardManager {
        return this.clipboard;
    }

    public dependEvents(events: EditorEventToken[]): EditorEventToken {
        return {
            off: () => {
                events.forEach((event) => {
                    event.off();
                });
            }
        };
    }
}
