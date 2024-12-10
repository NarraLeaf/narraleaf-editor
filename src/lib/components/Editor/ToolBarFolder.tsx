import React, { useEffect, useRef } from "react";
import { ToolBarFolder as Folder } from "@lib/editor/ToolBar";

export default function ToolBarFolder({
                                          folder,
                                      }: Readonly<{
    folder: Folder;
}>) {
    const [open, setOpen] = React.useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <>
            <div
                className={"h-fit p-3 round-md hover:bg-gray-200"}
                onClick={() => setOpen(!open)}
            >
                <div className={"flex items-center"}>
                    <div className={"text-xs"}>{folder.getName()}</div>
                </div>
            </div>

            {open && (
                <div className={"fixed p-4 mt-7 bg-gray-100"} ref={menuRef}>
                    <ul className={"flex flex-row"}>
                        {folder.getItems().map((item, i) => (
                            <li key={i}>
                                <div onClick={() => console.log("clicked", item)}>
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
