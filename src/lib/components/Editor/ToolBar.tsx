import React from "react";
import {useEditor} from "@lib/providers/Editor";
import ToolBarGroup from "@lib/components/Editor/ToolBarGroup";

export function ToolBar() {
    const editor = useEditor();

    const {left, right} = editor.GUIManger.getToolBarGroupsByPosition();

    return (
        <div className="w-full h-10 flex justify-between">
            <div className="flex">
                {left.map((group, index) => (
                    <div key={index}>
                        <ToolBarGroup group={group}/>
                    </div>
                ))}
            </div>
            <div className="flex">
                {right.map((group, index) => (
                    <div key={index}>
                        <ToolBarGroup group={group}/>
                    </div>
                ))}
            </div>
        </div>
    );
}