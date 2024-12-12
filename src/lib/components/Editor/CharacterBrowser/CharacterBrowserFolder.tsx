import {CharacterGroup} from "@lib/editor/app/characterManager";
import React from "react";
import {Character} from "@lib/editor/app/elements/character";
import {useEditor} from "@lib/providers/Editor";
import {SideBarPosition} from "@lib/editor/SideBar";
import {SideBarItemsKeys} from "@lib/components/Editor/SideBar/SideBarItemsRegistry";
import CharacterPropertiesInspector from "@lib/components/Editor/CharacterBrowser/CharacterPropertiesInspector";
import {ChevronDownIcon, ChevronRightIcon} from "@heroicons/react/24/outline";
import clsx from "clsx";
import {useFlush} from "@lib/utils/components";

export function CharacterBrowserFolder(
    {
        group,
        name,
    }: Readonly<{
        group: CharacterGroup;
        name: string;
    }>
) {
    const editor = useEditor();
    const [open, setOpen] = React.useState(false);
    const flush = useFlush();

    function triggerOpen() {
        setOpen(!open);
    }

    function addCharacter(event: React.MouseEvent) {
        event.stopPropagation();
        const newCharacter = Character.newCharacter("New Character");
        group.addCharacter(newCharacter);
        inspectCharacter(newCharacter);
        flush();
    }

    function inspectCharacter(character: Character) {
        editor.GUIManger
            .getSideBar(SideBarPosition.Bottom)
            ?.get(SideBarItemsKeys.properties)
            ?.setComponent(
                <CharacterPropertiesInspector character={character}/>
            );
        editor.GUIManger
            .getSideBar(SideBarPosition.Bottom)
            ?.setCurrent(SideBarItemsKeys.properties);
        editor.GUIManger
            .requestSideBarFlush()
            .requestMainContentFlush();
        flush();
        setOpen(true);
    }

    return (
        <>
            <div
                className={clsx("flex justify-between items-center px-2 py-1 cursor-pointer w-full select-none", {
                    "bg-gray-50": open,
                })}
                onClick={triggerOpen}
            >
                <div className={clsx("text-gray-300 flex items-center hover:bg-gray-100")}>
                    {open ? <ChevronDownIcon className="w-4 h-4 mr-1"/> : <ChevronRightIcon className="w-4 h-4 mr-1"/>}
                    {name}
                </div>
                <div className="text-gray-300 cursor-pointer hover:text-gray-400" onClick={addCharacter}>+</div>
            </div>
            {/*  folder content  */}
            {/*  list of characters  */}
            {open && (
                <div className="px-2 py-1">
                    {group.getCharacters().map((character, index) => {
                        const sideBar = editor.GUIManger.getSideBar(SideBarPosition.Bottom);
                        const component =
                            sideBar
                                ?.getCurrent()
                                ?.getComponent<{ character: Character }>();
                        const selected =
                            component?.type === CharacterPropertiesInspector && component.props.character === character;
                        return (
                            <div
                                key={index}
                                className={clsx("flex justify-between items-center cursor-pointer bg-white hover:bg-gray-100", {
                                    "bg-gray-200": selected,
                                })}
                                onClick={() => inspectCharacter(character)}
                            >
                                <span className={clsx("text-black", {
                                    "font-semibold": selected,
                                })}>{character.config.name}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}
