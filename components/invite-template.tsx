import React, { FC, useMemo } from "react";
import { cn } from "@/lib/utils";
import { TemplateTranslationsType, TemplateType } from "@/data/templates";
import { useLanguage } from "./language-provider";
import { Calendar1, Clock, MapPin } from "lucide-react";
import { Roboto } from "next/font/google";
import { motion } from "framer-motion";
import BreathingText from "@/fancy/components/text/breathing-text";
import InviteTimer from "./invite-timer";

const roboto = Roboto({
	subsets: ["cyrillic", "latin"],
	weight: "variable",
	style: ["italic", "normal"],
});

interface InviteTemplateProps {
	className?: string;
	template: {
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
	};
	formData?: {
		title?: string;
		date?: string;
		time?: string;
		location?: string;
		message?: string;
	};
}

export const InviteTemplate: FC<InviteTemplateProps> = ({
	className,
	template,
	formData,
}) => {
	const { t, language } = useLanguage() as {
		language: "kk" | "ru" | "en";
		t: any;
	};

	// Memoize derived data to avoid unnecessary recomputation
	const derivedFormData = useMemo(() => {
		return {
			title: formData?.title || t("inviteEditor.event-title-placeholder"),
			date: formData?.date || t("inviteEditor.event-date-placeholder"),
			time: formData?.time || t("inviteEditor.event-time-placeholder"),
			location:
				formData?.location || t("inviteEditor.event-location-placeholder"),
			message: formData?.message || "",
		};
	}, [formData, t]);

	// Function to render corner images
	const renderCornerImages = useMemo(() => {
		if (!template.imageCorner) return null;

		return (
			<>
				<img
					src={template.imageCorner}
					alt="Corner decoration"
					className={cn(
						"absolute top-3 left-3 w-12 h-12",
						!template.cornerRitarion && "-rotate-90",
					)}
				/>
				<img
					src={template.imageCorner}
					alt="Corner decoration"
					className="absolute top-3 right-3 w-12 h-12"
				/>
				<img
					src={template.imageCorner}
					alt="Corner decoration"
					className={cn(
						"absolute bottom-3 right-3 w-12 h-12",
						!template.cornerRitarion && "rotate-90",
					)}
				/>
				<img
					src={template.imageCorner}
					alt="Corner decoration"
					className={cn(
						"absolute bottom-3 left-3 w-12 h-12",
						!template.cornerRitarion && "rotate-180",
					)}
				/>
			</>
		);
	}, [template]);

	if (!template) {
		return (
			<div className="text-center text-red-500">
				<h1>Template not found!</h1>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5, delay: 0.5 }}
			className={cn(
				"relative bg-gradient-to-bl p-8 pt-12 pb-16 rounded-lg min-w-[335px] max-w-96 text-white min-h-96",
				template.color,
				className,
			)}
		>
			{/* Corner Images */}
			{renderCornerImages}

			{/* Card Content */}
			<div className="relative z-10">
				{/* Title */}
				<div className="text-3xl font-semibold text-center mb-3">
					{derivedFormData.title}
				</div>

				{/* Divider */}
				<div className="flex justify-center w-full m-1">
					<div className="w-3/4 h-1 bg-amber-50 rounded-full"></div>
				</div>

				{/* Date and Time */}
				<div className="flex justify-center gap-4 text-amber-50 text-sm mt-2">
					<div className="flex gap-2 items-center">
						<Calendar1 size={18} />
						{derivedFormData.date}
					</div>
					<div className="flex gap-2 items-center">
						<Clock size={18} />
						{derivedFormData.time}
					</div>
				</div>

				{/* Middle Text */}
				<div className="w-full max-h-52 h-1/2 my-22 rounded-2xl flex justify-center items-center text-4xl font-semibold">
					{template.tags?.includes("middleText") && (
						<BreathingText
							className={cn("", roboto.className)}
							label={
								template.translations[language].middleText ||
								t("inviteEditor.event-title-placeholder")
							}
							fromFontVariationSettings="'wght' 100, 'slnt' 0"
							toFontVariationSettings="'wght' 900, 'slnt' -10"
							staggerDuration={0.5}
						/>
					)}
				</div>

				{/* Timer */}
				<div className="w-full flex justify-center text-2xl">
					{template.tags?.includes("timer") &&
						(formData?.date && formData?.time ? (
							<InviteTimer time={formData.time} targetDate={formData.date} />
						) : (
							<div className="text-red-500 text-lg">
								Select Date and Time to see timer!
							</div>
						))}
				</div>

				{/* Location */}
				<div className="flex gap-2 items-center text-sm mt-2">
					<MapPin size={18} />
					{derivedFormData.location}
				</div>

				{/* Message */}
				{derivedFormData.message && (
					<div
						className={cn(
							"font-bold border-l-4 mt-4 text-2xl text-center bg-accent/10 p-3 rounded-r-md",
							roboto.className,
						)}
					>
						{derivedFormData.message}
					</div>
				)}
			</div>
		</motion.div>
	);
};
