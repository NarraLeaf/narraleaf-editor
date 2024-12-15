

export const ContextMenuNamespace = {
    characterInspector: {
        list: {
            character: "contextMenu.editor:characterInspector.list.character",
            folder: "contextMenu.editor:characterInspector.list.folder",
        }
    }
} as const;

export function getContextMenuId(namespace: string, ...suffixes: (string | number)[]): string {
    return namespace + suffixes ? `.${suffixes.join(".")}` : "";
}
