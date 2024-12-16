import React, {useEffect, useRef} from "react";
import {useDrop} from "react-dnd";

export interface DNDGroupProps<T> {
    type: string;
    onDrop: (item: T) => void;
    children: React.ReactNode;
    onStartDropping?: () => void;
    onStopDropping?: () => void;
}

export default function DNDGroup<T = unknown>(
    {
        type,
        onDrop,
        children,
        onStartDropping,
        onStopDropping,
    }: DNDGroupProps<T>) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [collected, drop] = useDrop({
        accept: type,
        drop: (item: T) => {
            onDrop(item);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver() && monitor.canDrop() && monitor.isOver({shallow: true}),
        }),
    });

    useEffect(() => {
        if (collected.isOver) {
            onStartDropping?.();
        } else {
            onStopDropping?.();
        }
    }, [collected.isOver]);

    useEffect(() => {
        if (ref.current) {
            drop(ref.current);
        }
    }, [ref, drop]);

    return (
        <div ref={ref}>
            {children}
        </div>
    );
}

