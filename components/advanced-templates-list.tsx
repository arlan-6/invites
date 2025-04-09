"use client";

import React, { FC } from "react";
import { cn } from "@/lib/utils";
import usesTemaplteFilterstore from "@/store/templateFilters";
import { useLanguage } from "./language-provider";
import { AdvancedTemplateType } from "@/data/advanced-templates";
import { AdvancedTemplateCard } from "./advanced-template-card";

interface TemplatesListProps {
	className?: string;
	templates: AdvancedTemplateType[];
}

export const AdvancedTemplatesList: FC<TemplatesListProps> = ({
	className,
	templates,
}) => {
	if (!templates || templates.length === 0) {
		return (
			<div className="w-full flex justify-center items-center h-40">
				<p className="text-gray-500">No templates available.</p>
			</div>
		);
	}


	const { language } = useLanguage();
	const { search } = usesTemaplteFilterstore();
	return (
		<div className={cn("flex gap-2 flex-wrap p-6", className)}>
			{/* Templates List */}
			{templates
				.filter(
					(temp) =>
						temp.translations[language].description
							.toLowerCase()
							.includes(search) ||
						temp.translations[language].name.toLowerCase().includes(search) ||
						temp.translations[language].occasions?.filter((i) =>
							i.toLowerCase().includes(search),
						).length > 0,
				)
				.map((template, i) => (
					<AdvancedTemplateCard
                        key={template.id}
                        className="w-1/4"
                        template={template}/>
				))}
		</div>
	);
};
