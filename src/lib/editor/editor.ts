import {GUIManager} from "./GUIManager";
import {EventEmitter} from "events";
import {EditorEventToken, IGUIEventContext} from "@lib/editor/type";
import React from "react";
import {Project} from "@lib/editor/app/project";
import {ClipboardManager} from "@lib/editor/ClipboardManager";
import {Focusable} from "@lib/editor/app/focusable";


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
    };
    public static Constants = {
        ContextMenuPrefix: "__EditorContextMenu__",
    } as const;
    public static Events = {
        Editor: {
            KeyPressed: "event:editor.keyPressed",
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
    public events: EventEmitter = new EventEmitter();
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
        this.events.on(Editor.Events.Editor.KeyPressed, (k) => {
            if (k === key) {
                callback();
            }
        });
        return {
            off: () => {
                this.events.off(Editor.Events.Editor.KeyPressed, callback);
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
