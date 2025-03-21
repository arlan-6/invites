"use client";
import React from "react";
import LZString from "lz-string";

import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { getTemplateById } from "@/data/templates";
import { InviteTemplate } from "@/components/invite-template";
import BottomNavigation from "@/components/bottom-navigation";
const Page: React.FC = () => {
	const params = useParams<{ inviteId: string }>();

	const decompressedData = LZString.decompressFromEncodedURIComponent(
		params.inviteId.replace(/%2B/g, "+"),
	);

	const { templateId, inviteData } = JSON.parse(decompressedData);
	const template = getTemplateById(templateId);
	if (!template) {
		return (
			<div className={cn("")}>
				<h1 className="text-center text-3xl">Template not found!</h1>
			</div>
		);
	}
	return (
		<div className="bg-gradient-to-t from-background to-primary h-screen w-full ">
			<div className="h-screen w-full flex justify-center items-center">
				<InviteTemplate template={template} formData={inviteData} />
			</div>
			<BottomNavigation />
		</div>
	);
};

export default Page;
