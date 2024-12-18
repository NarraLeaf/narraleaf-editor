import {SideBar, SideBarItem as EditorSideBarItem} from "@lib/editor/app/SideBar";
import clsx from "clsx";
import React from "react";
import {VerticalBox} from "@lib/utils/components";
import {useEditor} from "@lib/providers/Editor";

export function SideBarItem(
    {
        registry,
        sideBar,
    }: Readonly<{
        registry: [string, EditorSideBarItem];
        sideBar: SideBar;
    }>
) {
    const [key, item] = registry;
    const editor = useEditor();

    const handleSelectItem = (item: string) => {
        if (sideBar.getCurrentKey() === item) {
            sideBar.setCurrent(null);
            editor.GUI
                .requestMainContentFlush()
                .requestSideBarFlush();
            return;
        }
        sideBar.setCurrent(item);
        editor.GUI
            .requestMainContentFlush()
            .requestSideBarFlush();
    }

    return (
        <>
            <div
                className={clsx(
                    "p-2 select-none w-16 min-h-16 flex justify-center items-center cursor-pointer font-light",
                    {
                        "bg-gray-200 font-semibold": sideBar.getCurrentKey() === key,
                    },
                    "hover:bg-gray-200 active:bg-gray-300 transition-colors"
                )}
                onClick={() => handleSelectItem(key)}
            >
                <VerticalBox className={"flex items-center justify-center break-words text-center text-xs"}>
                    {item.getIcon()}
                    {item.getName()}
                </VerticalBox>
            </div>
        </>
    );
}