"use client";

import React from 'react';
import ResizablePanel from "@lib/components/ResizablePanel";

const Page = () => {
    return (
        <ResizablePanel
            className={"select-none h-full"}
            direction={"horizontal"}
            minSize={200}
        >
            <div className={"h-full"} style={{ background: "#f4f4f4", padding: "10px" }}>左侧资源管理器</div>
            <ResizablePanel
                className={"select-none h-full"}
                minSize={200}
            >
                <div className={"h-full"} style={{ background: "#f4f4f4", padding: "10px" }}>左侧资源管理器</div>
                <div style={{ background: "#fff", padding: "10px", minWidth: "200px" }}>编辑器主区域</div>
            </ResizablePanel>
        </ResizablePanel>
    );
};

export default Page;

