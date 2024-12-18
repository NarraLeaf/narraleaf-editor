import React, {useEffect} from "react";
import clsx from "clsx";
import {Character} from "@lib/editor/app/game/elements/character";
import {useEditor} from "@lib/providers/Editor";
import {ChevronDownIcon, ChevronRightIcon} from "@heroicons/react/24/outline";
import {useFlush} from "@lib/utils/components";
import {Editor} from "@lib/editor/editor";
import {TabIndex} from "@lib/editor/app/GUIManager";
import {ContextMenuNamespace, getContextMenuId} from "@lib/components/Editor/ContextMenu/ContextMenuNamespace";
import {ContextMenu} from "@lib/components/Editor/ContextMenu/ContextMenu";
import {EditorClickEvent} from "@lib/components/type";
import {DndNamespace, useDndGroup} from "@lib/components/Editor/DNDControl/DNDControl";
import {ClipboardNamespace} from "@lib/editor/app/ClipboardManager";
import {useFocus} from "@lib/components/Focus";
import {Focusable} from "@lib/editor/app/focusable";
import {Group} from "@lib/editor/app/tree";
import {Image} from "@lib/editor/app/game/elements/image";

type FileBrowserGroupConfig = {
    id: string;
    group: Group<any>,
    focusable: Focusable,
};

export function FileBrowserFolder(
    {
        id,
        focusable,
        group,
    }: Readonly<FileBrowserGroupConfig>
) {
    const editor = useEditor();
    const [flush, flushDep] = useFlush();
    const [open, setOpen] = React.useState(false);
    const [isRenaming, setIsRenaming] = React.useState(false);
    const [currentName, setCurrentName] = React.useState<string | null>(null);
    const [focused, focus, folderFocusable] = useFocus(focusable);
    const [groupDND] = useDndGroup(DndNamespace.imageBrowser.image, ({image}) => {
        handleMoveImage(image);
    }, [flushDep]);

    const imageManager = editor.getProject().getImageManager();
    const isRootGroup = imageManager.isRootGroup(group);

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
        throw new Error("Not implemented");
    }

    function inspectCharacter(character: Character) {
        throw new Error("Not implemented");
    }

    function removeCharacter(character: Character) {
        throw new Error("Not implemented");
    }

    function handleStartRename() {
        if (!isRootGroup) {
            setIsRenaming(true);
            setOpen(true);
        }
    }

    function handleFinishRename() {
        setIsRenaming(false);
        if (currentName && currentName !== group.getName() && currentName.trim().length > 0) {
            const newName = currentName.trim();
            group.setName(newName);

            flush();
            editor.GUI.requestMainContentFlush();
        }
        setCurrentName(null);
    }

    function handleMoveImage(image: Image) {
        throw new Error("Not implemented");
    }

    function pasteCharacter(character: Character) {
        throw new Error("Not implemented");
    }

    function handleDeleteFolder() {
        throw new Error("Not implemented");
    }

    return (
        <>
            {/*  folder header  */}
            {groupDND(({isDropping}) => (
                <div className={clsx("h-full w-full", {
                    "bg-primary-100": isDropping,
                })}>
                    <ContextMenu
                        id={getContextMenuId(ContextMenuNamespace.imageBrowser.list.folder, id)}
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
                                disabled: isRootGroup,
                            },
                            {
                                label: "delete",
                                handler: handleDeleteFolder,
                                disabled: isRootGroup,
                            }
                        ]}
                    >
                        <div
                            className={clsx("flex justify-between items-center px-2 py-1 cursor-pointer w-full select-none hover:bg-gray-100", {
                                "bg-gray-100 hover:bg-gray-200": open,
                                "bg-primary-100": isDropping,
                                "border-transparent": !focused,
                                "border-primary": focused && focused.strict,
                                "border-primary-100": focused && !focused.strict,
                            }, "border-[1px] group transition-colors", editor.constants.ui.animationDuration)}
                            onClick={triggerOpen}
                            onMouseDown={focus}
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
                                            value={currentName!}
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
                                            "italic text-gray-500": isRootGroup,
                                        })}>
                                    {currentName}
                                </span>
                                    )}
                            </div>
                            <div
                                className={clsx("text-gray-300 cursor-pointer hover:text-gray-400 hidden group-hover:block", {
                                    "hidden": isRenaming,
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

                        </div>
                    )}
                </div>
            ))}
        </>
    );
}
