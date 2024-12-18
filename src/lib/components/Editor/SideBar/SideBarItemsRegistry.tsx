import {SideBarItem, SideBarPosition} from "@lib/editor/SideBar";
import React from "react";
import {Bars3BottomLeftIcon, MusicalNoteIcon, PencilIcon, PhotoIcon, UserIcon} from "@heroicons/react/24/outline";
import {CharacterBrowser} from "@lib/components/Editor/CharacterBrowser/CharacterBrowser";
import {Null} from "@lib/components/Pages/Null";

export const SideBarItemsKeys = {
    scenes: "scenes",
    characters: "characters",
    sounds: "sounds",
    properties: "properties",
    scripts: "scripts",
    images: "images",
}

export const SideBarItemsRegistry: {
    [K in SideBarPosition]?: {
        [key: string]: SideBarItem;
    };
} = {
    [SideBarPosition.Left]: {
        [SideBarItemsKeys.scenes]: new SideBarItem({
            name: "Scenes",
            component: <Null text={"Scenes"}/>,
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
            component: <Null text={"Sounds"}/>,
            icon: (
                <MusicalNoteIcon width={24}/>
            ),
        }),
        [SideBarItemsKeys.images]: new SideBarItem({
            name: "Images",
            component: <Null text={"Images"}/>,
            icon: (
                <PhotoIcon width={24}/>
            ),
        }),
    },
    [SideBarPosition.Bottom]: {
        [SideBarItemsKeys.properties]: new SideBarItem({
            name: "Properties",
            component: <Null text={"Select an element to inspect"}/>,
            icon: (
                <Bars3BottomLeftIcon width={24}/>
            ),
        }),
    },
    [SideBarPosition.Right]: {
        [SideBarItemsKeys.scripts]: new SideBarItem({
            name: "Scripts",
            component: <Null text={"Select a scene to inspect"}/>,
            icon: (
                <Bars3BottomLeftIcon width={24}/>
            ),
        }),
    },
};