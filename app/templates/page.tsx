import { TemplateSearchBar } from "@/components/template-search-bar";
import { TemplatesList } from "@/components/templates-list";
import { Accordion } from "@/components/accordion";
import { TemplateTranslationsType } from "@/data/templates";
import { getAllTemplates } from "@/lib/templateUtils";
import React from "react";
import { AdvancedTemplatesList } from "@/components/advanced-templates-list";
import { advancedTemplates, AdvancedTemplateType } from "@/data/advanced-templates";

const TemplatesPage: React.FC = async () => {
	const templates = await getAllTemplates();
	return (
		<div className="w-full flex justify-center">
			<div className="xl:w-8/12 lg:w-10/12 md:w-full">
				<TemplateSearchBar />

				<Accordion title="Card inivte templates">
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
				</Accordion>

				<Accordion title="Advanced templates">
					<AdvancedTemplatesList templates={advancedTemplates as AdvancedTemplateType[]} />
				</Accordion>
			</div>
		</div>
	);
};

export default TemplatesPage;
