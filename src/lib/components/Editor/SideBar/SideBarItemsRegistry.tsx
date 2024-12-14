import {SideBarItem, SideBarPosition} from "@lib/editor/SideBar";
import HelloPage from "@lib/components/Pages/Hello";
import React from "react";
import {Bars3BottomLeftIcon, MusicalNoteIcon, PencilIcon, UserIcon} from "@heroicons/react/24/outline";
import PropertiesEmpty from "@lib/components/Pages/properties-empty";
import {CharacterBrowser} from "@lib/components/Editor/CharacterBrowser/CharacterBrowser";
import EmptySceneSelected from "@lib/components/Pages/EmptySceneSelected";

export const SideBarItemsKeys = {
    scenes: "scenes",
    characters: "characters",
    sounds: "sounds",
    properties: "properties",
    scripts: "scripts",
}

export const SideBarItemsRegistry: {
    [K in SideBarPosition]?: {
        [key: string]: SideBarItem;
    };
} = {
    [SideBarPosition.Left]: {
        [SideBarItemsKeys.scenes]: new SideBarItem({
            name: "Scenes",
            component: <div className={"h-full w-full bg-gray-100"}>Test</div>,
            icon: (
                <PencilIcon width={24}/>
            ),
        }),
        [SideBarItemsKeys.characters]: new SideBarItem({
            name: "Characters",
            component: <CharacterBrowser/>,
            icon: (
                <UserIcon width={24}/>
            ),
        }),
        [SideBarItemsKeys.sounds]: new SideBarItem({
            name: "Sounds",
            component: <HelloPage/>,
            icon: (
                <MusicalNoteIcon width={24}/>
            ),
        }),
    },
    [SideBarPosition.Bottom]: {
        [SideBarItemsKeys.properties]: new SideBarItem({
            name: "Properties",
            component: <PropertiesEmpty/>,
            icon: (
                <Bars3BottomLeftIcon width={24}/>
            ),
        }),
    },
    [SideBarPosition.Right]: {
        [SideBarItemsKeys.scripts]: new SideBarItem({
            name: "Scripts",
            component: <EmptySceneSelected/>,
            icon: (
                <Bars3BottomLeftIcon width={24}/>
            ),
        }),
    },
};