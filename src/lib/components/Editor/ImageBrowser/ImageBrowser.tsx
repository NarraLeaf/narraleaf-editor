import {FileBrowser, FileBrowserEventType} from "@lib/components/Editor/FileBrowser/FileBrowser";
import {useEditor} from "@lib/providers/Editor";
import {ClipboardNamespace} from "@lib/editor/app/ClipboardManager";
import {SideBarPosition} from "@lib/editor/app/SideBar";
import {ImagePropertyInspector} from "@lib/components/Editor/ImageBrowser/ImagePropertyInspector";
import {SideBarItemsKeys} from "@lib/components/Editor/SideBar/SideBarItemsRegistry";
import React from "react";
import {ImageManager} from "@lib/editor/app/imageManager";
import {Group, Item} from "@lib/editor/app/tree";
import {Image} from "@lib/editor/app/game/elements/image";

export function ImageBrowser() {
    const editor = useEditor();

    function isInspectingImage(image: Image) {
        const sideBar = editor.GUI.getSideBar(SideBarPosition.Bottom);
        const currentComponent = sideBar?.getCurrent()?.getComponent();
        return !!(sideBar?.isCurrentComponent(ImagePropertyInspector)
            && currentComponent?.props.image === image);
    }

    function inspectImage(image: Image) {
        editor.GUI
            .getSideBar(SideBarPosition.Bottom)
            ?.get(SideBarItemsKeys.properties)
            ?.setComponent(
                <ImagePropertyInspector image={image}/>
            );
        editor.GUI
            .getSideBar(SideBarPosition.Bottom)
            ?.setCurrent(SideBarItemsKeys.properties);
        editor.GUI
            .requestSideBarFlush();
    }

    function clearImageInspector() {
        editor.GUI
            .getSideBar(SideBarPosition.Bottom)
            ?.get(SideBarItemsKeys.properties)
            ?.resetComponent();
        editor.GUI
            .getSideBar(SideBarPosition.Bottom)
            ?.setCurrent(null);
        editor.GUI
            .requestSideBarFlush();
    }

    function createImage(group: Group<Item<Image>>) {
        const newName = group.newName("New Image");
        const newImage = ImageManager.createImage(newName);
        group.addItem(new Item<Image>(newName, newImage));
        inspectImage(newImage);
    }

    return (
        <>
            <FileBrowser
                name={"Images"}
                rootFolder={editor.getProject().getImageManager().getRootGroup()}
                config={{
                    groupClipboardId: ClipboardNamespace.imageBrowser.imageGroup,
                    itemClipboardId: ClipboardNamespace.imageBrowser.imageItem,
                    isSelected: (item) => {
                        return isInspectingImage(item.getContent());
                    },
                    onSelectItem: (ctx) => {
                        if (ctx.type === FileBrowserEventType.Item) {
                            inspectImage(ctx.item.getContent());
                        }
                    },
                    onDeleteItem: (ctx) => {
                        if (ctx.type === FileBrowserEventType.Item) {
                            if (isInspectingImage(ctx.item.getContent())) {
                                clearImageInspector();
                            }
                        }
                    },
                    handleCreateItem: (ctx) => {
                        if (ctx.type === FileBrowserEventType.Group) {
                            createImage(ctx.group);
                        }
                    },
                    itemContextMenu: [
                        {
                            label: "Inspect",
                            handler: (ctx) => {
                                if (ctx.type === FileBrowserEventType.Item) {
                                    inspectImage(ctx.item.getContent());
                                    ctx.editor.GUI.requestMainContentFlush();
                                }
                            }
                        },
                    ],
                    folderContextMenu: [
                        {
                            label: "Create Image",
                            handler: (ctx) => {
                                if (ctx.type === FileBrowserEventType.Group) {
                                    createImage(ctx.group);
                                    ctx.editor.GUI.requestMainContentFlush();
                                }
                            }
                        }
                    ],
                }}
            />
        </>
    );
}