import {Character} from "@lib/editor/app/elements/character";
import React, {useEffect} from "react";
import {useEditor} from "@lib/providers/Editor";
import {HorizontalBox, useFlush, VerticalBox} from "@lib/utils/components";
import {PencilIcon} from "@heroicons/react/24/outline";
import {Editor} from "@/lib/editor/editor";

export default function CharacterPropertiesInspector(
    {
        character,
    }: Readonly<{
        character: Character;
    }>
) {
    const editor = useEditor();
    const [flush] = useFlush();
    const [isRenaming, setIsRenaming] = React.useState(false);
    const [currentName, setCurrentName] = React.useState<null | string>(null);

    useEffect(() => {
        return editor.GUIManger.onRequestMainContentFlush(flush).off;
    }, [...editor.GUIManger.deps]);

    useEffect(() => {
        return editor.onKeyPress(Editor.Keys.Escape, () => {
            if (isRenaming) {
                setIsRenaming(false);
                setCurrentName(null);
            }
        }).off;
    }, [isRenaming, ...editor.GUIManger.deps]);

    function handleStartRename() {
        setIsRenaming(true);
        setCurrentName(character.config.name);
    }

    function handleFinishRename() {
        setIsRenaming(false);
        if (
            currentName
            && currentName !== character.config.name
            && currentName.trim().length > 0
        ) {
            character.config.name = currentName;
            flush();
            editor.GUIManger.requestMainContentFlush();
        }
        setCurrentName(null);
    }

    return (
        <>
            <VerticalBox className={"h-full w-full p-4"}>
                <HorizontalBox className={"items-center"}>
                    {isRenaming ? (
                        <input
                            type={"text"}
                            value={currentName!}
                            onChange={(event) => setCurrentName(event.target.value)}
                            autoFocus
                            onBlur={handleFinishRename}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleFinishRename();
                                } else if (event.key === "Escape") {
                                    setCurrentName(null);
                                    setIsRenaming(false);
                                }
                            }}
                        />
                    ) : (
                        <span>
                            {character.config.name}
                        </span>
                    )}
                    <PencilIcon
                        className={"h-4 w-4 ml-1"}
                        onClick={handleStartRename}
                    />
                </HorizontalBox>
            </VerticalBox>
        </>
    );
}

