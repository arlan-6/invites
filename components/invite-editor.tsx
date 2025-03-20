"use client";
import React, { FC, useState } from "react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { getTemplateById } from "@/data/templates";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ShareDialogButton } from "./share-dialog-button";
import { useLanguage } from "./language-provider";
import { Paintbrush } from "lucide-react";

interface InviteEditorProps {
	className?: string;
}

type InviteData = {
	title?: string;
	date?: string;
	time?: string;
	location?: string;
	message?: string;
};

export const InviteEditor: FC<InviteEditorProps> = ({ className }) => {
	const { language, t } = useLanguage() as {
		language: "kk" | "ru" | "en";
		t: any;
	};
	const params = useParams<{ id: string }>();

	const [formData, setFormData] = useState<InviteData>({
		title: "",
		date: "",
		time: "",
		location: "",
		message: "",
	});
	const template = getTemplateById(params.id);
	if (!template) {
		return (
			<div className={cn("", className)}>
				<h1 className="text-center text-3xl">Template not found!</h1>
			</div>
		);
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleClear = () => {
		// Delete the template
		setFormData({
			title: "",
			date: "",
			time: "",
			location: "",
			message: "",
		});
	};

	return (
		<div
			className={cn(
				" p-6 bg-gradient-to-t from-primary to-background min-h-screen",
				className,
			)}
		>
			<div className="">
				<div className="flex justify-around items-center mb-8 text-">
					<div className="">
						<h1 className="text-2xl font-bold ">
							{template.translations[language].name}
						</h1>
						<p className="text-secondary-foreground">
							{template.translations[language].description}
						</p>
					</div>
					<div className="flex gap-2">
						{/* <Button
							variant="outline"
							onClick={handleClear}
							className="hover:border-red-500 hover:text-red-800 hover:bg-red-100 transition-colors duration-150 cursor-pointer"
						>
							{t("inviteEditor.clear")}
						</Button> */}
						<ShareDialogButton
							templateId={params.id}
							inviteData={formData}
							shareText={t("inviteEditor.share")}
						/>
					</div>
				</div>

				<div className="w-full flex items-center justify-center gap-16 flex-wrap">
					<div
						className={cn(
							"conatiner shadow-2xl bg-primary-foreground p-6 rounded-lg w-96 text-white",
							template.color,
						)}
					>
												<div
						  className={cn(
							"container shadow-2xl bg-primary-foreground p-6 rounded-lg w-96 text-white",
							template.color
						  )}
						>
						  <form>
							<fieldset className="space-y-4">
							  {/* <legend className="text-lg font-bold text-accent-foreground mb-4">
								{t("inviteEditor.formTitle")}
							  </legend> */}
						
							  {/* Event Title */}
							  <div>
								<label
								  htmlFor="title"
								  className="block text-sm font-medium text-accent-foreground pl-2"
								>
								  {t("inviteEditor.event-title")}
								</label>
								<Input
								  id="title"
								  name="title"
								  placeholder={t("inviteEditor.event-title-placeholder")}
								  maxLength={30}
								  value={formData.title}
								  onChange={handleChange}
								  required
								  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
								/>
							  </div>
						
							  {/* Date */}
							  <div>
								<label
								  htmlFor="date"
								  className="block text-sm font-medium text-accent-foreground pl-2"
								>
								  {t("inviteEditor.event-date")}
								</label>
								<Input
								  id="date"
								  name="date"
								  type="date"
								  placeholder={t("inviteEditor.event-date-placeholder")}
								  maxLength={10}
								  value={formData.date}
								  onChange={handleChange}
								  required
								  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
								/>
							  </div>
						
							  {/* Time */}
							  <div>
								<label
								  htmlFor="time"
								  className="block text-sm font-medium text-accent-foreground pl-2"
								>
								  {t("inviteEditor.event-time")}
								</label>
								<Input
								  id="time"
								  name="time"
								  type="time"
								  placeholder={t("inviteEditor.event-time-placeholder")}
								  maxLength={10}
								  value={formData.time}
								  onChange={handleChange}
								  required
								  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
								/>
							  </div>
						
							  {/* Location */}
							  <div>
								<label
								  htmlFor="location"
								  className="block text-sm font-medium text-accent-foreground pl-2"
								>
								  {t("inviteEditor.event-location")}
								</label>
								<Input
								  id="location"
								  name="location"
								  placeholder={t("inviteEditor.event-location-placeholder")}
								  maxLength={20}
								  value={formData.location}
								  onChange={handleChange}
								  required
								  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
								/>
							  </div>
						
							  {/* Message */}
							  <div>
								<label
								  htmlFor="message"
								  className="block text-sm font-medium text-accent-foreground pl-2"
								>
								  {t("inviteEditor.event-message")}
								</label>
								<Input
								  id="message"
								  name="message"
								  placeholder={t("inviteEditor.event-message-placeholder")}
								  maxLength={50}
								  value={formData.message}
								  onChange={handleChange}
								  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
								/>
							  </div>
							</fieldset>
						
							{/* Buttons */}
							<div className="flex justify-between mt-6">
							  <Button
								variant="outline"
								onClick={handleClear}
								className="cursor-pointer flex items-center gap-2"
							  >
								{t("inviteEditor.clear")}
								<Paintbrush size={16} strokeWidth={1.5} />
							  </Button>
							  <ShareDialogButton
								templateId={params.id}
								inviteData={formData}
								shareText={t("inviteEditor.share")}
							  />
							</div>
						  </form>
						</div>
					</div>
					<div
						className={cn(
							"bg-gradient-to-bl p-6 rounded-lg w-96 text-white",
							template.color,
						)}
					>
						<div className="text-3xl text-center">
							{formData.title || t("inviteEditor.event-title-placeholder")}
						</div>
						<div className="flex justify-center gap-2 text-amber-50 text-sm">
							<div className="">{formData.date || t("inviteEditor.event-date-placeholder")}</div>
							<div className="">{formData.time || t("inviteEditor.event-time-placeholder")}</div>
						</div>
						<br /><br />

						<div className="">{formData.location || t("inviteEditor.event-location-placeholder")}</div>
						<div className="text-center">{formData.message || t("inviteEditor.event-message-placeholder")}</div>
					</div>
				</div>
			</div>
		</div>
	);
};
