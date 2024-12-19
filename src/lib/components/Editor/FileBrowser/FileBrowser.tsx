import {useEditor} from "@lib/providers/Editor";
import {HorizontalBox, useFlush, VerticalBox} from "@lib/utils/components";
import {useEffect} from "react";
import {useFocus} from "@lib/components/Focus";
import clsx from "clsx";
import {FileBrowserFolder} from "@lib/components/Editor/FileBrowser/FileBrowserFolder";
import {Group, Item} from "@lib/editor/app/tree";
import {ValuesOnly} from "@lib/components/type";
import {IGUIEventContext} from "@lib/editor/type";
import {ClipboardContentType} from "@lib/editor/app/ClipboardManager";

type FileBrowserProps<T extends Item<any>> = {
    name: string;
    rootFolder: Group<T>;
    config: FileBrowserConfig<T>;
};

export enum FileBrowserEventType {
    Item,
    Group,
}

export type FileBrowserEventCtx<T extends Item<any>, Type extends FileBrowserEventType | null = null> =
    IGUIEventContext & (
    Type extends FileBrowserEventType.Item ? { type: FileBrowserEventType.Item; item: T; } :
        Type extends FileBrowserEventType.Group ? { type: FileBrowserEventType.Group; group: Group<T>; } :
            { type: FileBrowserEventType.Item; item: T; } | { type: FileBrowserEventType.Group; group: Group<T>; }
    );

type FileBrowserEventHandler<T extends Item<any>> = (ctx: FileBrowserEventCtx<T>) => void;

export type NamespaceOnly<T> = ValuesOnly<ClipboardContentType, T>;

export type FileBrowserConfig<T extends Item<any>> = {
    autoFocus?: boolean;
    onSelectItem?: FileBrowserEventHandler<T>;
    onDeleteItem?: FileBrowserEventHandler<T>;
    onRenameItem?: FileBrowserEventHandler<T>;
    handleCreateItem?: FileBrowserEventHandler<T>;
    folderContextMenu?: FileBrowserContextMenuConfig<T>[];
    itemContextMenu?: FileBrowserContextMenuConfig<T>[];
    groupClipboardId: NamespaceOnly<Group<any>>;
    itemClipboardId: NamespaceOnly<Item<any>>;
    isSelected: (item: T) => boolean;
};

export type FileBrowserContextMenuConfig<T extends Item<any>> = {
    label: string;
    handler: FileBrowserEventHandler<T>;
    disabled?: boolean;
    display?: boolean;
};

export function FileBrowser<T extends Item<any>>(
    {
        name,
        rootFolder,
        config,
    }: Readonly<FileBrowserProps<T>>
) {
    const editor = useEditor();
    const [flush] = useFlush();
    const [focused, focus, focusable] = useFocus(editor.focus);

    useEffect(() => {
        return editor.GUI.onRequestMainContentFlush(flush).off;
    }, [...editor.GUI.deps]);

    return (
        <>
            <div
                className={clsx("w-full h-full relative overflow-y-scroll overflow-x-hidden border-[1px]", {
                    "border-transparent": !focused,
                    "border-primary": focused && focused.strict,
                    "border-primary-100": focused && !focused.strict,
                }, "transition-colors", editor.constants.ui.animationDuration)}
                onMouseDown={focus}
            >
                <VerticalBox
                    className={"h-full w-full absolute bg-gray-50"}
                >
                    <span className={"text-nowrap select-none p-2"}>
                            {name}
                        </span>
                    <HorizontalBox
                        className={"w-full h-6 place-content-between items-center"}
                    >
                        <FileBrowserFolder
                            group={rootFolder}
                            focusable={focusable}
                            id={`(${name})` + Group.getKey(rootFolder)}
                            {...config}
                        />
                    </HorizontalBox>
                </VerticalBox>
            </div>
        </>
    );
}
