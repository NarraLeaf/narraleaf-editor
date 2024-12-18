import {ToolBarFolder, ToolBarGroup, ToolBarItem, ToolBarPosition} from "@lib/editor/app/ToolBar";

export const ToolBarGroups: {
    [K in string]: ToolBarGroup;
} = {
    "toolbar.editor:editor": new ToolBarGroup({
        folders: [
            new ToolBarFolder({
                name: "File",
                items: [
                    new ToolBarItem({
                        name: "New",
                        onClick: () => {
                            console.warn("Not implemented: New");
                        }
                    }),
                ],
            }),
            new ToolBarFolder({
                name: "Edit",
                items: [
                    new ToolBarItem({
                        name: "Undo",
                        onClick: () => {
                            console.warn("Not implemented: Undo");
                        }
                    }),
                    new ToolBarItem({
                        name: "Redo",
                        onClick: () => {
                            console.warn("Not implemented: Redo");
                        }
                    }),
                ],
            }),
        ],
        align: ToolBarPosition.Left,
    }),
    "toolbar.editor:project": new ToolBarGroup({
        folders: [
            new ToolBarFolder({
                name: "Project",
                items: [
                    new ToolBarItem({
                        name: "Build",
                        onClick: () => {
                            console.warn("Not implemented: Build");
                        }
                    }),
                ],
            }),
        ],
        align: ToolBarPosition.Right,
    }),
};