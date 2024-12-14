import {useEditor} from "@lib/providers/Editor";
import {HorizontalBox, VerticalBox} from "@lib/utils/components";
import {CharacterBrowserFolder} from "@lib/components/Editor/CharacterBrowser/CharacterBrowserFolder";
import {FolderPlusIcon} from "@heroicons/react/24/outline";

export function CharacterBrowser() {
    const editor = useEditor();

    const characterGroups = editor.getProject().getCharacterManager().entries();

    return (
        <>
            <VerticalBox
                className={"h-full w-full overflow-y-scroll"}
            >
                <HorizontalBox
                    className={"w-full h-6 place-content-between items-center"}
                >
                    <span className={"text-nowrap select-none p-2"}>
                        Characters
                    </span>
                    <div
                        className={"text-nowrap cursor-pointer hover:bg-gray-200 p-2"}
                    >
                        <FolderPlusIcon className={"h-4 w-4"}/>
                    </div>
                </HorizontalBox>
                {characterGroups.map(([name, group], index) => (
                    <CharacterBrowserFolder name={name} group={group} key={index}/>
                ))}
            </VerticalBox>
        </>
    );
}
