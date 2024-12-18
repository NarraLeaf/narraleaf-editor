import React from "react";
import clsx from "clsx";
import {DivElementProps} from "@lib/components/type";

export const HorizontalBox = React.forwardRef((
    {
        children,
        className,
        ...props
    }: Readonly<{
        children?: React.ReactNode;
        className?: string;
    } & DivElementProps>, ref: React.Ref<HTMLDivElement>) => {
    return (
        <div className={clsx("flex flex-row", className)} ref={ref} {...props}>
            {children}
        </div>
    )
});
HorizontalBox.displayName = "HorizontalBox";

export const VerticalBox = React.forwardRef((
    {
        children,
        className,
        ...props
    }: Readonly<{
        children?: React.ReactNode;
        className?: string;
    } & DivElementProps>, ref: React.Ref<HTMLDivElement>) => {
    return (
        <div className={clsx("flex flex-col", className)} ref={ref} {...props}>
            {children}
        </div>
    )
});
VerticalBox.displayName = "VerticalBox";

export function useFlush() {
    const [flushDep, forceUpdate] = React.useReducer(x => x + 1, 0);
    return [forceUpdate, flushDep];
}
