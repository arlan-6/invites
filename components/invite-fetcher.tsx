import React from "react";
import InviteView from "@/components/invite-view";
import { getInviteById } from "@/lib/inviteUtils";
import { getTemplateById } from "@/lib/templateUtils";
import { TemplateTranslationsType } from "@/data/templates";

const InviteFetcher = async ({ params }: { params: { inviteId: string } }) => {
	const { inviteId } = await params;
	const invite = await getInviteById(inviteId);
	if (!invite) {
		return (
			<div className="flex justify-center items-center h-screen">
				<h1 className="text-center text-3xl"> Invite not found!</h1>
			</div>
		);
	}
	const template = await getTemplateById(invite.templateId);
	if (!template) {
		return (
			<div className="flex justify-center items-center h-screen">
				<h1 className="text-center text-3xl"> Template not found!</h1>
			</div>
		);
	}
	const inviteData = {
		title: invite.title,
		date: invite.date.toISOString().split("T")[0],
		time: invite.date.toISOString().split("T")[1]?.slice(0, 5),
		location: invite.location,
		message: invite?.message || null,
	};
	return (
		<InviteView
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
			inviteData={
				inviteData as {
					title?: string;
					date?: string;
					time?: string;
					location?: string;
					message?: string;
				}
			}
			creator={invite.user.name}
		/>
	);
};

export default InviteFetcher;
