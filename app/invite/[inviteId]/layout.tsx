import type { Metadata } from "next";
import LZString from "lz-string";

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

	const decompressedData = LZString.decompressFromEncodedURIComponent(
		inviteId.replace(/%2B/g, "+"),
	);

	const { inviteData } = JSON.parse(decompressedData);
	return {
		title: inviteData.title,
		description: inviteData.message,
	};
}

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
