"use client";

import React from "react";
import {Editor} from "@lib/components/Editor";

export default function Page() {
    return (
        <div className={
            "bg-white text-black min-h-screen h-full"
        }>
            <Editor/>
        </div>
    );
}
