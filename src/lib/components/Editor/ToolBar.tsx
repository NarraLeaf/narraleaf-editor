import React from "react";
import {useEditor} from "@lib/providers/Editor";
import ToolBarGroup from "@lib/components/Editor/ToolBarGroup";
import {HorizontalBox} from "@lib/utils/components";

export function ToolBar() {
    const editor = useEditor();

    const {left, right} = editor.GUIManger.getToolBarGroupsByPosition();

    return (
        <div className="w-full h-10 flex justify-between select-none">
            <HorizontalBox>
                {left.map((group, index) => (
                    <div key={index}>
                        <ToolBarGroup group={group}/>
                    </div>
                ))}
            </HorizontalBox>
            <HorizontalBox>
                {right.map((group, index) => (
                    <div key={index}>
                        <ToolBarGroup group={group}/>
                    </div>
                ))}
            </HorizontalBox>
        </div>
    );
}