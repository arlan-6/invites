import type { Metadata } from "next";
import LZString from "lz-string";
import { getInviteById } from "@/lib/inviteUtils";

// export const metadata: Metadata = {
//     title: 'Simple invite',
//     description: 'You was invited to the event',
//   }
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
	};
}

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
