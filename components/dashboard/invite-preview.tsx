import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Invite, Template } from "@prisma/client";
import { InviteTemplate } from "../invite-template";
import { TemplateTranslationsType } from "@/data/templates";
type InviteType = {
	template: Template | null; // Allow template to be null if possible relation
} & Omit<Invite, "templateId" | "createdAt" | "updatedAt"> & {
		// Omit fields not used or handled manually
		id: string;
		title: string | null;
		templateId: string | null; // Include if needed for fallback link
	};
interface invitePreviewProps {
	className?: string;
	invite: InviteType;
}

export const InvitePreview: FC<invitePreviewProps> = ({
	className,
	invite,
}) => {
	return (
		<div className={cn("scale-[50%] w-48 h-72  flex items-center justify-center  flex-col gap-4", className)}>
            
			<InviteTemplate
				template={
					invite.template as {
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
					}
				}
				formData={{
					title: invite.title,
					date:invite.date.toISOString().split("T")[0],
					time:invite.date.toISOString().split("T")[1]?.slice(0, 5),
					location: invite.location,
					message: invite.message || undefined,
				}}
			/>
            <div className="text-4xl text-primary-foreground">Preview</div>
		</div>
	);
};
