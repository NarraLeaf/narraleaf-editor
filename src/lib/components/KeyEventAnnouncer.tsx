import React from "react";
import {useEditor} from "@lib/providers/Editor";

export function KeyEventAnnouncer() {
    const editor = useEditor();

    React.useEffect(() => {
        if (!window) {
            console.warn("KeyEventAnnouncer: window is not available");
        }

        const onKeyDown = (event: KeyboardEvent) => {
            editor.events.emit("event:editor.keyPressed", event.key);
        };

        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [editor]);

    return null;
}
