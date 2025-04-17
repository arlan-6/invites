import React, { FC, useMemo } from "react";
import { cn } from "@/lib/utils";
import { TemplateTranslationsType } from "@/data/templates";
import { useLanguage } from "./language-provider";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Roboto } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import BreathingText from "@/fancy/components/text/breathing-text";
import InviteTimer from "./invite-timer";

const roboto = Roboto({
	subsets: ["cyrillic", "latin"],
	weight: ["300", "400", "500", "700", "900"],
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

const PLACEHOLDER_CLASS = "opacity-60 italic";

export const InviteTemplate: FC<InviteTemplateProps> = ({
	className,
	template,
	formData,
}) => {
	const { t, language } = useLanguage() as {
		language: "kk" | "ru" | "en";
		t: (key: string) => string;
	};

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

	const renderCornerImages = useMemo(() => {
		if (!template.imageCorner) return null;

		const rotationClasses = {
			topLeft: template.cornerRitarion ? "" : "-rotate-90",
			topRight: "",
			bottomRight: template.cornerRitarion ? "" : "rotate-90",
			bottomLeft: template.cornerRitarion ? "" : "rotate-180",
		};

		const commonClasses =
			"absolute opacity-70 sm:opacity-90 w-12 h-12 sm:w-14 sm:h-14 transition-all duration-300 ease-out";

		return (
			<div
				className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
				aria-hidden="true"
			>
				<img
					src={template.imageCorner}
					alt=""
					className={cn(
						commonClasses,
						"top-4 left-4 sm:top-4 sm:left-4",
						rotationClasses.topLeft,
					)}
				/>
				<img
					src={template.imageCorner}
					alt=""
					className={cn(
						commonClasses,
						"top-4 right-4 sm:top-4 sm:right-4",
						rotationClasses.topRight,
					)}
				/>
				<img
					src={template.imageCorner}
					alt=""
					className={cn(
						commonClasses,
						"bottom-4 right-4 sm:bottom-4 sm:right-4",
						rotationClasses.bottomRight,
					)}
				/>
				<img
					src={template.imageCorner}
					alt=""
					className={cn(
						commonClasses,
						"bottom-4 left-4 sm:bottom-4 sm:left-4",
						rotationClasses.bottomLeft,
					)}
				/>
			</div>
		);
	}, [template.imageCorner, template.cornerRitarion]);

	if (!template) {
		return (
			<div className="flex items-center justify-center h-96 text-center text-red-500 p-8 border border-red-300 rounded-lg bg-red-50 w-full max-w-sm">
				<h1>Template data is missing!</h1>
			</div>
		);
	}

	const hasTimer =
		template.tags?.includes("timer") && formData?.date && formData?.time;
	const hasMiddleText = template.tags?.includes("middleText");

	const middleTextContent = template.translations[language]?.middleText || "";

	const containerVariants = {
		hidden: { opacity: 0, scale: 0.95 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.5,
				ease: "easeOut",
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 15 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.4,
				ease: "easeOut",
			},
		},
	};

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className={cn(
				"relative rounded-xl shadow-2xl",
				"w-full sm:min-w-[400px] sm:max-w-[430px]",
				"text-white overflow-hidden",
				"p-6 pt-10 sm:p-8 sm:pt-14",
                "min-h-[480px] sm:min-h-[500px]",
				"bg-gradient-to-bl",
				"aspect-[9/12] sm:aspect-auto",

				template.color,
				roboto.className,
				className,
			)}
			style={{ textShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
		>
			{renderCornerImages}

			<div className="relative z-10 flex flex-col ">
				<motion.div
					variants={itemVariants}
					className="text-center mb-6 sm:mb-6"
				>
					<p className="text-xs sm:text-sm uppercase tracking-wider opacity-70 mb-2 sm:mb-2 font-light">
						{t("invitePreview.youAreInvited") || "You are Invited"}
					</p>

					<h1
						className={cn(
							"text-3xl sm:text-4xl font-bold leading-tight break-words",
							!formData?.title && PLACEHOLDER_CLASS,
						)}
					>
						{derivedFormData.title}
					</h1>
				</motion.div>

				<motion.div
					variants={itemVariants}
					className="w-1/2 h-px bg-white/40 mx-auto my-4 sm:my-6"
				></motion.div>

				{hasMiddleText && middleTextContent && (
					<motion.div
						variants={itemVariants}
						className="my-6 sm:my-8 text-center"
					>
						<BreathingText
							className="text-3xl sm:text-4xl font-semibold italic"
							label={middleTextContent}
							fromFontVariationSettings="'wght' 200, 'slnt' -5"
							toFontVariationSettings="'wght' 800, 'slnt' 0"
							staggerDuration={0.6}
						/>
					</motion.div>
				)}

				<motion.div
					variants={itemVariants}
					className={cn(
						"flex flex-col items-center text-sm sm:text-base mt-4 mb-6 sm:mb-8 gap-y-3 sm:gap-y-4",
						"bg-black/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg",
					)}
				>
					<div className="flex items-center gap-2 sm:gap-2.5 w-full justify-center">
						<CalendarDays size={18} className="text-white/80 flex-shrink-0" />
						<span className={cn(!formData?.date && PLACEHOLDER_CLASS)}>
							{derivedFormData.date}
						</span>
					</div>

					<div className="flex items-center gap-2 sm:gap-2.5 w-full justify-center">
						<Clock size={18} className="text-white/80 flex-shrink-0" />
						<span className={cn(!formData?.time && PLACEHOLDER_CLASS)}>
							{derivedFormData.time}
						</span>
					</div>

					<div className="flex items-center gap-2 sm:gap-2.5 w-full justify-center text-center">
						<MapPin size={18} className="text-white/80 flex-shrink-0" />
						<span
							className={cn(
								"font-light",
								!formData?.location && PLACEHOLDER_CLASS,
							)}
						>
							{derivedFormData.location}
						</span>
					</div>
				</motion.div>

				<AnimatePresence>
					{template.tags?.includes("timer") && (
						<motion.div
							key="timer"
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className="mb-6 sm:mb-8 w-full flex flex-col items-center text-center overflow-hidden"
						>
							{formData?.date && formData?.time ? (
								<>
									<p className="text-xs sm:text-sm opacity-80 mb-1 sm:mb-2">
										{t("invitePreview.timerStarts") || "Event starts in:"}
									</p>

									<InviteTimer
										time={formData.time}
										targetDate={formData.date}
									/>
								</>
							) : (
								<div
									className={cn(
										"text-xs sm:text-sm text-amber-100/80",
										PLACEHOLDER_CLASS,
									)}
								>
									{t("invitePreview.timerPlaceholder") ||
										"Select Date & Time for timer"}
								</div>
							)}
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{derivedFormData.message && (<>
						<motion.div
							key="message"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							transition={{ delay: 0.2, duration: 0.4 }}
							className={cn(
								"mt-auto pt-4 sm:pt-6 border-t border-white/20",
								" text-2xl sm:text-4xl font-light text-center italic",
								"flex justify-center items-start"
							)}
						>
							"<p className="w-1/2 sm:w-3/4 text-base sm:text-lg font-light">{derivedFormData.message}</p>"
						</motion.div></>
					)}
				</AnimatePresence>
			</div>
		</motion.div>
	);
};
