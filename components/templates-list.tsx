"use client";
import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { templates } from "@/data/templates";
import { TemplateCard } from "./template-card";

interface TemplatesListProps {
	className?: string;
}

export const TemplatesList: FC<TemplatesListProps> = ({ className }) => {
	return (
		<div className="w-full flex justify-center ">
			<div className="xl:8/12 lg:w-10/12 md: w-full">
				<div className={cn("flex gap-2 flex-wrap p-6 ", className)}>
					{/* Templates List */}
					{templates.map((template, i) => (
						<TemplateCard key={i} template={template} i={i} />
					))}
				</div>
			</div>
		</div>
	);
};
