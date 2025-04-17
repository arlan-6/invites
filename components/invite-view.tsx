"use client";

import React, { FC } from "react";

import { TemplateTranslationsType } from "@/data/templates";
import { InviteTemplate } from "@/components/invite-template";

import { cn } from "@/lib/utils";

type InviteTemplateData = {
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
};

interface InviteViewProps {
	className?: string;
	template: InviteTemplateData | null;
	inviteData: {
		title?: string;
		date?: string;
		time?: string;
		location?: string;
		message?: string;
	} | null;
	creator: string | null;
}

const InviteView: FC<InviteViewProps> = ({
	className,
	template,
	inviteData,
	creator,
}) => {
	if (!template || !inviteData) {
		return (
			<div className="flex justify-center items-center min-h-screen text-center p-4">
				<h1 className="text-2xl text-muted-foreground">
					Invitation details could not be loaded.
				</h1>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 pt-15 md:pt-5",

				"bg-gradient-to-br from-background  to-secondary/10",
				className,
			)}
		>
			<div className="mb-4 transform transition-transform duration-300 hover:scale-[1.02]">
				<InviteTemplate template={template} formData={inviteData} />
			</div>

			<div className="text-center text-sm text-muted-foreground mt-2">
				Created by: {creator || "Unknown"}
			</div>
		</div>
	);
};

export default InviteView;
