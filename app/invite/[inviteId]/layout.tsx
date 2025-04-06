import type { Metadata } from "next";
import { getInviteById } from "@/lib/inviteUtils";

type Props = {
	params: Promise<{ inviteId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	// read route params
	const { inviteId } = await params;

	const invite = await getInviteById(inviteId)
	return {
		title: invite?.title || 'ShaqrApp',
		description: invite?.message || 'You was invited to the event',
		openGraph:{
			images:[{url:`${process.env.BETTER_AUTH_URL}/inivte/${inviteId}/image` || ''},invite?.template?.imageCorner || '',invite?.template?.image || '',]
		}
	};
}

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <main className="">{children}</main>;
}
