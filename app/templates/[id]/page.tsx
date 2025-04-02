import { InviteEditor } from "@/components/invite-editor";
import { TemplateTranslationsType } from "@/data/templates";
import { getTemplateById } from "@/lib/templateUtils";
import React from "react";

const Page =async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params
	const template = await getTemplateById(id);
	return (
		<div>
			<InviteEditor template={template as {
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
				}}/>

		</div>
	);
};

export default Page;
