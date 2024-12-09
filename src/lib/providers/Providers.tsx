import React from "react";
import {EditorProvider} from "@lib/providers/Editor";

export default function Providers({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <EditorProvider>
                {children}
            </EditorProvider>
        </>
    )
}

