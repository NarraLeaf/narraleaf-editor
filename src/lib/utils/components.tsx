import React from "react";
import clsx from "clsx";

export const HorizontalBox = React.forwardRef((
    {
        children,
        className,
    }: Readonly<{
    children?: React.ReactNode;
    className?: string;
}>, ref: React.Ref<HTMLDivElement>) => {
    return (
        <div className={clsx("flex flex-row", className)} ref={ref}>
            {children}
        </div>
    )
});
HorizontalBox.displayName = "HorizontalBox";

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
    const [flushDep, forceUpdate] = React.useReducer(x => x + 1, 0);
    return [forceUpdate, flushDep];
}
