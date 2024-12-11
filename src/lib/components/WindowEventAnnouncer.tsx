import {useEditor} from "@lib/providers/Editor";
import {Editor} from "@lib/editor/editor";
import React from "react";

export function WindowEventAnnouncer() {
    const editor = useEditor();

    React.useEffect(() => {
        if (!window) {
            console.warn("WindowEventAnnouncer: window is not available");
        }

        const onResize = () => {
            editor.events.emit(Editor.Events.Editor.Resize);
        };

        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, [editor]);

    return null;
}