import {RecursiveValue} from "@lib/components/type";
import {Character} from "@lib/editor/app/game/elements/character";
import React, {useEffect} from "react";
import DNDGroup from "@lib/components/Editor/DNDControl/DNDGroup";
import {DNDElement} from "@lib/components/Editor/DNDControl/DNDElement";
import {DndProvider as ReactDndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {useFlush} from "@lib/utils/components";
import {Image} from "@lib/editor/app/game/elements/image";
import {Group, Item} from "@lib/editor/app/tree";


export const DndNamespace = {
    characterBrowser: {
        character: "dnd.editor:characterBrowser.character",
    },
    imageBrowser: {
        image: "dnd.editor:imageBrowser.image",
    },
    fileBrowser: {
        item: "dnd.editor:fileBrowser.item",
    },
} as const;

type DndControlContentType = {
    "dnd.editor:characterBrowser.character": {
        character: Character;
    },
    "dnd.editor:imageBrowser.image": {
        image: Image;
    },
    "dnd.editor:fileBrowser.item": {
        item: Item<any> | Group<Item<any>>;
        lastParent?: Group<Item<any>>;
    },
};

type ChildrenRenderHandler<T extends unknown[], U extends string | React.JSXElementConstructor<any> = any> =
    (...args: T) => React.ReactElement<any, U>;
type ChildrenRendererInput<T extends unknown[], U extends string | React.JSXElementConstructor<any> = any> =
    React.ReactElement | ChildrenRenderHandler<T, U>;
type ChildrenRenderer<T extends unknown[], U extends string | React.JSXElementConstructor<any> = any> =
    (children: ChildrenRendererInput<T, U>) => React.ReactElement<any, U>;


type GroupChildrenRendererArgs = [
    {
        isDropping: boolean;
    }
];

export function useDndGroup<T extends RecursiveValue<typeof DndNamespace, string>>(
    type: T,
    onDrop: (item: DndControlContentType[T]) => void,
    deps?: React.DependencyList,
    id?: string
): [ChildrenRenderer<GroupChildrenRendererArgs, typeof DNDGroup>, boolean] {
    const [isDropping, setIsDropping] = React.useState(false);
    const [flush] = useFlush();

    useEffect(() => {
        flush();
    }, deps ?? []);

    return [
        (children: ChildrenRendererInput<GroupChildrenRendererArgs>) => {
            const renderChildren =
                typeof children === "function" ? children?.({
                    isDropping,
                }) : children;
            return (
                <DNDGroup
                    type={type + (id ? `{${id}}` : "")}
                    onDrop={onDrop}
                    onStartDropping={() => setIsDropping(true)}
                    onStopDropping={() => setIsDropping(false)}
                >
                    {renderChildren}
                </DNDGroup>
            );
        },
        isDropping,
    ];
}

type ElementChildrenRendererArgs = [
    {
        isDragging: boolean;
    }
];

export function useDndElement<T extends RecursiveValue<typeof DndNamespace, string>>(
    type: T,
    data: DndControlContentType[T],
    deps?: React.DependencyList,
    id?: string
): [ChildrenRenderer<ElementChildrenRendererArgs, typeof DNDElement>, boolean] {
    const [isDragging, setIsDragging] = React.useState(false);
    const [flush] = useFlush();

    useEffect(() => {
        flush();
    }, deps ?? []);

    return [
        (children: ChildrenRendererInput<ElementChildrenRendererArgs>) => {
            const renderChildren =
                typeof children === "function" ? children?.({
                    isDragging,
                }) : children;
            return (
                <DNDElement
                    type={type + (id ? `{${id}}` : "")}
                    data={data}
                    onStartDragging={() => setIsDragging(true)}
                    onStopDragging={() => setIsDragging(false)}
                >
                    {renderChildren}
                </DNDElement>
            );
        },
        isDragging,
    ];
}

export function DndProvider(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>
) {
    return (
        <>
            <ReactDndProvider backend={HTML5Backend}>
                {children}
            </ReactDndProvider>
        </>
    );
}
