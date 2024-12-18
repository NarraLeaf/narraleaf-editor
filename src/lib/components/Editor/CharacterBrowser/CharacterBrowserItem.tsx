import clsx from "clsx";
import React, {useEffect} from "react";
import {SideBarPosition} from "@lib/editor/app/SideBar";
import {Character} from "@lib/editor/app/game/elements/character";
import CharacterPropertiesInspector from "@lib/components/Editor/CharacterBrowser/CharacterPropertiesInspector";
import {useEditor} from "@/lib/providers/Editor";
import {useFlush} from "@lib/utils/components";
import {ContextMenu} from "../ContextMenu/ContextMenu";
import {Editor} from "@lib/editor/editor";
import {TabIndex} from "@lib/editor/app/GUIManager";
import {DndNamespace, useDndElement} from "../DNDControl/DNDControl";
import {ClipboardNamespace} from "@lib/editor/app/ClipboardManager";
import {Focusable} from "@lib/editor/app/focusable";
import {useFocus} from "@lib/components/Focus";

export default function CharacterBrowserItem(
    {
        character,
        onInspectCharacter,
        onRemoveCharacter,
        onPasteCharacter,
        id,
        isFolderDropping,
        focusable,
    }: Readonly<{
        character: Character;
        onInspectCharacter: (character: Character) => void;
        onRemoveCharacter: (character: Character) => void;
        onPasteCharacter: (character: Character) => void;
        id: string;
        isFolderDropping?: boolean;
        focusable: Focusable;
    }>
) {
    const editor = useEditor();
    const [flush, flushDep] = useFlush();
    const [isRenaming, setIsRenaming] = React.useState(false);
    const [currentName, setCurrentName] = React.useState<null | string>(null);
    const [focused, focus] = useFocus(focusable);
    const [dndElement, isDropping] = useDndElement(DndNamespace.characterBrowser.character, {
        character
    }, [flushDep]);

    const sideBar = editor.GUI.getSideBar(SideBarPosition.Bottom);
    const component =
        sideBar
            ?.getCurrent()
            ?.getComponent<{ character: Character }>();
    const selected =
        component?.type === CharacterPropertiesInspector && component.props.character === character;
    const canRename = character.canRename();
    const canDelete = character.canDelete();

    useEffect(() => {
        return editor.dependEvents([
            editor.GUI.onRequestMainContentFlush(flush),
            editor.GUI.onRequestClipboardFlush(flush),
        ]).off;
    }, [...editor.GUI.deps]);

    useEffect(() => {
        return editor.dependEvents([
            editor.onKeysPress(Editor.Keys.C, Editor.ModifierKeys.Ctrl, onlyFocused(handleCopyCharacter)),
            editor.onKeysPress(Editor.Keys.V, Editor.ModifierKeys.Ctrl, onlyFocused(handlePasteCharacter)),
            editor.onKeyPress(Editor.Keys.F2, onlyFocused(handleStartRename)),
        ]).off;
    }, [focused]);

    function handleStartRename() {
        if (canRename) {
            setIsRenaming(true);
            setCurrentName(character.config.name);
        }
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
            editor.GUI.requestMainContentFlush();
        }
        setCurrentName(null);
    }

    function handleCopyCharacter() {
        editor.getClipboard().copy(ClipboardNamespace.characterBrowser.character, character.copy());
    }

    function handlePasteCharacter() {
        const expected = [ClipboardNamespace.characterBrowser.character];
        if (editor.getClipboard().is(expected)) {
            const character = editor.getClipboard().paste(expected)!;
            onPasteCharacter(character);
        }
    }

    function onlyFocused(cb: (() => void)) {
        return () => {
            if (focused && focused.strict) {
                cb();
            }
        }
    }

    return (
        <ContextMenu
            id={id}
            items={[
                {
                    label: "copy",
                    handler: handleCopyCharacter,
                },
                {
                    label: "paste",
                    handler: handlePasteCharacter,
                    display: editor.getClipboard().is([ClipboardNamespace.characterBrowser.character]),
                },
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
            disabled={isDropping}
        >
            {dndElement(<div
                className={clsx("flex justify-between items-center cursor-pointer hover:bg-gray-100 py-0.5 pl-1 border", {
                    "bg-gray-200 hover:bg-gray-300": selected && !isFolderDropping,
                    "bg-primary-200": selected && isFolderDropping,
                    "bg-primary-100": isFolderDropping,
                    "border-transparent": !focused,
                    "border-primary": focused && focused.strict,
                    "border-primary-100": focused && !focused.strict,
                }, "transition-colors", editor.constants.ui.animationDuration)}
                onClick={() => onInspectCharacter(character)}
                onMouseDown={focus}
                tabIndex={TabIndex.MainContent}
                onContextMenu={e => e.preventDefault()}
            >
                {isRenaming ? (
                    <input
                        className={"w-full text-black bg-transparent border-b border-black outline-none outline-primary-100 focus:bg-white focus:outline-1"}
                        value={currentName!}
                        onChange={(event) => setCurrentName(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === Editor.Keys.Enter) {
                                handleFinishRename();
                            } else if (event.key === Editor.Keys.Escape) {
                                setIsRenaming(false);
                                setCurrentName(null);
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
            </div>)}
        </ContextMenu>
    );
}

