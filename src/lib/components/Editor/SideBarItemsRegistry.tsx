import {SideBarItem, SideBarPosition} from "@lib/editor/SideBar";
import HelloPage from "@lib/components/Pages/Hello";
import React from "react";
import {Bars3BottomLeftIcon, FilmIcon, FolderIcon, PencilIcon, UserIcon} from "@heroicons/react/24/outline";

export const SideBarItemsRegistry: {
    [K in SideBarPosition]?: {
        [key: string]: SideBarItem;
    };
} = {
    [SideBarPosition.Left]: {
        "sidebar.editor:scripts": new SideBarItem({
            name: "Scripts",
            component: <div>Bottom</div>,
            icon: (
                <PencilIcon width={24}/>
            ),
        }),
        "sidebar.editor:scenes": new SideBarItem({
            name: "Scenes",
            component: <div className={"h-full w-full bg-gray-100"}>Test</div>,
            icon: (
                <FilmIcon width={24}/>
            ),
        }),
        "sidebar.editor:characters": new SideBarItem({
            name: "Characters",
            component: <HelloPage/>,
            icon: (
                <UserIcon width={24}/>
            ),
        }),
        "sidebar.editor:sources": new SideBarItem({
            name: "Sources",
            component: <HelloPage/>,
            icon: (
                <FolderIcon width={24}/>
            ),
        }),
    },
    [SideBarPosition.Bottom]: {
        "sidebar.editor:properties": new SideBarItem({
            name: "Properties",
            component: <HelloPage/>,
            icon: (
                <Bars3BottomLeftIcon width={24}/>
            ),
        }),
    },
};