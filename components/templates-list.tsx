"use client";

import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { TemplateCard } from "./template-card";
import usesTemaplteFilterstore from "@/store/templateFilters";
import { useLanguage } from "./language-provider";
import { TemplateTranslationsType } from "@/data/templates";

interface TemplatesListProps {
	className?: string;
	templates: {
		id: string;
		color: string;
		imageCorner: string | null;
		cornerRitarion: boolean | null;
		image: string | null;
		occasions: string[];
		tags: string[];
		translations: TemplateTranslationsType;
		createdAt: Date;
		updatedAt: Date;
	}[];
}

export const TemplatesList: FC<TemplatesListProps> = ({
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
	const [showTemplates, setShowTemplates] = React.useState(false);
	const handleShowTemplates = () => {
		setShowTemplates(!showTemplates);
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
						temp.translations[language].middleText
							?.toLowerCase()
							.includes(search) ||
						temp.translations[language].occasions?.filter((i) =>
							i.toLowerCase().includes(search),
						).length > 0,
				)
				.map((template, i) => (
					<TemplateCard key={template.id} template={template} i={i} />
				))}
		</div>
	);
};
