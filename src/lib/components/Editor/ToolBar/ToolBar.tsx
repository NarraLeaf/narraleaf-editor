import React, {useEffect} from "react";
import {useEditor} from "@lib/providers/Editor";
import ToolBarGroup from "@lib/components/Editor/ToolBar/ToolBarGroup";
import {HorizontalBox, useFlush} from "@lib/utils/components";

export function ToolBar() {
    const editor = useEditor();
    const flush = useFlush();

    useEffect(() => {
        return editor.GUIManger.onRequestToolBarFlush(flush).off;
    }, [...editor.GUIManger.deps]);

    const {left, right} = editor.GUIManger.getToolBarGroupsByPosition();

    return (
        <div className="w-full h-fit flex justify-between select-none">
            <HorizontalBox>
                {left.map((group, index) => (
                    <React.Fragment key={index}>
                        <ToolBarGroup group={group}/>
                    </React.Fragment>
                ))}
            </HorizontalBox>
            <HorizontalBox>
                {right.map((group, index) => (
                    <React.Fragment key={index}>
                        <ToolBarGroup group={group}/>
                    </React.Fragment>
                ))}
            </HorizontalBox>
        </div>
    );
}