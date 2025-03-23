import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { TemplateType } from "@/data/templates";
import { useLanguage } from "./language-provider";

interface templateCardProps {
	className?: string;
	template: TemplateType;
	i: number;
}

export const TemplateCard: FC<templateCardProps> = ({
	template,
	i,
}) => {
	const { t, language } = useLanguage();
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.05 * i }}
			key={template.id}
			className={cn(
				"container p-4  rounded-lg shadow-2xl bg-gradient-to-br min-w-64 flex-1	 ",
				template.color,
			)}
		>
			<Link href={`/templates/${template.id}`} className="cursor-pointer group">
				<div className="flex justify-between">
					<div className="">
						<h3 className="text-xl tracking-wide font-bold text-gray-100 group-hover:underline">
							{template.translations[language].name}
						</h3>
						<p className="group-hover:underline  text-gray-300">
							{template.translations[language].description}
						</p>
					</div>
					{template.imageCorner && (
						<div className="w-9 h-9">
							<img className="" src={template.imageCorner} />
						</div>
					)}
				</div>
			</Link>
			<div className="mt-4">
				<h4 className="  text-gray-100">{t("templates.occasions")}</h4>
				<ul className="mt-2 flex flex-wrap gap-2 bg-background text-foreground  p-2 rounded-sm">
					{template.occasions.map((occasion) => (
						<div key={occasion} className={cn("flex gap-1 items-center ")}>
							<span className="">•</span>
							<li key={occasion} className=" text-sm ">
								{occasion}{" "}
							</li>
						</div>
					))}
				</ul>
			</div>
			<div className="flex gap-2 mt-2">
				{template.tags?.map((tag, i) => (
					<Badge key={i}>{tag}</Badge>
				))}
			</div>
		</motion.div>
	);
};
