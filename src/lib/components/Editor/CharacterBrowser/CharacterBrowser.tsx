import {useEditor} from "@lib/providers/Editor";
import {VerticalBox} from "@lib/utils/components";
import {CharacterBrowserFolder} from "@lib/components/Editor/CharacterBrowser/CharacterBrowserFolder";

export function CharacterBrowser() {
    const editor = useEditor();

    const characterGroups = editor.getProject().getCharacterManager().entries();

    return (
        <>
            <VerticalBox
                className={"h-full w-full overflow-y-scroll"}
            >
                {characterGroups.map(([name, group], index) => (
                    <CharacterBrowserFolder name={name} group={group} key={index}/>
                ))}
            </VerticalBox>
        </>
    );
}
