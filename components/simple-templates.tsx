"use client";
import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { TemplatesList } from "./templates-list";
import { TemplateTranslationsType } from "@/data/templates";
import {
	MdOutlineKeyboardArrowDown,
	MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { Button } from "./ui/button";

interface SimpleTemplatesProps {
	className?: string;
	templates?: {
		id: string;
		color: string;
		imageCorner: string | null;
		cornerRitarion: boolean | null;
		image: string | null;
		occasions: string[];
		tags: string[];
		translations: TemplateTranslationsType;
		createdAt: Date;
		updatedAt: Date;
	}[];
}

export const SimpleTemplates: FC<SimpleTemplatesProps> = ({
	className,
	templates,
}) => {
	const [showTemplates, setShowTemplates] = React.useState(false);
	const handleShowTemplates = () => {
		setShowTemplates(!showTemplates);
	};
	return (
		<div className={cn("", className)}>
			<div className="w-full flex justify-between items-center">
				<h1 className="text-2xl p-4 whitespace-nowrap">Simple Templates</h1>
                <div className="w-full p-6 cursor-pointer" onClick={handleShowTemplates}>
				<div
                
					className={cn(
						"w-full h-1 rounded-2xl ",
						showTemplates ? "bg-accent-foreground" : "bg-accent",
					)}
				></div></div>
				<Button variant={!showTemplates?"ghost":'outline'} onClick={handleShowTemplates} className="m-2">
					{showTemplates ? (
						<MdOutlineKeyboardArrowDown title="showTemplates" />
					) : (
						<MdOutlineKeyboardArrowUp title="Hide templates" />
					)}
				</Button>
			</div>
			<div className="">
				{!showTemplates && (
					<TemplatesList
						// templates={
						// 	templates as {
						// 		id: string;
						// 		color: string;
						// 		imageCorner: string | null;
						// 		cornerRitarion: boolean | null;
						// 		image: string | null;
						// 		occasions: string[];
						// 		tags: string[];
						// 		translations: TemplateTranslationsType;
						// 		createdAt: Date;
						// 		updatedAt: Date;
						// 	}[]
						// }
					/>
				)}
			</div>
		</div>
	);
};
