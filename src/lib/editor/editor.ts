import {GUIManager} from "./GUIManager";
import {EventEmitter} from "events";
import {EditorEventToken} from "@lib/editor/type";
import React from "react";


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
    public static Events = {
        Editor: {
            KeyPressed: "event:editor.keyPressed",
        },
    }

    public GUIManger = new GUIManager();
    public events: EventEmitter<{
        [K in typeof Editor.Events.Editor.KeyPressed]: [string];
    }> = new EventEmitter();

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
}
