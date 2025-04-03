"use client";

import React, { FC, useMemo, useCallback, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useParams, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ShareDialogButton } from "./share-dialog-button";
import { useLanguage } from "./language-provider";
import { ArrowUp, Paintbrush } from "lucide-react";
import { InviteTemplate } from "./invite-template";
import { motion } from "framer-motion";
import { inviteSchema } from "@/lib/zod";
import useInviteStore from "@/store/inviteEdit";
import { getTemplateById } from "@/lib/templateUtils";
import { TemplateTranslationsType } from "@/data/templates";

interface InviteEditorProps {
	className?: string;
	template:{
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
	}
}

export const InviteEditor: FC<InviteEditorProps> = ({ className,template }) => {
	const { language, t } = useLanguage();
	const params = useParams<{ id: string }>();
	// const [template, setTemplate] = useState<{
	// 	id: string;
	// 	color: string;
	// 	imageCorner: string | null;
	// 	cornerRitarion: boolean | null;
	// 	image: string | null;
	// 	occasions: string[];
	// 	tags: string[];
	// 	translations: TemplateTranslationsType;
	// 	createdAt: Date;
	// 	updatedAt: Date;
	// } | null>(null);
	
	// useEffect(() => {
	// 	const getTemplate = async () => {
	// 		const template = await getTemplateById(params.id);
	// 		setTemplate(
	// 			template as {
	// 				id: string;
	// 				color: string;
	// 				imageCorner: string | null;
	// 				cornerRitarion: boolean | null;
	// 				image: string | null;
	// 				occasions: string[];
	// 				tags: string[];
	// 				translations: TemplateTranslationsType;
	// 				createdAt: Date;
	// 				updatedAt: Date;
	// 			},
	// 		);
	// 	};
	// 	getTemplate();
	// }, [params]);

	const { inviteData, updateInviteData } = useInviteStore();
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleChange = (key: keyof typeof inviteData, value: string) => {
		const updatedData = { ...inviteData, [key]: value };
		const validationResult = inviteSchema.safeParse(updatedData);

		setErrors(
			validationResult.success
				? {}
				: Object.fromEntries(
						Object.entries(validationResult.error.flatten().fieldErrors).map(
							([field, messages]) => [field, messages?.[0] || ""],
						),
				  ),
		);

		updateInviteData(updatedData);
	};

	const handleClear = useCallback(() => {
		updateInviteData({
			title: "",
			eventDate: "",
			eventTime: "",
			eventLocation: "",
			eventMessage: "",
		});
		setErrors({});
	}, [updateInviteData]);

	if (!template) {
		return (
			<div className={cn("", className)}>
				<h1 className="text-center text-3xl">Template not found!</h1>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"p-6 bg-gradient-to-t from-primary to-background min-h-screen",
				className,
			)}
		>
			<div>
				<div className="flex justify-around items-center mb-8">
					<div>
						<h1 className="text-2xl font-semibold">
							{template.translations[language].name}
						</h1>
						<p className="text-secondary-foreground">
							{template.translations[language].description}
						</p>
					</div>
					<div className="ml-3 flex gap-2 flex-wrap">
						<ShareDialogButton
							templateId={params.id}
							inviteData={{
								title: inviteData.title,
								time: inviteData.eventTime,
								date: inviteData.eventDate,
								location: inviteData.eventLocation,
								message: inviteData.eventMessage,
							}}
							shareText={t("inviteEditor.share")}
						/>
					</div>
				</div>

				<div className="flex-col-reverse md:flex-row w-full flex items-center justify-center gap-4 md:gap-16 flex-wrap">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className={cn(
							"container shadow-2xl bg-secondary p-6 rounded-lg min-w-[335px] max-w-96 text-white",
						)}
					>
						{Object.keys(inviteData).map((key) => (
							<div key={key} className="mb-4">
								<label className="block text-sm font-medium text-accent-foreground pl-2">
									{t(`inviteEditor.${key}`)}
								</label>
								<Input
									type={
										key.includes("Date")
											? "date"
											: key.includes("Time")
											? "time"
											: "text"
									}
									placeholder={t(`inviteEditor.${key}-placeholder`)}
									value={inviteData[key as keyof typeof inviteData] || ""}
									onChange={(e) =>
										handleChange(key as keyof typeof inviteData, e.target.value)
									}
									className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
								/>
								{errors[key] && (
									<p className="text-red-500 text-sm mt-1">{errors[key]}</p>
								)}
							</div>
						))}

						<div className="flex justify-between mt-6 flex-wrap gap-2">
							<Button
								variant="outline"
								onClick={handleClear}
								className="cursor-pointer flex items-center gap-2"
							>
								{t("inviteEditor.clear")}
								<Paintbrush size={16} strokeWidth={1.5} />
							</Button>
						</div>
					</motion.div>

					<motion.div
						className="md:hidden"
						animate={{ y: [10, -10, -3, -10, 10] }}
						transition={{ repeat: Infinity, duration: 1.5 }}
					>
						<ArrowUp />
					</motion.div>

					<InviteTemplate
						template={template}
						formData={{
							title: inviteData.title,
							time: inviteData.eventTime,
							date: inviteData.eventDate,
							location: inviteData.eventLocation,
							message: inviteData.eventMessage,
						}}
					/>
				</div>
			</div>
		</div>
	);
};
