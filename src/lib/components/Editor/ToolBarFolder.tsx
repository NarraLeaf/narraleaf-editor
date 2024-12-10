import React, {useEffect, useRef} from "react";
import {ToolBarFolder as Folder, ToolBarItem} from "@lib/editor/ToolBar";
import {useEditor} from "@lib/providers/Editor";
import {Editor} from "@lib/editor/editor";

export default function ToolBarFolder({
                                          folder,
                                      }: Readonly<{
    folder: Folder;
}>) {
    const [open, setOpen] = React.useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const editor = useEditor();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current
                && !menuRef.current.contains(event.target as Node)
                && buttonRef.current
                && !buttonRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        return editor.onKeyPress(Editor.Keys.Escape, () => {
            setOpen(false);
        }).off;
    }, [editor]);

    useEffect(() => {
        if (open && menuRef.current) {
            const menuRect = menuRef.current.getBoundingClientRect();
            if (menuRect.right > window.innerWidth) {
                menuRef.current.style.right = "0";
                menuRef.current.style.left = "auto";
            } else {
                menuRef.current.style.right = "auto";
                menuRef.current.style.left = "";
            }
        }
    }, [open]);

    function handleItemClick(item: ToolBarItem) {
        item.onClick();
        setOpen(false);
    }

    function handleMouseDown() {
        if (open) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }

    function handleMouseUp(event: React.MouseEvent) {
        if (menuRef.current) {
            const items = menuRef.current.querySelectorAll("li");
            items.forEach((item, index) => {
                const rect = item.getBoundingClientRect();
                if (event.clientY >= rect.top && event.clientY <= rect.bottom) {
                    handleItemClick(folder.getItems()[index]);
                }
            });
        }
    }

    return (
        <>
            <div
                className={"h-fit p-1 round-md hover:bg-gray-200 mx-1 px-2"}
                onMouseDown={handleMouseDown}
                ref={buttonRef}
            >
                <div className={"flex items-center"}>
                    <div className={"text-xs"}>{folder.getName()}</div>
                </div>
            </div>

            {open && (
                <div className={"fixed mt-8 bg-gray-100 w-64"} ref={menuRef}>
                    <ul
                        className={"flex flex-col"}
                        onMouseUp={handleMouseUp}
                    >
                        {folder.getItems().map((item, i) => (
                            <li
                                key={i}
                                className={"p-1 hover:bg-gray-200"}
                                onClick={() => handleItemClick(item)}
                            >
                                <div>
                                    {item.getName()}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}