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

export const VerticalBox = React.forwardRef((
    {
        children,
        className,
    }: Readonly<{
    children?: React.ReactNode;
    className?: string;
}>, ref: React.Ref<HTMLDivElement>) => {
    return (
        <div className={clsx("flex flex-col", className)} ref={ref}>
            {children}
        </div>
    )
});
VerticalBox.displayName = "VerticalBox";

export function useFlush() {
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);
    return forceUpdate;
}
