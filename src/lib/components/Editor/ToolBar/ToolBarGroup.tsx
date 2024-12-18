import React from "react";
import {ToolBarGroup as Group} from "@lib/editor/app/ToolBar";
import ToolBarFolder from "./ToolBarFolder";
import {HorizontalBox} from "@lib/utils/components";

export default function ToolBarGroup(
    {
        group,
    }: Readonly<{
        group: Group;
    }>
) {
    return (
        <>
            {group.getFolders().map((folder, i) => (
                <HorizontalBox key={i}>
                    <ToolBarFolder folder={folder}/>
                </HorizontalBox>
            ))}
        </>
    );
}

