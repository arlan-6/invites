import { auth } from "@/auth";
import { TemplateEditor } from "@/components/advanced-template-editor/template-editor";
import { getAdvancedTemplateById } from "@/data/advanced-templates";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;

}>) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) {
		redirect("/sign-up");
	}
	return (
		<main className="">
			<div className="min-h-screen flex">
				<div className="w-full">{children}</div>
				<div className="">
					<TemplateEditor />
				</div>
			</div>
		</main>
	);
}
