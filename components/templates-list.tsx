import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { templates } from "@/data/templates";
import Link from "next/link";

interface TemplatesListProps {
	className?: string;
}

export const TemplatesList: FC<TemplatesListProps> = ({ className }) => {
	return (
		<div className={cn("flex gap-2 m-4", className)}>
			{/* Templates List */}
			{templates.map((template) => (
				<div
					key={template.id}
					className={cn(
						"container p-4  rounded-lg shadow-2xl bg-gradient-to-br",
						template.color,
					)}
				>
					<Link href={`/templates/${template.id}`} className="cursor-pointer group">
						<h3 className="text-xl tracking-wide font-bold text-gray-100 group-hover:underline">
							{template.name}
						</h3>
						<p className="group-hover:underline  text-gray-300">{template.description}</p>
					</Link>
					<div className="mt-4">
						<h4 className="  text-gray-100">Occasions</h4>
						<ul className="mt-2 flex gap-2 bg-gray-200 dark:bg-gray-800 p-2 rounded-sm">
							{template.occasions.map((occasion ) => (
								<div key={occasion} className={cn("flex gap-1 items-center ")}>
									<span className="">•</span>
									<li key={occasion} className=" text-sm ">
										{occasion}{" "}
									</li>
								</div>
							))}
						</ul>
					</div>
				</div>
			))}
		</div>
	);
};
