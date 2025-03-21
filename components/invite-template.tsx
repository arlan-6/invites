import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { TemplateType } from "@/data/templates";
import { useLanguage } from "./language-provider";
import { Calendar1, Clock, MapPin } from "lucide-react";
import { Lobster, Roboto } from "next/font/google";
import { motion } from "framer-motion";
// import { AnimatedDate, AnimatedTime } from "./string-number-to-animated-number";
import BreathingText from "@/fancy/components/text/breathing-text";

const lobster = Lobster({
	subsets: ["cyrillic", "latin"],
	weight: "400",
});
const roboto = Roboto({
	subsets: ["cyrillic", "latin"],
	weight: 'variable',
	style:['italic','normal']
});
interface inviteTemplateProps {
	className?: string;
	template: TemplateType;
	formData: {
		title?: string;
		date?: string;
		time?: string;
		location?: string;
		message?: string;
	};
}

export const InviteTemplate: FC<inviteTemplateProps> = ({
	
	template,
	formData,
}) => {
	const { t } = useLanguage() as {
		language: "kk" | "ru" | "en";
		t: any;
	};
	return (
		<motion.div
		initial={{ opacity: 0, scale: 0.9 }}
		animate={{ opacity: 1, scale: 1 }}
		transition={{ duration: 0.5, delay: 0.5 }}
			className={cn(
				"bg-gradient-to-bl p-6 rounded-lg w-96 text-white min-h-96",
				template.color,
			)}
		>
			<div className="">
				<div className="">
					<div className="text-5xl font-semibold tracking-tight text-center mb-3">
						<BreathingText
							className={cn("",roboto.className)}
							label={formData.title || t("inviteEditor.event-title-placeholder")}
							fromFontVariationSettings="'wght' 100, 'slnt' 0"
							toFontVariationSettings="'wght' 900, 'slnt' -10"
							
						/>
						{/* {formData.title || t("inviteEditor.event-title-placeholder")} */}
					</div>
					<div className="flex justify-center gap-2 text-amber-50 text-sm">
						<div className="flex gap-2 items-center">
							<Calendar1 size={18} />
							{!formData.date
								? t("inviteEditor.event-date-placeholder")
								: // <AnimatedDate dateString={formData.date} />
								  formData.date}
						</div>
						<div className="flex gap-2 items-center">
							<Clock size={18} />
							{!formData.time
								? t("inviteEditor.event-time-placeholder")
								: // <AnimatedTime timeString={formData.time} />
								  formData.time}
						</div>
					</div>
				</div>
				<div className="w-full h-52  my-3 rounded-2xl "></div>
				<div className="">
					<div className="flex gap-2 items-center">
						<MapPin size={18} />{" "}
						{formData.location || t("inviteEditor.event-location-placeholder")}
					</div>
					{formData.message && (
						<div
							className={cn(
								"border-l-4 border-accent mt-4 text-2xl text-center bg-accent/10 p-3 rounded-r-md",
								lobster.className,
							)}
						>
							{formData.message || t("inviteEditor.event-message-placeholder")}
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
};
