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
import CharacterBrowserItem from "@lib/components/Editor/CharacterBrowser/CharacterBrowserItem";
import {Editor} from "@lib/editor/editor";
import {TabIndex} from "@lib/editor/GUIManager";
import {ContextMenuNamespace, getContextMenuId} from "@lib/components/Editor/ContextMenu/ContextMenuNamespace";
import {ContextMenu} from "@lib/components/Editor/ContextMenu/ContextMenu";

export function CharacterBrowserFolder(
    {
        group,
        name,
        onGroupRename,
        id,
        isDefaultGroup
    }: Readonly<{
        group: CharacterGroup;
        name: string;
        onGroupRename?: (name: string) => void;
        canRename?: boolean;
        id: string | number;
        isDefaultGroup?: boolean;
    }>
) {
    const editor = useEditor();
    const [open, setOpen] = React.useState(false);
    const flush = useFlush();
    const [isHeaderHovered, setIsHeaderHovered] = React.useState(false);
    const [isRenaming, setIsRenaming] = React.useState(false);
    const [currentName, setCurrentName] = React.useState(name);

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

    function removeCharacter(character: Character) {
        const sideBar = editor.GUIManger.getSideBar(SideBarPosition.Bottom);
        const currentComponent = sideBar?.getCurrent()?.getComponent();
        if (
            sideBar?.isCurrentComponent(CharacterPropertiesInspector)
            && currentComponent?.props.character === character
        ) {
            sideBar
                ?.get(SideBarItemsKeys.properties)
                ?.clearComponent();
            sideBar
                ?.hide();
        }
        group.removeCharacter(character);
        editor.GUIManger
            .requestSideBarFlush()
            .requestMainContentFlush();
        flush();
    }

    function handleStartRename() {
        if (!isDefaultGroup) {
            setIsRenaming(true);
            setOpen(true);
        }
    }

    function handleFinishRename() {
        setIsRenaming(false);
        if (currentName !== name && currentName.trim().length > 0 && onGroupRename) {
            const newName = currentName.trim();
            setCurrentName(newName);
            onGroupRename(newName);
            flush();
            editor.GUIManger.requestMainContentFlush();
        }
    }

    return (
        <>
            {/*  folder header  */}
            <ContextMenu
                id={getContextMenuId(ContextMenuNamespace.characterInspector.list.folder, id)}
                items={[
                    {
                        label: "rename",
                        handler: handleStartRename,
                        disabled: isDefaultGroup,
                    },
                    {
                        label: "delete",
                        handler: () => {
                            editor.getProject().getCharacterManager().removeGroup(name);
                            editor.GUIManger.requestMainContentFlush();
                        },
                        disabled: isDefaultGroup,
                    }
                ]}
            >
                <div
                    className={clsx("flex justify-between items-center px-2 py-1 cursor-pointer w-full select-none hover:bg-gray-100", {
                        "bg-gray-100 hover:bg-gray-200": open,
                    }, "border focus:border-primary-400 border-transparent")}
                    onClick={triggerOpen}
                    onMouseEnter={() => setIsHeaderHovered(true)}
                    onMouseLeave={() => setIsHeaderHovered(false)}
                    tabIndex={TabIndex.MainContent}
                >
                    <div
                        className={clsx("text-gray-900 flex items-center")}
                    >
                        {open ? <ChevronDownIcon className="w-4 h-4 mr-1"/> :
                            <ChevronRightIcon className="w-4 h-4 mr-1"/>}
                        {/*{name}*/}
                        {isRenaming
                            ? (
                                <input
                                    type="text"
                                    value={currentName}
                                    onChange={(event) => {
                                        setCurrentName(event.target.value);
                                    }}
                                    onBlur={handleFinishRename}
                                    onKeyDown={(event) => {
                                        if (event.key === Editor.Keys.Enter) {
                                            handleFinishRename();
                                        }
                                    }}
                                    autoFocus
                                    onClick={(event) => {
                                        event.stopPropagation();
                                    }}
                                />
                            )
                            : (
                                <span>
                                {currentName}
                            </span>
                            )}
                    </div>
                    <div
                        className={clsx("text-gray-300 cursor-pointer hover:text-gray-400", {
                            "hidden": !isHeaderHovered && !isRenaming,
                        })}
                        onClick={(event) => {
                            event.stopPropagation();
                            addCharacter(event);
                        }}
                    >{"+"}</div>
                </div>
            </ContextMenu>

            {/*  folder content  */}
            {open && (
                <div className="pl-2">
                    {group.getCharacters().map((character, index) => {
                        return (
                            <CharacterBrowserItem
                                character={character}
                                id={getContextMenuId(ContextMenuNamespace.characterInspector.list.character, id, index)}
                                key={index}
                                onInspectCharacter={inspectCharacter}
                                onRemoveCharacter={removeCharacter}
                            />
                        );
                    })}
                </div>
            )}
        </>
    );
}
