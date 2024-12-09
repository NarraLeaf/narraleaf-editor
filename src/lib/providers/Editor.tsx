import React from "react";
import {Editor} from "@lib/editor/editor";

type EditorContextType = Editor;

const context = React.createContext<EditorContextType | null>(null);

export function EditorProvider(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {
    const [editor] = React.useState(() => new Editor());

    return <context.Provider value={editor}>{children}</context.Provider>;
}

export function useEditor() {
    const editor = React.useContext(context);
    if (!editor) {
        throw new Error("useEditor must be used within a EditorProvider");
    }
    return editor;
}

