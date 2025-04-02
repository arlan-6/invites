import InviteFetcher from "@/components/invite-fetcher";
import Loader from "@/components/ui/loader";
import { Suspense } from "react";

const Page = async ({ params }: { params: Promise<{ inviteId: string }> }) => {
  const paramsWithId = await params
	return (
		<div className="w-full h-screen flex items-center justify-center">
			<Suspense fallback={<Loader />}>
				<InviteFetcher params={ paramsWithId} />
			</Suspense>
		</div>
	);
};

export default Page;
