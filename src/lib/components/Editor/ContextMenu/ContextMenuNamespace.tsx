import {RecursiveValue} from "@lib/components/type";


export const ContextMenuNamespace = {
    characterBrowser: {
        list: {
            character: "contextMenu.editor:characterBrowser.list.character",
            folder: "contextMenu.editor:characterBrowser.list.folder",
        }
    },
    imageBrowser: {
        list: {
            image: "contextMenu.editor:imageBrowser.list.image",
            folder: "contextMenu.editor:imageBrowser.list.folder",
        }
    },
} as const;

export function getContextMenuId(namespace: RecursiveValue<typeof ContextMenuNamespace, string>, ...suffixes: (string | number)[]): string {
    return namespace + suffixes ? `.${suffixes.join(".")}` : "";
}
