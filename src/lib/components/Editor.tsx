import React, {useEffect} from "react";
import {HorizontalBox, useFlush, VerticalBox} from "@lib/utils/components";
import {ToolBar as EditorToolBar} from "@lib/components/Editor/ToolBar";
import {useEditor} from "@lib/providers/Editor";
import {ToolBarFolder, ToolBarGroup, ToolBarItem, ToolBarPosition} from "@lib/editor/ToolBar";
import {KeyEventAnnouncer} from "@lib/components/KeyEventAnnouncer";
import SideBar from "@lib/components/Editor/SideBar";
import {SideBarPosition} from "@lib/editor/SideBar";

export function Editor() {
    const editor = useEditor();
    const flush = useFlush();
    const toolBarGroups: {
        [K in string]: ToolBarGroup;
    } = React.useMemo(() => ({
        "editor:editor": new ToolBarGroup({
            folders: [
                new ToolBarFolder({
                    name: "Edit",
                    items: [
                        new ToolBarItem({
                            name: "Undo",
                            onClick: () => {
                                console.warn("Not implemented: Undo");
                            }
                        }),
                        new ToolBarItem({
                            name: "Redo",
                            onClick: () => {
                                console.warn("Not implemented: Redo");
                            }
                        }),
                    ],
                }),
            ],
            align: ToolBarPosition.Left,
        }),
        "editor:project": new ToolBarGroup({
            folders: [],
            align: ToolBarPosition.Right,
        }),
    }), []);

    useEffect(() => {
        return editor.GUIManger.onRequestFlush(flush).off;
    }, [editor.GUIManger, flush])

    useEffect(() => {
        Object.entries(toolBarGroups).forEach(([key, group]) => {
            editor.GUIManger.registerToolBarGroup(key, group);
        });

        console.debug(editor); // @debug

        return () => {
            Object.keys(toolBarGroups).forEach((key) => {
                editor.GUIManger.unregisterToolBarGroup(key);
            });
        }
    }, [...editor.GUIManger.deps]);

    return (
        <>
            <KeyEventAnnouncer/>
            <VerticalBox className={"h-full w-full"}>

                {/*  top: toolbar  */}
                <VerticalBox className={"p-2"}>
                    <EditorToolBar/>
                </VerticalBox>

                {/* left: left/bottom sidebars */}
                <HorizontalBox className={"w-16 h-full"}>
                    <VerticalBox className={"w-full h-full place-content-between"}>
                        <SideBar sideBar={editor.GUIManger.getSideBar(SideBarPosition.Left)}/>
                        <SideBar sideBar={editor.GUIManger.getSideBar(SideBarPosition.Bottom)}
                                 className={"justify-end"}/>
                    </VerticalBox>
                </HorizontalBox>

            </VerticalBox>
        </>
    );
}