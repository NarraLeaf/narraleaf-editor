import React from "react";
import type {ContextMenuProps, ContextMenuTriggerProps, MenuItemProps} from "react-contextmenu";
import {
    ContextMenu as ContextMenu$,
    ContextMenuTrigger as ContextMenuTrigger$,
    MenuItem as MenuItem$
} from "react-contextmenu";
import {Editor} from "@lib/editor/editor";
import {IGUIEventContext} from "@lib/editor/type";
import {useEditor} from "@lib/providers/Editor";
import clsx from "clsx";

type EditorContextMenuItem = {
    label: string;
    handler: (ctx: IGUIEventContext) => void;
    disabled?: boolean;
};
type EditorContextMenuProps = {
    children?: React.ReactNode;
    id: string;
    disabled?: boolean;
    items?: EditorContextMenuItem[];
};

type ForwardChildrenProps<T> = {
    children: React.ReactNode;
} & T;



const ContextMenuTrigger: React.ComponentType<ForwardChildrenProps<ContextMenuTriggerProps>> =
    ContextMenuTrigger$ as any;
const ContextMenu: React.ComponentType<ForwardChildrenProps<ContextMenuProps>> = ContextMenu$ as any;
const MenuItem: React.ComponentType<ForwardChildrenProps<MenuItemProps>> = MenuItem$ as any;

const EditorContextMenu = function (
    {
        children,
        id,
        disabled,
        items = [],
    }: EditorContextMenuProps
) {
    const editor = useEditor();
    const elementId = `${Editor.Constants.ContextMenuPrefix}-${id}`;

    return (
        <>
            <ContextMenuTrigger id={elementId} disable={disabled}>
                {children}
            </ContextMenuTrigger>
            <ContextMenu id={elementId} className={"min-w-[200px] bg-white shadow-md drop-shadow-md"}>
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        <MenuItem
                            onClick={() => item.handler(Editor.getCtx(editor))}
                            className={clsx("cursor-pointer bg-white hover:bg-gray-100 p-1 select-none", {
                                "text-gray-400": item.disabled,
                            })}
                            disabled={item.disabled}
                        >
                            {item.label}
                        </MenuItem>
                    </React.Fragment>
                ))}
            </ContextMenu>
        </>
    );
}
EditorContextMenu.displayName = "ContextMenu";

export {
    EditorContextMenu as ContextMenu,
}
