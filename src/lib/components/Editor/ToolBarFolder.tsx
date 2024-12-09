import React from "react";
import {ToolBarFolder as Folder} from "@lib/editor/ToolBar";

export default function ToolBarFolder(
    {
        folder,
    }: Readonly<{
        folder: Folder;
    }>
) {
    return (
        <div>
            {folder.getName()} {/* only for testing */}
        </div>
    );
}

