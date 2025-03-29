"use client";

import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { TemplateCard } from "./template-card";
import { Template } from "@prisma/client";

interface TemplatesListProps {
    className?: string;
    templates: Template[];
}

export const TemplatesList: FC<TemplatesListProps> = ({ className, templates }) => {
    if (!templates || templates.length === 0) {
        return (
            <div className="w-full flex justify-center items-center h-40">
                <p className="text-gray-500">No templates available.</p>
            </div>
        );
    }

    return (
        <div className="w-full flex justify-center">
            <div className="xl:w-8/12 lg:w-10/12 md:w-full">
                <div className={cn("flex gap-2 flex-wrap p-6", className)}>
                    {/* Templates List */}
                    {templates.map((template, i) => (
                        <TemplateCard key={template.id} template={template} i={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};