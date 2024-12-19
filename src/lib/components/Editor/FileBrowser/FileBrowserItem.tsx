import clsx from "clsx";
import React, {useEffect} from "react";
import {useEditor} from "@/lib/providers/Editor";
import {useClipboard, useFlush} from "@lib/utils/components";
import {ContextMenu, EditorContextMenuItem} from "../ContextMenu/ContextMenu";
import {Editor} from "@lib/editor/editor";
import {TabIndex} from "@lib/editor/app/GUIManager";
import {DndNamespace, useDndElement} from "../DNDControl/DNDControl";
import {Focusable} from "@lib/editor/app/focusable";
import {useFocus} from "@lib/components/Focus";
import {Group, Item} from "@lib/editor/app/tree";
import {
    FileBrowserConfig,
    FileBrowserEventCtx,
    FileBrowserEventType
} from "@lib/components/Editor/FileBrowser/FileBrowser";
import {IGUIEventContext} from "@lib/editor/type";

export default function FileBrowserItem<T extends Item<any>>(
    {
        id,
        isFolderDropping,
        focusable,
        item,
        group,
        itemContextMenu = [],
        itemClipboardId,
        groupClipboardId,
        isSelected,
        onSelectItem,
        onDeleteItem,
    }: Readonly<{
        id: string;
        isFolderDropping?: boolean;
        focusable: Focusable;
        item: T,
        group: Group<T>,
    } & FileBrowserConfig<T>>
) {
    const editor = useEditor();
    const [flush, flushDep] = useFlush();
    const [isRenaming, setIsRenaming] = React.useState(false);
    const [currentName, setCurrentName] = React.useState<null | string>(null);
    const [focused, focus] = useFocus(focusable);
    const [clipboard] = useClipboard();
    const [dndElement, isDropping] = useDndElement(DndNamespace.fileBrowser.item, {
        item,
        lastParent: group,
    }, [flushDep]);

    const selected = isSelected(item);
    const canRename = item.canRename();
    const canDelete = item.canDelete();

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

    function handleFinishRename() {
        setIsRenaming(false);
        if (
            currentName
            && currentName !== item.getName()
            && currentName.trim().length > 0
        ) {
            item.setName(currentName);
            flush();
            editor.GUI.requestMainContentFlush();
        }
        setCurrentName(null);
    }

    function handleStartRename() {
        if (canRename) {
            setIsRenaming(true);
            setCurrentName(item.getName());
        }
    }

    function handleCopy() {
        clipboard.copy(itemClipboardId, item.copy());
    }

    function handlePaste() {
        if (!clipboard.is([itemClipboardId, groupClipboardId])) {
            return;
        }
        const content = clipboard.paste([itemClipboardId, groupClipboardId])!;
        if (Item.isItem(content)) {
            group.addItem(content.copy().setName(
                group.newName(content.getName() + "(copy)")
            ) as T);
        } else {
            group.addGroup(content.copy().setName(
                group.newName(content.getName() + "(copy)")
            ) as Group<T>);
        }
        editor.GUI.requestMainContentFlush();
    }

    function onlyFocused(cb: (() => void)) {
        return () => {
            if (focused && focused.strict) {
                cb();
            }
        }
    }

    function handleSelectItem(ctx: IGUIEventContext) {
        onSelectItem?.(getCtx(ctx));
        editor.GUI.requestMainContentFlush();
    }

    function getCtx(ctx: IGUIEventContext): FileBrowserEventCtx<T, FileBrowserEventType.Item> {
        return {
            ...ctx,
            type: FileBrowserEventType.Item,
            item: item,
        };
    }

    function handleDelete(ctx: IGUIEventContext) {
        group.removeItem(item);
        onDeleteItem?.(getCtx(ctx));
        editor.GUI.requestMainContentFlush();
    }

    return (
        <ContextMenu
            id={id + `/${item.getName()}`}
            items={[
                ...(itemContextMenu.map((item) => ({
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
                    display: clipboard.is([itemClipboardId]),
                },
                {
                    label: "rename",
                    handler: handleStartRename,
                    disabled: !canRename,
                },
                {
                    label: "delete",
                    handler: (_, ctx) => handleDelete(ctx),
                    disabled: !canDelete,
                }
            ]}
            disabled={isDropping}
        >
            {dndElement(<div
                className={clsx("flex justify-between items-center cursor-pointer hover:bg-gray-100 py-0.5 pl-1 border", {
                    "bg-gray-200 hover:bg-gray-300": selected && !isFolderDropping,
                    "bg-primary-200": selected && isFolderDropping,
                    "bg-primary-100": isFolderDropping,
                    "border-transparent": !focused,
                    "border-primary": focused && focused.strict,
                    "border-primary-100": focused && !focused.strict,
                }, "transition-colors", editor.constants.ui.animationDuration)}
                onClick={() => handleSelectItem(Editor.getCtx(editor))}
                onMouseDown={focus}
                tabIndex={TabIndex.MainContent}
                onContextMenu={e => e.preventDefault()}
            >
                {isRenaming ? (
                    <input
                        className={"w-full text-black bg-transparent border-b border-black outline-none outline-primary-100 focus:bg-white focus:outline-1"}
                        value={currentName!}
                        onChange={(event) => setCurrentName(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === Editor.Keys.Enter) {
                                handleFinishRename();
                            } else if (event.key === Editor.Keys.Escape) {
                                setIsRenaming(false);
                                setCurrentName(null);
                            }
                        }}
                        onBlur={handleFinishRename}
                        autoFocus
                    />
                ) : (
                    <span
                        className={clsx("select-none font-extralight", {
                            "font-medium": selected,
                            "italic text-gray-400": canDelete,
                            "text-black": canDelete,
                        })}
                        onDoubleClick={handleStartRename}
                    >
                        {item.getName()}
                    </span>
                )}
            </div>)}
        </ContextMenu>
    );
}

