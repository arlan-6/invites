"use client";

import React, { FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Edit } from "lucide-react";

import { cn } from "@/lib/utils";
import { AdvancedTemplateType } from "@/data/advanced-templates";
import { useLanguage } from "./language-provider";
import { Badge } from "@/components/ui/badge";

interface AdvancedTemplateCardProps {
    className?: string;
    template: AdvancedTemplateType;
    i: number;
}

export const AdvancedTemplateCard: FC<AdvancedTemplateCardProps> = ({
    className,
    template,
    i,
}) => {
    const { language, t } = useLanguage();
    const {
        name = t("templateCard.untitled"),
        description = t("templateCard.noDescription"),
        occasions,
    } = template.translations[language] || {};

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * i }}
            className={cn(
                "relative rounded-lg shadow-lg h-full overflow-hidden flex-1",
                "bg-gradient-to-br from-blue-500 to-indigo-600",
                "hover:shadow-xl group-hover:scale-[1.02] group-hover:-translate-y-1",
                "transition-all duration-300 ease-in-out select-none",
                "p-4 sm:p-6", // Responsive padding
                className
            )}
        >
            <Link
                href={`/templates/edit/${template.path}`}
                aria-label={t("templateCard.editActionLabel", { name })}
                className={cn(
                    "group block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400 rounded-lg",
                    "focus-visible:scale-[1.03] transition-all duration-300 ease-in-out"
                )}
            >
                {/* Edit Icon */}
                <Edit
                    className={cn(
                        "absolute text-white/40 transition-all duration-300 ease-in-out",
                        "group-hover:text-yellow-300 group-hover:scale-110",
                        "top-2 right-2 h-4 w-4 sm:top-3 sm:right-3 sm:h-5 sm:w-5"
                    )}
                    aria-hidden="true"
                />

                {/* Content */}
                <div className="flex flex-col justify-between h-full gap-2 sm:gap-3">
                    {/* Title and Description */}
                    <div>
                        <h3
                            className={cn(
                                "font-bold text-white pr-6 sm:pr-8",
                                "text-base sm:text-xl leading-tight sm:leading-normal"
                            )}
                        >
                            {name}
                        </h3>
                        {description && (
                            <p
                                className={cn(
                                    "text-blue-100/90 mt-1",
                                    "text-xs sm:text-sm",
                                    "line-clamp-2 sm:line-clamp-3"
                                )}
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Occasions Badges */}
                    {occasions && occasions.length > 0 && (
                        <div className="mt-auto pt-2">
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {occasions.map((occasion) => (
                                    <Badge
                                        key={occasion}
                                        variant="secondary"
                                        className={cn(
                                            "bg-white/10 text-white/90 border-white/20 backdrop-blur-sm",
                                            "px-2 py-0.5 text-[10px] sm:px-2.5 sm:py-0.5 sm:text-xs"
                                        )}
                                    >
                                        {occasion}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Link>
        </motion.div>
    );
};
