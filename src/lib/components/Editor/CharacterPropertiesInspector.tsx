import { Character } from "@/lib/editor/app/elements/character";

export default function CharacterPropertiesInspector(
    {
        character,
    }: Readonly<{
        character: Character;
    }>
) {
    return (
        <>
            <span>{character.config.name}</span>
        </>
    );
}

