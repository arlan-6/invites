'use client';
import React from "react";
import LZString from "lz-string";

import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { getTemplateById } from "@/data/templates";
const Page: React.FC = () => {
    const params = useParams<{ inviteId: string }>();
    
    const decompressedData = LZString.decompressFromEncodedURIComponent(params.inviteId.replace(/%2B/g, '+'));
    
    const { templateId, inviteData } = JSON.parse(decompressedData);
    const template = getTemplateById(templateId);
    if (!template) {
        return (
            <div className={cn("")}>
                <h1 className="text-center text-3xl">Template not found!</h1>
            </div>
        );
    }
    return (
        <div className="dark: bg-gray-100 h-screen w-full">

            {templateId}
            <div
                                    className={cn(
                                        "bg-gradient-to-bl p-6 rounded-lg w-96 text-white",
                                        template.color,
                                    )}
                                >
                                    <div className="text-3xl text-center">
                                        {inviteData.title || "Event title"}
                                    </div>
                                    <div className="flex justify-center gap-2 text-amber-50 text-sm">
                                        <div className="">{inviteData.date || "Event date"}</div>
                                        <div className="">{inviteData.time || "Event time"}</div>
                                    </div>
                                    <div className="">{inviteData.location || "Location"}</div>
                                    <div className="text-center">{inviteData.message || "Message"}</div>
                                </div>

        </div>
    );
};

export default Page;
