
import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { getAdvancedTemplateById } from "@/data/advanced-templates";
import { redirect } from "next/navigation";
import Loader from "@/components/ui/loader";
import { auth } from "@/auth";
import { headers } from "next/headers";

interface pageProps {
	params: Promise<{ id: string }>;
}

const Page: FC<pageProps> = async ({ params}) => {
	const { id } = await params;
	const session = await auth.api.getSession({
			headers: await headers(),
		});
	if (!session) {
		redirect("/sign-up");
	}
	if (!id) {
		redirect("/templates");
	}
	const template = getAdvancedTemplateById(id as string);
	if (!template) {
		redirect("/templates");
	} else {
		redirect(`/templates/edit/${template.path}`);
	}
	return (
		<div className={cn("")}>
			<Loader />
		</div>
	);
};
export default Page;
