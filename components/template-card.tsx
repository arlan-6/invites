"use client";
import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { TemplateType } from "@/data/templates";
import { useLanguage } from "./language-provider";
import { Template } from "@prisma/client";
import { Text, Timer } from "lucide-react";
import { MdTimer } from "react-icons/md";

interface templateCardProps {
	className?: string;
	template: TemplateType | Template;
	i: number;
}

export const TemplateCard: FC<templateCardProps> = ({ template, i }) => {
	const { t, language } = useLanguage();

	const translations = template.translations as {
		kk: {
			name: string;
			description: string;
			middleText?: string;
			occasions?: string;
		};
		ru: {
			name: string;
			description: string;
			middleText?: string;
			occasions?: string;
		};
		en: {
			name: string;
			description: string;
			middleText?: string;
			occasions?: string;
		};
	};

	const translation = translations?.[language];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2, delay: 0.04 * i }}
			key={template.id}
			className={cn(
				"container p-4 px-4 rounded-lg bg-gradient-to-tl min-w-64 max-w-96 flex-1 select-none transition-all templateCard",
				template.color,
				"",
			)}
		>
			<Link
				href={`/templates/${template.id}`}
				className="cursor-pointer group h-full w-full "
			>
				<div className="flex justify-between">
					<div className="flex-grow mr-4">
						<h3 className="text-xl tracking-wide font-bold text-gray-100 group-hover:underline transition-all flex items-center">
							{translation?.name || t("templates.templateCardNoName")}

							<span className="flex items-center gap-2 ml-2">
								{template.tags?.includes("middleText") && (
									<span
										title="Includes centered text feature"
										className="text-gray-200 group-hover:text-white group-hover:scale-125 transition-[color,transform] duration-200 ease-in-out"
									>
										<Text size={14} aria-label="Centered text feature" />
									</span>
								)}
								{template.tags?.includes("timer") && (
									<span
										title="Includes a timer"
										className="text-gray-200 group-hover:text-white group-hover:scale-125 transition-[color,transform] duration-200 ease-in-out delay-100"
									>
										<Timer size={14} aria-label="Timer feature" />
									</span>
								)}
							</span>
						</h3>
						<p className="max-w-full group-hover:underline group-hover:underline-offset-4 group-hover:text-gray-50 text-gray-200 flex items-center gap-4 transition-colors duration-200">
							<p className="max-w-42 truncate ">
								{translation?.description ||
									t("templates.templateCardNoDescription")}
							</p>
						</p>
					</div>

					{template.imageCorner && (
						<div className="w-9 h-9 group-hover:scale-110 transition-transform duration-200 ease-in-out flex-shrink-0">
							<img className="" src={template.imageCorner} alt="Corner" />
						</div>
					)}
				</div>
			</Link>
		</motion.div>
	);
};
