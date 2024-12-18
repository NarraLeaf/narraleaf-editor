import {Focusable} from "@lib/editor/app/focusable";
import React, {useEffect} from "react";
import {useEditor} from "@lib/providers/Editor";

export function useFocus(parent?: Focusable | null): [
    isFocused: {strict: boolean} | null,
    focus: (e?: React.MouseEvent<HTMLDivElement>) => void,
    focusable: Focusable,
] {
    const editor = useEditor();
    const [isFocused, setFocused] = React.useState<{strict: boolean} | null>(null);
    const [focusable] = React.useState(() => new Focusable());

    useEffect(() => {
        const handleFocusChange = () => {
            if (focusable.isFocused()) {
                setFocused({strict: focusable.isStrictFocused()});
            } else {
                setFocused(null);
            }
        };

        return editor.dependEvents([
            focusable.onFocused(handleFocusChange),
            focusable.onUnfocused(handleFocusChange),
        ]).off;
    }, []);

    useEffect(() => {
        if (parent) {
            focusable.link(parent);
        }

        return () => {
            focusable.unlink();
        };
    }, []);

    function handleFocus(e: React.MouseEvent<HTMLDivElement> | undefined) {
        e?.stopPropagation();
        focusable.focus();
    }

    return [isFocused, handleFocus, focusable];
}

