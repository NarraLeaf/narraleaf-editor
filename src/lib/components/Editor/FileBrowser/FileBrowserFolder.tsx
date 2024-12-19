import React, {useEffect} from "react";
import clsx from "clsx";
import {useEditor} from "@lib/providers/Editor";
import {ChevronDownIcon, ChevronRightIcon, FolderPlusIcon} from "@heroicons/react/24/outline";
import {HorizontalBox, useClipboard, useFlush} from "@lib/utils/components";
import {Editor} from "@lib/editor/editor";
import {TabIndex} from "@lib/editor/app/GUIManager";
import {ContextMenuNamespace, getContextMenuId} from "@lib/components/Editor/ContextMenu/ContextMenuNamespace";
import {ContextMenu, EditorContextMenuItem} from "@lib/components/Editor/ContextMenu/ContextMenu";
import {DndNamespace, useDndElement, useDndGroup} from "@lib/components/Editor/DNDControl/DNDControl";
import {useFocus} from "@lib/components/Focus";
import {Focusable} from "@lib/editor/app/focusable";
import {Group, Item} from "@lib/editor/app/tree";
import {
    FileBrowserConfig,
    FileBrowserEventCtx,
    FileBrowserEventType
} from "@lib/components/Editor/FileBrowser/FileBrowser";
import {IGUIEventContext} from "@lib/editor/type";
import FileBrowserItem from "@lib/components/Editor/FileBrowser/FileBrowserItem";

type FileBrowserGroupConfig = {
    id: string;
    group: Group<any>,
    focusable: Focusable,
};

export function FileBrowserFolder<T extends Item<any>>(
    props: Readonly<FileBrowserGroupConfig & FileBrowserConfig<T>>
) {
    const {
        id,
        focusable,
        group,
        folderContextMenu = [],
        groupClipboardId,
        itemClipboardId,
        handleCreateItem,
        onDeleteItem,
        onRenameItem
    } = props;

    const editor = useEditor();
    const [flush, flushDep] = useFlush();
    const [open, setOpen] = React.useState(false);
    const [isRenaming, setIsRenaming] = React.useState(false);
    const [currentName, setCurrentName] = React.useState<string | null>(null);
    const [focused, focus, folderFocusable] = useFocus(focusable);
    const [clipboard] = useClipboard();
    const [groupDND] = useDndGroup(DndNamespace.fileBrowser.item, ({item, lastParent}) => {
        handleMoveItem(item, lastParent);
    }, [flushDep]);
    const [dndElement, isDragging] = useDndElement(DndNamespace.fileBrowser.item, {
        item: group,
        lastParent: group.getParent() || undefined,
    }, [flushDep]);


    const imageManager = editor.getProject().getImageManager();
    const isRootGroup = imageManager.isRootGroup(group);

    useEffect(() => {
        return editor.dependEvents([
            editor.GUI.onRequestMainContentFlush(flush),
        ]).off;
    }, [...editor.GUI.deps]);

    useEffect(() => {
        return editor.dependEvents([
            editor.onKeysPress(Editor.Keys.C, Editor.ModifierKeys.Ctrl, onlyFocused(handleCopy)),
            editor.onKeysPress(Editor.Keys.V, Editor.ModifierKeys.Ctrl, onlyFocused(handlePaste)),
            editor.onKeyPress(Editor.Keys.F2, onlyFocused(handleStartRename)),
        ]).off;
    }, [focused]);

    function triggerOpen() {
        setOpen(!open);
    }

    function handleMoveItem(item: Group<Item<any>> | Item<any>, lastParent?: Group<Item<any>>) {
        if (group === lastParent) {
            return;
        }
        if (lastParent) {
            if (Group.isGroup(item)) {
                lastParent.removeGroup(item);
            } else {
                lastParent.removeItem(item);
            }
        }
        if (Group.isGroup(item)) {
            group.addGroup(item);
        } else {
            group.addItem(item);
        }
        setOpen(true);
        editor.GUI.requestMainContentFlush();
    }

    function handleStartRename() {
        if (!isRootGroup) {
            setIsRenaming(true);
            setOpen(true);
            setCurrentName(group.getName());
        }
    }

    function handleFinishRename() {
        setIsRenaming(false);
        if (currentName && currentName !== group.getName() && currentName.trim().length > 0) {
            const newName = currentName.trim();
            group.setName(newName);

            onRenameItem?.(getCtx(Editor.getCtx(editor)));
            editor.GUI.requestMainContentFlush();
        }
        setCurrentName(null);
    }

    function handlePaste() {
        if (!clipboard.is([groupClipboardId, itemClipboardId])) {
            return;
        }
        const content = clipboard.paste([groupClipboardId, itemClipboardId])!;
        if (Group.isGroup(content)) {
            group.addGroup(content.copy().setName(
                group.newName(content.getName() + "(copy)")
            ));
        } else {
            group.addItem(content.copy().setName(
                group.newName(content.getName() + "(copy)")
            ));
        }
        setOpen(true);
        editor.GUI.requestMainContentFlush();
    }

    function handleCopy() {
        clipboard.copy(groupClipboardId, group.copy());
    }

    function handleCreate() {
        handleCreateItem?.(getCtx(Editor.getCtx(editor)));
        setOpen(true);
        editor.GUI.requestMainContentFlush();
    }

    function handleDeleteGroup(ctx: IGUIEventContext) {
        group.getParent()?.removeGroup(group);
        onDeleteItem?.(getCtx(ctx));
        editor.GUI.requestMainContentFlush();
    }

    function handleCreateGroup() {
        const newGroup = new Group<T>(group.newName("New Folder"));
        group.addGroup(newGroup);
        setOpen(true);
        editor.GUI.requestMainContentFlush();
    }

    function getCtx(ctx: IGUIEventContext): FileBrowserEventCtx<T, FileBrowserEventType.Group> {
        return {
            ...ctx,
            type: FileBrowserEventType.Group,
            group: group,
        };
    }

    function onlyFocused(cb: (() => void)) {
        return () => {
            if (focused && focused.strict) {
                cb();
            }
        }
    }

    return (
        <>
            {/*  folder header  */}
            {groupDND(({isDropping}) => (
                <div className={clsx("h-full w-full", {
                    "bg-primary-100": isDropping,
                })}>
                    <ContextMenu
                        id={getContextMenuId(ContextMenuNamespace.treeBrowser.list.group, id)}
                        items={[
                            ...(folderContextMenu.map((item) => ({
                                ...item,
                                handler: (_, ctx) =>
                                    item.handler(getCtx(ctx)),
                            }) satisfies EditorContextMenuItem)),
                            {
                                label: "copy",
                                handler: handleCopy,
                            },
                            {
                                label: "paste",
                                handler: handlePaste,
                                display: clipboard.is([groupClipboardId, itemClipboardId]),
                            },
                            {
                                label: "rename",
                                handler: handleStartRename,
                                disabled: !group.config.canRename,
                            },
                            {
                                label: "delete",
                                handler: (_, ctx) => handleDeleteGroup(ctx),
                                disabled: !group.config.canDelete,
                            }
                        ]}
                        disabled={isDragging}
                    >
                        {dndElement(<div
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
                                            className={"w-full text-black bg-transparent border-b border-black outline-none outline-primary-100 focus:bg-white focus:outline-1"}
                                        />
                                    )
                                    : (
                                        <span className={clsx({
                                            "italic text-gray-500": isRootGroup,
                                        })}>
                                    {group.getName()}
                                </span>
                                    )}
                            </div>
                            <HorizontalBox className={"items-center space-x-1"}>
                                <div
                                    className={clsx("text-gray-300 cursor-pointer hover:text-gray-400 hidden group-hover:block", {
                                        "hidden": isRenaming,
                                    })}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleCreate();
                                    }}
                                >{"+"}</div>
                                <div
                                    className={clsx("text-gray-300 cursor-pointer hover:text-gray-400 hidden group-hover:block", {
                                        "hidden": isRenaming,
                                    })}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleCreateGroup();
                                    }}
                                ><FolderPlusIcon className={"w-4 h-4"}/></div>
                            </HorizontalBox>
                        </div>)}
                    </ContextMenu>

                    {/*  folder content  */}
                    {open && (
                        <div className="pl-2">
                            {group.toChildren().map(child => {
                                if (Group.isGroup(child)) {
                                    return (
                                        <FileBrowserFolder
                                            key={child.getName()}
                                            {...props}
                                            id={`${id}/[${child.getName()}]`}
                                            group={child}
                                            focusable={folderFocusable}
                                        />
                                    );
                                } else {
                                    return (
                                        <FileBrowserItem
                                            key={child.getName()}
                                            {...props}
                                            id={`${id}`}
                                            isFolderDropping={isDropping}
                                            focusable={folderFocusable}
                                            item={child}
                                            group={group}
                                        />
                                    );
                                }
                            })}
                        </div>
                    )}
                </div>
            ))}
        </>
    );
}
