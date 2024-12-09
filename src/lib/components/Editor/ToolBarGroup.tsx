import React from "react";
import {ToolBarGroup as Group} from "@lib/editor/ToolBar";
import ToolBarFolder from "./ToolBarFolder";

export default function ToolBarGroup(
    {
        group,
    }: Readonly<{
        group: Group;
    }>
) {
    return (
        <div>
            {group.getFolders().map((folder, i) => (
                <div key={i}>
                    <ToolBarFolder folder={folder}/>
                </div>
            ))}
        </div>
    );
}

