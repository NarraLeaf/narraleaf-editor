import {useEditor} from "@lib/providers/Editor";
import {HorizontalBox, useFlush, VerticalBox} from "@lib/utils/components";
import {useEffect} from "react";
import {useFocus} from "@lib/components/Focus";
import clsx from "clsx";
import {FileBrowserFolder} from "@lib/components/Editor/FileBrowser/FileBrowserFolder";
import {Group} from "@lib/editor/app/tree";

export function FileBrowser(
    {}: Readonly<{}>
) {
    const editor = useEditor();
    const [flush] = useFlush();
    const [focused, focus, focusable] = useFocus(editor.focus);

    useEffect(() => {
        return editor.GUI.onRequestMainContentFlush(flush).off;
    }, [...editor.GUI.deps]);

    const rootFolder = editor.getProject().getImageManager().getRootGroup();

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
                    <HorizontalBox
                        className={"w-full h-6 place-content-between items-center"}
                    >
                        <span className={"text-nowrap select-none p-2"}>
                            Images
                        </span>
                        <FileBrowserFolder group={rootFolder} focusable={focusable} id={Group.getKey(rootFolder)}/>
                    </HorizontalBox>
                </VerticalBox>
            </div>
        </>
    );
}
