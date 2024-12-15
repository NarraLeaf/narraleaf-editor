import {Editor} from "@lib/editor/editor";

export type EditorEventToken = {
    off: () => void;
};

export interface IGUIEventContext {
    editor: Editor;
}