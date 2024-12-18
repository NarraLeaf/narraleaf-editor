import {Character} from "@lib/editor/app/game/elements/character";
import {RecursiveValue} from "@lib/components/type";
import {Editor} from "@lib/editor/editor";

export const ClipboardNamespace = {
    characterBrowser: {
        character: "clipboard.editor:characterBrowser.character",
    }
} as const;

type ClipboardContentType = {
    "clipboard.editor:characterBrowser.character": Character;
};

type ClipboardContent = {
    type: RecursiveValue<typeof ClipboardNamespace, string>;
    data: unknown;
};

export class ClipboardManager {
    private content: ClipboardContent | null = null;

    constructor(private editor: Editor) {
    }

    copy<T extends RecursiveValue<typeof ClipboardNamespace, string>>(type: T, data: ClipboardContentType[T]): this {
        this.content = {
            type,
            data,
        };
        this.editor.GUI.requestClipboardFlush();
        return this;
    }

    is<T extends RecursiveValue<typeof ClipboardNamespace, string>>(types: T[]): boolean {
        return this.content !== null && types.includes(this.content.type as T);
    }

    paste<T extends RecursiveValue<typeof ClipboardNamespace, string>>(expected: T[]): ClipboardContentType[T] | null {
        if (this.content === null) {
            return null;
        }

        if (expected.includes(this.content.type as T)) {
            return this.content.data as ClipboardContentType[T];
        }

        return null;
    }
}
