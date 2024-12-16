import React, {useEffect, useRef} from "react";
import {useDrag} from "react-dnd";

interface DNDElementProps<T> {
    type: string;
    data: T;
    children: React.ReactNode;
    onStartDragging?: () => void;
    onStopDragging?: () => void;
}

export function DNDElement<T = unknown>(
    {
        type,
        data,
        children,
        onStartDragging,
        onStopDragging,
    }: DNDElementProps<T>) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [collected, drag] = useDrag({
        type,
        item: data,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        })
    });

    useEffect(() => {
        if (collected.isDragging) {
            onStartDragging?.();
        } else {
            onStopDragging?.();
        }
    }, [collected.isDragging]);

    useEffect(() => {
        if (ref.current) {
            drag(ref.current);
        }
    }, [ref, drag]);

    return (
        <div ref={ref}>
            {children}
        </div>
    );
}