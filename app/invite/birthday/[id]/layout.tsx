import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { GetAdvancedInviteById } from "@/lib/advancedInvitesUtils";

type Props = {
	params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	// read route params
	const { id } = await params;

	const invite = await GetAdvancedInviteById(id);
	return {
		title: invite?.name ? `${invite.name}'s Birthday Celebration` : "ShaqrApp",
		description: invite?.themeOrMessage
			? invite.themeOrMessage
			: "Join us for a memorable birthday celebration filled with joy and surprises!",
		openGraph: {
			title: invite?.name
				? `${invite.name}'s Birthday Celebration`
				: "ShaqrApp",
			description: invite?.themeOrMessage
				? invite.themeOrMessage
				: "Join us for a memorable birthday celebration filled with joy and surprises!",
			images: `${process.env.BETTER_AUTH_URL}/birthday/image.jpg`,
		},
		twitter: {
			card: "summary_large_image",
			title: invite?.name
				? `${invite.name}'s Birthday Celebration`
				: "ShaqrApp",
			description: invite?.themeOrMessage
				? invite.themeOrMessage
				: "Join us for a memorable birthday celebration filled with joy and surprises!",
			images: `${process.env.BETTER_AUTH_URL}/birthday/image.jpg`,
		},
	};
}

interface layoutProps {
	children: React.ReactNode;
}

const Layout: FC<layoutProps> = ({ children }) => {
	return <div className={cn("")}>{children}</div>;
};
export default Layout;
