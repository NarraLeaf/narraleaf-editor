import {CharacterGroup} from "@lib/editor/app/characterManager";
import React, {useEffect} from "react";
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
import {EditorClickEvent} from "@lib/components/type";
import {DndNamespace, useDndGroup} from "@lib/components/Editor/DNDControl/DNDControl";
import {ClipboardNamespace} from "@lib/editor/ClipboardManager";

export function CharacterBrowserFolder(
    {
        group,
        name,
        onGroupRename,
        id,
    }: Readonly<{
        group: CharacterGroup;
        name: string;
        onGroupRename?: (name: string) => void;
        canRename?: boolean;
        id: string | number;
    }>
) {
    const editor = useEditor();
    const groupManager = editor.getProject().getCharacterManager();
    const [flush, flushDep] = useFlush();
    const [open, setOpen] = React.useState(false);
    const [isHeaderHovered, setIsHeaderHovered] = React.useState(false);
    const [isRenaming, setIsRenaming] = React.useState(false);
    const [currentName, setCurrentName] = React.useState(name);
    const [groupDND] = useDndGroup(DndNamespace.characterBrowser.character, ({character}) => {
        handleMoveCharacter(character);
    }, [flushDep]);

    const isDefaultGroup = groupManager.isDefaultGroup(group);

    useEffect(() => {
        return editor.dependEvents([
            editor.GUI.onRequestMainContentFlush(flush),
            editor.GUI.onRequestClipboardFlush(flush),
        ]).off;
    }, [...editor.GUI.deps]);

    function triggerOpen() {
        setOpen(!open);
    }

    function addCharacter(event: EditorClickEvent) {
        event.stopPropagation();
        const newCharacter = Character.newCharacter(
            group.newName("New Character"),
        );
        group.addCharacter(newCharacter);
        inspectCharacter(newCharacter);
        flush();
    }

    function inspectCharacter(character: Character) {
        editor.GUI
            .getSideBar(SideBarPosition.Bottom)
            ?.get(SideBarItemsKeys.properties)
            ?.setComponent(
                <CharacterPropertiesInspector character={character}/>
            );
        editor.GUI
            .getSideBar(SideBarPosition.Bottom)
            ?.setCurrent(SideBarItemsKeys.properties);
        editor.GUI
            .requestSideBarFlush()
            .requestMainContentFlush();
        flush();
        setOpen(true);
    }

    function removeCharacter(character: Character) {
        const sideBar = editor.GUI.getSideBar(SideBarPosition.Bottom);
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
        editor.GUI
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
            editor.GUI.requestMainContentFlush();
        }
    }

    function handleMoveCharacter(character: Character) {
        if (group.hasCharacter(character)) {
            return;
        }
        groupManager.moveCharacter(character, group);
        editor.GUI.requestMainContentFlush();
    }

    function pasteCharacter(character: Character) {
        group.addCharacter(
            character
                .copy()
                .setName(
                    group.newName(character.getName() + " -copy")
                )
        );
        flush();
    }

    return (
        <>
            {/*  folder header  */}
            {groupDND(({isDropping}) => (
                <div className={clsx("h-full w-full", {
                    "bg-primary-100": isDropping,
                })}>
                    <ContextMenu
                        id={getContextMenuId(ContextMenuNamespace.characterBrowser.list.folder, id)}
                        items={[
                            {
                                label: "new character",
                                handler: addCharacter,
                            },
                            {
                                label: "paste",
                                handler: () => {
                                    const expected = [ClipboardNamespace.characterBrowser.character];
                                    if (editor.getClipboard().is(expected)) {
                                        const character = editor.getClipboard().paste(expected)!;
                                        pasteCharacter(character);
                                    }
                                },
                                display: editor.getClipboard().is([ClipboardNamespace.characterBrowser.character]),
                            },
                            {
                                label: "rename",
                                handler: handleStartRename,
                                disabled: isDefaultGroup,
                            },
                            {
                                label: "delete",
                                handler: () => {
                                    editor.getProject().getCharacterManager().removeGroup(name);
                                    editor.GUI.requestMainContentFlush();
                                },
                                disabled: isDefaultGroup,
                            }
                        ]}
                    >
                        <div
                            className={clsx("flex justify-between items-center px-2 py-1 cursor-pointer w-full select-none hover:bg-gray-100", {
                                "bg-gray-100 hover:bg-gray-200": open,
                                "bg-primary-100": isDropping,
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
                                        <span className={clsx({
                                            "italic text-gray-500": isDefaultGroup,
                                        })}>
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
                                        id={getContextMenuId(ContextMenuNamespace.characterBrowser.list.character, id, index)}
                                        key={index}
                                        onInspectCharacter={inspectCharacter}
                                        onRemoveCharacter={removeCharacter}
                                        onPasteCharacter={pasteCharacter}
                                        isFolderDropping={isDropping}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
        </>
    );
}
