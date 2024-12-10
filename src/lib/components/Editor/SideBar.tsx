import React from "react";
import {VerticalBox} from "@lib/utils/components";
import {SideBar as EditorSideBar} from "@lib/editor/SideBar";
import clsx from "clsx";


export default function SideBar(
    {
        sideBar,
        className,
    }: Readonly<{
        sideBar: EditorSideBar | null;
        className?: string;
    }>
) {
    if (!sideBar) {
        return null;
    }

    const handleSelectItem = (item: string) => {
        if (sideBar.getCurrentKey() === item) {
            sideBar.setCurrent(null);
        }
        sideBar.setCurrent(item);
        console.debug("SideBar: selected item", item);
    }

    return (
        <>
            <VerticalBox className={clsx("w-full h-1/2 align-top items-center", className)}>
                {sideBar.entries().map(([key, item]) => {
                    return (
                        <div
                            key={key}
                            className={"p-2 hover:bg-gray-200"}
                            onClick={() => handleSelectItem(key)}
                        >
                            {item.getIcon()}
                        </div>
                    );
                })}
            </VerticalBox>
        </>
    );
}

