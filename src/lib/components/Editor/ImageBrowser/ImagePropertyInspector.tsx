import {Image} from "@lib/editor/app/game/elements/image";
import {useFlush} from "@lib/utils/components";
import React, {useEffect} from "react";
import {useEditor} from "@lib/providers/Editor";

export function ImagePropertyInspector(
    {
        image
    }: { image: Image; }
) {
    const editor = useEditor();
    const [flush] = useFlush();

    useEffect(() => {
        return editor.GUI.onRequestMainContentFlush(flush).off;
    }, [...editor.GUI.deps]);

    return (
        <>
            <span>
                {image.config.name || "Unnamed"}
            </span>
        </>
    );
}