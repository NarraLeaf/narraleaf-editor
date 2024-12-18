import React from "react";
import {useEditor} from "@lib/providers/Editor";
import {ModifierKeys, Editor} from "@lib/editor/editor";

export function KeyEventAnnouncer() {
    const editor = useEditor();

    React.useEffect(() => {
        if (!window) {
            console.warn("KeyEventAnnouncer: window is not available");
        }

        const onKeyDown = (event: KeyboardEvent) => {
            editor.events.emit("event:editor.keyPressed", event.key);

            const key = event.key;
            const controlKeys: ModifierKeys[] = [];

            if (event.ctrlKey) {
                controlKeys.push(ModifierKeys.Ctrl);
            }
            if (event.altKey) {
                controlKeys.push(ModifierKeys.Alt);
            }
            if (event.shiftKey) {
                controlKeys.push(ModifierKeys.Shift);
            }

            editor.events.emit(Editor.Events.Editor.KeysPressed, key, controlKeys);
        };

        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [editor]);

    return null;
}
