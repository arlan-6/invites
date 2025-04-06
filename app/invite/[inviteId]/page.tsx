import InviteFetcher from "@/components/invite-fetcher";
import Loader from "@/components/ui/loader";
import { Suspense } from "react";

const Page = async ({ params }: { params: Promise<{ inviteId: string }> }) => {
  const paramsWithId = await params
	return (
		<div className="bg-gradient-to-b from-background to-primary  w-full flex items-center justify-center">
			<Suspense fallback={<Loader className="h-screen"/>}>
				<InviteFetcher params={ paramsWithId} />
			</Suspense>
		</div>
	);
};

export default Page;
