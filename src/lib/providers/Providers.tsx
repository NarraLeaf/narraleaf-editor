"use client";

import React from "react";
import {EditorProvider} from "@lib/providers/Editor";
import {NextUIProvider} from "@nextui-org/react";

export default function Providers({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <NextUIProvider className={"h-full w-full"}>
                <EditorProvider>
                    {children}
                </EditorProvider>
            </NextUIProvider>
        </>
    )
}

