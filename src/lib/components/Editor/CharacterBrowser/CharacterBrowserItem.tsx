import clsx from "clsx";
import React from "react";
import {SideBarPosition} from "@lib/editor/SideBar";
import {Character} from "@lib/editor/app/elements/character";
import CharacterPropertiesInspector from "@lib/components/Editor/CharacterBrowser/CharacterPropertiesInspector";
import {useEditor} from "@/lib/providers/Editor";
import {useFlush} from "@lib/utils/components";
import {ContextMenu} from "../ContextMenu/ContextMenu";
import {Editor} from "@lib/editor/editor";
import {TabIndex} from "@lib/editor/GUIManager";

export default function CharacterBrowserItem(
    {
        character,
        onInspectCharacter,
        onRemoveCharacter,
        id,
    }: Readonly<{
        character: Character;
        onInspectCharacter: (character: Character) => void;
        onRemoveCharacter: (character: Character) => void;
        id: string;
    }>
) {
    const editor = useEditor();
    const [isRenaming, setIsRenaming] = React.useState(false);
    const [currentName, setCurrentName] = React.useState(character.config.name);
    const flush = useFlush();
    const sideBar = editor.GUIManger.getSideBar(SideBarPosition.Bottom);
    const component =
        sideBar
            ?.getCurrent()
            ?.getComponent<{ character: Character }>();
    const selected =
        component?.type === CharacterPropertiesInspector && component.props.character === character;
    const canRename = !character.config.isNarrator;
    const canDelete = !character.config.isNarrator;

    function handleStartRename() {
        if (canRename) {
            setIsRenaming(true);
            setCurrentName(character.config.name);
        }
    }

    function handleFinishRename() {
        setIsRenaming(false);
        if (
            currentName !== character.config.name
            && currentName.trim().length > 0
        ) {
            character.config.name = currentName;
            flush();
            editor.GUIManger.requestMainContentFlush();
        }
    }

    return (
        <ContextMenu
            id={id}
            items={[
                {
                    label: "rename",
                    handler: handleStartRename,
                    disabled: !canRename,
                },
                {
                    label: "delete",
                    handler: () => onRemoveCharacter(character),
                    disabled: !canDelete,
                }
            ]}
        >
            <div
                className={clsx("flex justify-between items-center cursor-pointer hover:bg-gray-100 py-0.5 pl-1 border focus:border-primary-400 border-transparent", {
                    "bg-gray-200 hover:bg-gray-300": selected,
                })}
                onClick={() => onInspectCharacter(character)}
                tabIndex={TabIndex.MainContent}
            >
                {isRenaming ? (
                    <input
                        className={"w-full text-black bg-transparent border-b border-black"}
                        value={currentName}
                        onChange={(event) => setCurrentName(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === Editor.Keys.Enter) {
                                handleFinishRename();
                            }
                        }}
                        onBlur={handleFinishRename}
                        autoFocus
                    />
                ) : (
                    <span
                        className={clsx("select-none font-extralight", {
                            "font-medium": selected,
                            "italic text-gray-400": character.config.isNarrator,
                            "text-black": !character.config.isNarrator,
                        })}
                        onDoubleClick={handleStartRename}
                    >
                        {character.config.name}
                    </span>
                )}
            </div>
        </ContextMenu>
    );
}

