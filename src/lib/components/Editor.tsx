import React, {useEffect} from "react";
import {useFlush, VerticalBox} from "@lib/utils/components";
import {ToolBar as EditorToolBar} from "@lib/components/Editor/ToolBar";
import {useEditor} from "@lib/providers/Editor";
import {ToolBarFolder, ToolBarGroup, ToolBarItem, ToolBarPosition} from "@lib/editor/ToolBar";

export function Editor() {
    const editor = useEditor();
    const flush = useFlush();

    useEffect(() => {
        return editor.GUIManger.onRequestFlush(flush).off;
    }, [editor.GUIManger, flush])

    useEffect(() => {
        /* only for testing */
        editor.GUIManger.registerToolBarGroup(
            "t1",
            new ToolBarGroup({
                folders: [
                    new ToolBarFolder({
                        name: "f1",
                        items: [
                            new ToolBarItem({
                                name: "i1",
                                onClick: () => {
                                    console.log("i1");
                                }
                            })
                        ],
                    })
                ],
                align: ToolBarPosition.Left,
            })
        );

        console.log(editor)
        
        return () => {
            editor.GUIManger.unregisterToolBarGroup("t1");
        }
    }, [editor.GUIManger]);

    return (
        <>
            {/*  top: toolbar  */}
            <VerticalBox className={"h-8 p-2"}>
                <EditorToolBar />
            </VerticalBox>
        </>
    );
}