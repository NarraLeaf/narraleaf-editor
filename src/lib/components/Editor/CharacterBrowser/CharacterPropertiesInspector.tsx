import { Character } from "@lib/editor/app/elements/character";
import {useEffect} from "react";
import {useEditor} from "@lib/providers/Editor";
import {useFlush} from "@lib/utils/components";

export default function CharacterPropertiesInspector(
    {
        character,
    }: Readonly<{
        character: Character;
    }>
) {
    const editor = useEditor();
    const flush = useFlush();

    useEffect(() => {
        return editor.GUIManger.onRequestMainContentFlush(flush).off;
    }, [...editor.GUIManger.deps]);

    return (
        <>
            <span>{character.config.name}</span>
        </>
    );
}

