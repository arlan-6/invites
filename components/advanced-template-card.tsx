import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { AdvancedTemplateType } from "@/data/advanced-templates";
import Link from "next/link";

interface AdvancedTemplateCardProps {
    className?: string;
    template: AdvancedTemplateType;
}

export const AdvancedTemplateCard: FC<AdvancedTemplateCardProps> = ({
    className,
    template,
}) => {
    const { name, description } = template.translations.en;

    return (
        <Link href={`/templates/edit/${template.id}`} className="w-full">
        <div
            className={cn(
                "p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white",
                className
            )}
        >
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            {description && (
                <p className="text-sm text-gray-600 mt-2">{description}</p>
            )}
        </div></Link>
    );
};
