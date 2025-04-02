import { TemplateSearchBar } from "@/components/template-search-bar";
import { TemplatesList } from "@/components/templates-list";
import { TemplateTranslationsType } from "@/data/templates";
import { getAllTemplates } from "@/lib/templateUtils";
import React from "react";

const TemplatesPage: React.FC = async () => {
	const templates = await getAllTemplates();
	return (
		<div className="w-full flex justify-center">
			<div className="xl:w-8/12 lg:w-10/12 md:w-full">
				<TemplateSearchBar />
				<h1 className="text-2xl p-4">Simple Templates</h1>
				<TemplatesList
					templates={
						templates as {
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
						}[]
					}
				/>
			</div>
		</div>
	);
};

export default TemplatesPage;
