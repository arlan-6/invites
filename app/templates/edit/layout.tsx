import { TemplateEditor } from "@/components/advanced-template-editor/template-editor";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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
