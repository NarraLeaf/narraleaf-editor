import type {Metadata} from "next";
import "@lib/styles/base.css";
import React from "react";
import Providers from "@lib/providers/Providers";

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
            className={`antialiased h-full min-h-screen`}
        >
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
