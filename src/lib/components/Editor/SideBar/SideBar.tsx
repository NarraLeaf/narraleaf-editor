import React from "react";
import {useFlush, VerticalBox} from "@lib/utils/components";
import {SideBar as EditorSideBar} from "@lib/editor/SideBar";
import clsx from "clsx";
import {SideBarItem} from "@lib/components/Editor/SideBar/SideBarItem";
import {useEditor} from "@lib/providers/Editor";


export default function SideBar(
    {
        sideBar,
        className,
    }: Readonly<{
        sideBar: EditorSideBar | null;
        className?: string;
    }>
) {
    const editor = useEditor();
    const flush = useFlush();

    React.useEffect(() => {
        return editor.GUIManger.onRequestSideBarFlush(flush).off;
    }, [...editor.GUIManger.deps]);

    if (!sideBar) {
        return null;
    }

    return (
        <>
            <VerticalBox className={clsx("w-full h-1/2 align-top items-center", className)}>
                {sideBar.entries().map((reg) =>
                    (<SideBarItem registry={reg} sideBar={sideBar} key={reg[0]} />)
                )}
            </VerticalBox>
        </>
    );
}

