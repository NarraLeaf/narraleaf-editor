import type {Metadata} from "next";
import "@lib/styles/base.css";
import {NextUIProvider} from "@nextui-org/react";
import React from "react";

export const metadata: Metadata = {
    title: "NarraLeaf Editor",
    description: "NarraLeaf Editor",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`antialiased`}
        >
        <NextUIProvider>
            {children}
        </NextUIProvider>
        </body>
        </html>
    );
}
