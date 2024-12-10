import React from "react";
import clsx from "clsx";

export function HorizontalBox(
    {
        children,
        className,
    }: Readonly<{
    children?: React.ReactNode;
    className?: string;
}>) {
    return (
        <div className={clsx("flex flex-row", className)}>
            {children}
        </div>
    )
}

export function VerticalBox(
    {
        children,
        className,
    }: Readonly<{
    children?: React.ReactNode;
    className?: string;
}>) {
    return (
        <div className={clsx("flex flex-col", className)}>
            {children}
        </div>
    )
}

export function useFlush() {
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);
    return forceUpdate;
}
