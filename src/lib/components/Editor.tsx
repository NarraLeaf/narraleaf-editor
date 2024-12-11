import React, {useEffect} from "react";
import SideBar from "@lib/components/Editor/SideBar";
import HelloPage from "@lib/components/Pages/Hello";
import ResizablePanel from "@lib/components/ResizablePanel";
import {useEditor} from "@lib/providers/Editor";
import {SideBarPosition} from "@lib/editor/SideBar";
import {MainContentPosition} from "@lib/editor/GUIManager";
import {ToolBarGroups} from "@lib/components/Editor/ToolBarGroups";
import {KeyEventAnnouncer} from "@lib/components/KeyEventAnnouncer";
import {ToolBar as EditorToolBar} from "@lib/components/Editor/ToolBar";
import {WindowEventAnnouncer} from "@lib/components/WindowEventAnnouncer";
import {HorizontalBox, useFlush, VerticalBox} from "@lib/utils/components";
import {SideBarItemsRegistry} from "@lib/components/Editor/SideBarItemsRegistry";


export function Editor() {
    const editor = useEditor();
    const flush = useFlush();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = React.useState(0);
    const [containerHeight, setContainerHeight] = React.useState(0);

    const [bottomPanelSize, setBottomPanelSize] = React.useState(200);
    const [leftPanelSize, setLeftPanelSize] = React.useState(200);
    const [rightPanelSize, setRightPanelSize] = React.useState(200);

    useEffect(() => {
        return editor.GUIManger.onRequestFlush(flush).off;
    }, [editor.GUIManger, flush])

    useEffect(() => {
        Object.entries(ToolBarGroups).forEach(([key, group]) => {
            editor.GUIManger.registerToolBarGroup(key, group);
        });
        Object.entries(SideBarItemsRegistry).forEach(([key, items]) => {
            const sideBar = editor.GUIManger.getSideBar(key as SideBarPosition);
            if (!sideBar) {
                console.warn(`Sidebar "${key}" is not registered`);
                return;
            }

            Object.entries(items).forEach(([key, item]) => {
                sideBar.register(key, item);
            });
        });

        editor.GUIManger.setMainContent(MainContentPosition.Center, (
            <HelloPage/>
        ))

        console.debug(editor); // @debug

        return () => {
            Object.keys(ToolBarGroups).forEach((key) => {
                editor.GUIManger.unregisterToolBarGroup(key);
            });
        }
    }, [...editor.GUIManger.deps]);

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.clientWidth);
            setContainerHeight(containerRef.current.clientHeight);
        }
        return editor.onResize(() => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
                setContainerHeight(containerRef.current.clientHeight);
            }
        }).off;
    }, []);

    const getHeight = (expected: number) => {
        return Math.min(containerHeight - 100, expected);
    };
    const getWidth = (expected: number) => {
        return Math.min(containerWidth - 100, expected);
    };

    return (
        <>
            <WindowEventAnnouncer/>
            <KeyEventAnnouncer/>
            <VerticalBox className={"h-full w-full overflow-hidden"} ref={containerRef}>

                {/*  top: toolbar  */}
                <VerticalBox className={"border-gray-200 border-[1px]"}>
                    <EditorToolBar/>
                </VerticalBox>

                {/* left: left/bottom sidebars; right: main Content */}
                <HorizontalBox className={"h-full"}>

                    {/* sidebars */}
                    <VerticalBox className={"w-16 h-full place-content-between border-gray-200 border-[1px]"}>
                        <SideBar sideBar={editor.GUIManger.getSideBar(SideBarPosition.Left)}/>
                        <SideBar sideBar={editor.GUIManger.getSideBar(SideBarPosition.Bottom)}
                                 className={"justify-end"}/>
                    </VerticalBox>

                    {/* main Content */}
                    <ResizablePanel direction={"vertical"} size={getHeight(bottomPanelSize)} onResize={setBottomPanelSize}>
                        <ResizablePanel direction={"horizontal"} size={getWidth(leftPanelSize)} onResize={setLeftPanelSize}>
                            <ResizablePanel direction={"horizontal"} size={getWidth(rightPanelSize)} onResize={setRightPanelSize}>
                                {editor.GUIManger.renderMainContent(MainContentPosition.Left)}
                                {editor.GUIManger.renderMainContent(MainContentPosition.Center)}
                            </ResizablePanel>
                            {editor.GUIManger.renderMainContent(MainContentPosition.Right)}
                        </ResizablePanel>
                        {editor.GUIManger.renderMainContent(MainContentPosition.Bottom)}
                    </ResizablePanel>
                </HorizontalBox>

            </VerticalBox>
        </>
    );
}