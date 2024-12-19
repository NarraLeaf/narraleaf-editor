import {RecursiveValue} from "@lib/components/type";


export const ContextMenuNamespace = {
    characterBrowser: {
        list: {
            character: "contextMenu.editor:characterBrowser.list.character",
            folder: "contextMenu.editor:characterBrowser.list.folder",
        }
    },
    treeBrowser: {
        list: {
            item: "contextMenu.editor:treeBrowser.list.item",
            group: "contextMenu.editor:treeBrowser.list.group",
        }
    },
} as const;

export function getContextMenuId(namespace: RecursiveValue<typeof ContextMenuNamespace, string>, ...suffixes: (string | number)[]): string {
    return namespace + suffixes ? `.${suffixes.join(".")}` : "";
}
