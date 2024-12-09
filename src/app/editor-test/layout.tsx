import React from "react";

export default function Page({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={"min-h-screen h-full bg-white"}>
            {children}
        </div>
    )
}

