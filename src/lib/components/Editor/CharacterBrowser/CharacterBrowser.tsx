import {useEditor} from "@lib/providers/Editor";
import {HorizontalBox, useFlush, VerticalBox} from "@lib/utils/components";
import {CharacterBrowserFolder} from "@lib/components/Editor/CharacterBrowser/CharacterBrowserFolder";
import {FolderPlusIcon} from "@heroicons/react/24/outline";
import {useEffect} from "react";

export function CharacterBrowser() {
    const editor = useEditor();
    const [flush] = useFlush();

    useEffect(() => {
        return editor.GUI.onRequestMainContentFlush(flush).off;
    }, [...editor.GUI.deps]);

    const characterManager = editor.getProject().getCharacterManager();
    const characterGroups = characterManager.entries();

    function handleAddGroup() {
        characterManager.addGroup(characterManager.newName("New Group"));
        flush();
    }

    return (
        <>
            <div className={"w-full h-full relative overflow-y-scroll overflow-x-hidden"}>
                <VerticalBox
                    className={"h-full w-full absolute bg-gray-50"}
                >
                    <HorizontalBox
                        className={"w-full h-6 place-content-between items-center"}
                    >
                    <span className={"text-nowrap select-none p-2"}>
                        Characters
                    </span>
                        <div
                            className={"text-nowrap cursor-pointer hover:bg-gray-200 p-2"}
                            onClick={handleAddGroup}
                        >
                            <FolderPlusIcon className={"h-4 w-4"}/>
                        </div>
                    </HorizontalBox>
                    {characterGroups.map(([name, group], index) => (
                        <CharacterBrowserFolder
                            id={index}
                            name={name}
                            group={group}
                            key={name}
                            onGroupRename={(newName) => {
                                characterManager.renameGroup(name, newName);
                                flush();
                            }}
                        />
                    ))}
                </VerticalBox>
            </div>
        </>
    );
}
