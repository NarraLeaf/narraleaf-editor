import React, {useEffect} from "react";
import SideBar from "@lib/components/Editor/SideBar/SideBar";
import HelloPage from "@lib/components/Pages/Hello";
import ResizablePanel from "@lib/components/ResizablePanel";
import {useEditor} from "@lib/providers/Editor";
import {SideBarPosition} from "@lib/editor/SideBar";
import {MainContentPosition} from "@lib/editor/GUIManager";
import {ToolBarGroups} from "@lib/components/Editor/ToolBar/ToolBarGroups";
import {KeyEventAnnouncer} from "@lib/components/KeyEventAnnouncer";
import {ToolBar as EditorToolBar} from "@lib/components/Editor/ToolBar/ToolBar";
import {WindowEventAnnouncer} from "@lib/components/WindowEventAnnouncer";
import {HorizontalBox, useFlush, VerticalBox} from "@lib/utils/components";
import {SideBarItemsRegistry} from "@lib/components/Editor/SideBar/SideBarItemsRegistry";
import {DndProvider} from "@lib/components/Editor/DNDControl/DNDControl";

function MainContent(
    {
        containerRef,
    }: Readonly<{
        containerRef: React.RefObject<HTMLDivElement>;
    }>,
) {
    const editor = useEditor();
    const flush = useFlush();
    const [
        {containerWidth, containerHeight},
        setContainerSize
    ] = React.useState({containerWidth: 0, containerHeight: 0});

    useEffect(() => {
        if (containerRef.current) {
            setContainerSize({
                containerWidth: containerRef.current.clientWidth,
                containerHeight: containerRef.current.clientHeight
            });
        }
        return editor.onResize(() => {
            if (containerRef.current) {
                setContainerSize({
                    containerWidth: containerRef.current.clientWidth,
                    containerHeight: containerRef.current.clientHeight
                });
            }
        }).off;
    }, []);

    useEffect(() => {
        return editor.GUIManger.onRequestMainContentFlush(flush).off;
    }, [...editor.GUIManger.deps]);

    const getHeight = (expected: number) => {
        return Math.min(containerHeight - 250, expected);
    };
    const getWidth = (expected: number) => {
        return Math.min(containerWidth - 250, expected);
    };

    return (
        <>
            <ResizablePanel
                direction={"vertical"}
                className={"overflow-hidden"}
                minSize={getHeight(250)}
                reverse
            >
                <ResizablePanel
                    direction={"horizontal"}
                    minSize={250}
                    reverse
                >
                    <ResizablePanel
                        direction={"horizontal"}
                        minSize={getWidth(250)}
                    >
                        {editor.GUIManger.renderMainContent(MainContentPosition.Left)}
                        {editor.GUIManger.renderMainContent(MainContentPosition.Center)}
                    </ResizablePanel>
                    {editor.GUIManger.renderMainContent(MainContentPosition.Right)}
                </ResizablePanel>
                {editor.GUIManger.renderMainContent(MainContentPosition.Bottom)}
            </ResizablePanel>
        </>
    );
}

export function Editor() {
    const editor = useEditor();
    const flush = useFlush();
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        return editor.GUIManger.onRequestFlush(flush).off;
    }, [...editor.GUIManger.deps]);

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
        editor.GUIManger.requestFlush();
    }, [...editor.GUIManger.deps]);

    return (
        <>
            <WindowEventAnnouncer/>
            <KeyEventAnnouncer/>
            <DndProvider>
                <VerticalBox className={"h-full w-full overflow-hidden"} ref={containerRef}>

                    {/*  top: toolbar  */}
                    <VerticalBox className={"border-gray-200 border-[1px]"}>
                        <EditorToolBar/>
                    </VerticalBox>

                    {/* left: left/bottom sidebars; right: main Content */}
                    <HorizontalBox className={"h-full max-w-full"}>

                        {/* sidebars */}
                        <VerticalBox className={"w-16 h-full place-content-between border-gray-200 border-[1px]"}>
                            <SideBar sideBar={editor.GUIManger.getSideBar(SideBarPosition.Left)}/>
                            <SideBar sideBar={editor.GUIManger.getSideBar(SideBarPosition.Bottom)}
                                     className={"justify-end"}/>
                        </VerticalBox>

                        {/* main Content */}
                        <MainContent containerRef={containerRef}/>

                        {/* right sidebar */}
                        <SideBar className={"h-full w-16 max-w-16 border-gray-200 border-[1px]"}
                                 sideBar={editor.GUIManger.getSideBar(SideBarPosition.Right)}/>
                    </HorizontalBox>

                </VerticalBox>
            </DndProvider>
        </>
    );
}