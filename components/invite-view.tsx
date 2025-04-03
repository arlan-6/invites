"use client";

import React, { FC, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TemplateTranslationsType } from "@/data/templates";
import { InviteTemplate } from "@/components/invite-template";
import { getInviteById } from "@/lib/inviteUtils";
import Loader from "@/components/ui/loader";
import { Invite, User } from "@prisma/client";
import { getTemplateById } from "@/lib/templateUtils";

interface InviteViewProps {
	template: {
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
	inviteData: {
		title?: string;
		date?: string;
		time?: string;
		location?: string;
		message?: string;
	};
	invite: Invite;
    creator:String
}

const InviteView: FC<InviteViewProps> = ({ template, inviteData, invite,creator }) => {
	// const params = useParams<{ inviteId: string }>();
	// const [template, setTemplate] = useState<{
	// 	id: string;
	// 	color: string;
	// 	imageCorner: string | null;
	// 	cornerRitarion: boolean | null;
	// 	image: string | null;
	// 	occasions: string[];
	// 	tags: string[];
	// 	translations: TemplateTranslationsType;
	// 	createdAt: Date;
	// 	updatedAt: Date;
	// } | null>(null);
	// const [inviteData, setInviteData] = useState<{
	// 	title?: string;
	// 	date?: string;
	// 	time?: string;
	// 	location?: string;
	// 	message?: string;
	// } | null>(null);
	// const [creator, setCreator] = useState<User | null>(null);
	// const [loading, setLoading] = useState<boolean>(true);
	// const [error, setError] = useState<string | null>(null);

	// useEffect(() => {
	// 	const fetchInvite = async () => {
	// 		try {
	// 			setLoading(true);

	// 			// Fetch invite from database using the inviteId from the URL
	// 			const invite = await getInviteById(params.inviteId);

	// 			if (!invite) {
	// 				throw new Error("Invite not found!");
	// 			}

	// 			const template = await getTemplateById(invite.templateId);
	// 			if (!template) {
	// 				throw new Error("Template not found!");
	// 			}

	// 			// setTemplate(
	// 			// 	template as {
	// 			// 		id: string;
	// 			// 		color: string;
	// 			// 		imageCorner: string | null;
	// 			// 		cornerRitarion: boolean | null;
	// 			// 		image: string | null;
	// 			// 		occasions: string[];
	// 			// 		tags: string[];
	// 			// 		translations: TemplateTranslationsType;
	// 			// 		createdAt: Date;
	// 			// 		updatedAt: Date;
	// 			// 	},
	// 			// );
	// 			setCreator(invite.user);

	// 			// Convert Prisma invite data to the expected format
	// 			// setInviteData({
	// 			// 	title: invite.title,
	// 			// 	date: invite.date.toISOString().split("T")[0], // Format: YYYY-MM-DD
	// 			// 	time: invite.date.toISOString().split("T")[1]?.slice(0, 5), // Format: HH:mm
	// 			// 	location: invite.location,
	// 			// 	message: invite.message || "",
	// 			// });
	// 		} catch (err: any) {
	// 			console.error("Error loading invite:", err);
	// 			setError(err.message || "An unexpected error occurred.");
	// 		} finally {
	// 			setLoading(false);
	// 		}
	// 	};

	// 	fetchInvite();
	// }, [params.inviteId]);

	// if (loading) {
	// 	return (
	// 		<div className="flex justify-center items-center h-screen">
	// 			<Loader />
	// 		</div>
	// 	);
	// }

	// if (error) {
	// 	return (
	// 		<div className="flex justify-center items-center h-screen">
	// 			<h1 className="text-center text-3xl text-red-500">{error}</h1>
	// 		</div>
	// 	);
	// }

	if (!template || !inviteData) {
		return (
			<div className="flex justify-center items-center h-screen">
				<h1 className="text-center text-3xl">Template or Invite not found!</h1>
			</div>
		);
	}

	return (
		<div className="bg-gradient-to-t from-background to-primary h-screen w-full">
			<div className="relative w-auto top-10 pl-4 text-white z-0">
				<p className="w-auto">Created by: {creator || "Unknown"}</p>
			</div>
			<div className="h-screen w-full flex justify-center items-center  p-4 sm:p-0">
				<InviteTemplate
					template={
						template as {
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
					formData={inviteData}
				/>
			</div>
		</div>
	);
};

export default InviteView;
