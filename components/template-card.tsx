import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { TemplateType } from "@/data/templates";
import { useLanguage } from "./language-provider";
import { Template } from "@prisma/client";

interface templateCardProps {
	className?: string;
	template: TemplateType | Template;
	i: number;
}

export const TemplateCard: FC<templateCardProps> = ({ template, i }) => {
	const { t, language } = useLanguage();

	// Ensure translations exist and have the expected structure
	const translations = template.translations as {
		kk: {
			name: string;
			description: string;
			middleText?: string;
			occasions?: string[];
		};
		ru: {
			name: string;
			description: string;
			middleText?: string;
			occasions?: string[];
		};
		en: {
			name: string;
			description: string;
			middleText?: string;
			occasions?: string[];
		};
	};

	const translation = translations?.[language];
// console.log(typeof template.color);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.05 * i }}
			key={template.id}
			className={cn(
				"container p-4 px-4 rounded-lg shadow-2xl bg-gradient-to-tl min-w-64 flex-1 select-none",
				template.color,
				''
			)}
		>
			<Link
				href={`/templates/${template.id}`}
				className="cursor-pointer group h-full w-full "
			>
				<div className="flex justify-between">
					<div>
						<h3 className="text-xl tracking-wide font-bold text-gray-100 group-hover:underline">
							{translation?.name || "No Name"}
						</h3>
						<p className="group-hover:underline group-hover:text-gray-50 transition-colors text-gray-200">
							{translation?.description || "No Description"}
						</p>
					</div>
					{template.imageCorner && (
						<div className="w-9 h-9 group-hover:scale-110 transition-transform duration-200 ease-in-out">
							<img className="" src={template.imageCorner} alt="Corner" />
						</div>
					)}
				</div>

				<div className="">
					{/* {translation?.occasions && (<><h4 className="text-gray-100">{t("templates.occasions")}</h4>
					<ul className="mt-2 flex flex-wrap gap-2 bg-background/50 text-foreground p-2 rounded-sm">
						{translation?.occasions?.map((occasion) => (
							<div key={occasion} className={cn("flex gap-1 items-center")}>
								<span>•</span>
								<li key={occasion} className="text-sm">
									{occasion}
								</li>
							</div>
						))}
					</ul></>)} */}
					
				</div>
				{/* <div className="flex gap-2 mt-2">
					{template.tags?.map((tag, i) => (
						<Badge key={i}>{tag}</Badge>
					))}
				</div> */}
			</Link>
		</motion.div>
	);
};
