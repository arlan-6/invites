"use client";
import React, { FC, useState } from "react";
import { cn } from "@/lib/utils";
import { Roboto_Mono } from "next/font/google";
import { format } from "date-fns";
import {
	Cake,
	Calendar,
	Clock,
	MapPin,
	SquareArrowOutUpRight,
	Home,
	Sparkles,
	Gift,
	Info,
	Send,
	PartyPopper,
	Users,
	Map,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PostRsvpTrackById } from "@/lib/advancedInvitesUtils";
import { TextRoll } from "../motion-primitives/text-roll";
import NumberTicker from "@/fancy/components/text/basic-number-ticker";
import BreathingText from "@/fancy/components/text/breathing-text";
import { useLanguage } from "../language-provider";

const roboto = Roboto_Mono({
	weight: ["400", "700"],
	subsets: ["latin", "cyrillic"],
	variable: "--font-roboto",
});

interface birthdayProps {
	className?: string;
	inviteData?: {
		name?: string;
		age?: string;
		dateTime?: string;
		location?: string;
		address?: string;
		addressLink?: string[] | string;
		themeOrMessage?: string;
		dressCode?: string;
		giftInfo?: string;
		rsvpDeadline?: string;
		contactInfo?: string;
	};
	id?: string;
}

const formatDate = (isoDate?: string): string => {
	if (!isoDate) return "TBC";
	try {
		const dateObj = new Date(isoDate + "T00:00:00");
		return dateObj.toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	} catch {
		return isoDate;
	}
};

export const Birthday: FC<birthdayProps> = ({ className, inviteData, id }) => {
	const { t, setLanguage } = useLanguage();

	const [rsvpForm, setRsvpForm] = useState<{
		name: string;
		attendance: "going" | "notGoing";
	}>({
		name: "",
		attendance: "notGoing",
	});

	const name =
		inviteData?.name?.toLocaleUpperCase() || t("birthday.defaultName");
	const age = inviteData?.age ? parseInt(inviteData.age, 10) : 99;
	const dateTime = inviteData?.dateTime;

	const formattedDate = dateTime
		? format(new Date(dateTime), "EEE, MMM d, yyyy")
		: t("birthday.dateTBC");
	const formattedTime = dateTime
		? new Date(dateTime).toLocaleTimeString(undefined, {
				hour: "numeric",
				minute: "2-digit",
				hour12: false,
		  })
		: t("birthday.timeTBC");

	const location = inviteData?.location || t("birthday.defaultLocation");
	const address = inviteData?.address || "";
	const addressLinkRaw = inviteData?.addressLink;
	const themeOrMessage =
		inviteData?.themeOrMessage || t("birthday.defaultThemeMessage");
	const dressCode = inviteData?.dressCode || t("birthday.defaultDressCode");
	const giftInfo = inviteData?.giftInfo || t("birthday.defaultGiftInfo");

	const rsvpDeadlineFormatted = inviteData?.rsvpDeadline
		? formatDate(inviteData.rsvpDeadline)
		: t("birthday.defaultRSVPDeadline");
	const contactInfo =
		inviteData?.contactInfo || t("birthday.defaultContactInfo");

	let mapHref = "#";
	if (addressLinkRaw) {
		mapHref =
			Array.isArray(addressLinkRaw) && addressLinkRaw.length > 0
				? addressLinkRaw[0]
				: typeof addressLinkRaw === "string"
				? addressLinkRaw
				: "#";
	}
	const hasMapLink = mapHref !== "#";

	const accentYellow = "text-yellow-400";
	const accentBlue = "text-blue-400";

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!id) {
			toast.error(t("birthday.missingInviteID"));
			return;
		}
		const invite = await PostRsvpTrackById(id, {
			name: rsvpForm.name,
			attendance: rsvpForm.attendance,
			answerDate: new Date(),
		});
		if (!invite) {
			toast.error(t("birthday.rsvpSubmissionFailed"));
			return;
		}
		toast.success(t("birthday.rsvpSubmissionSuccess"));
	};

	return (
		<div
			className={cn(
				"w-full bg-accent-foreground text-accent p-6 md:p-10 min-h-screen font-normal",
				className,
				roboto.className,
			)}
		>
			<div className="text-center mb-12 md:mb-16">
				<div className="py-10">
					<div
						className={`flex items-center justify-center text-4xl md:text-6xl font-bold mb-12 md:mb-16 tracking-wider relative ${roboto.className}`}
					>
						<span className={`opacity-70 ${accentYellow} mr-4 md:mr-6`}>
							{"{"}
						</span>
						<span>
							<TextRoll
								className=" dark:text-black text-white"
								variants={{
									enter: {
										initial: { rotateX: 0, filter: "blur(0px)" },
										animate: { rotateX: 90, filter: "blur(2px)" },
									},
									exit: {
										initial: { rotateX: 90, filter: "blur(2px)" },
										animate: { rotateX: 0, filter: "blur(0px)" },
									},
								}}
							>
								{t("birthday.youAreInvited")}
							</TextRoll>
						</span>
						<span className={`opacity-70 ${accentYellow} ml-4 md:ml-6`}>
							{"}"}
						</span>
					</div>
					<Cake
						className={`mx-auto mb-4 ${accentBlue} cursor-pointer hover:scale-110 transition-transform duration-1500 animate-bounce`}
						size={150}
						strokeWidth={1.5}
					/>
					<div className="font-extrabold text-8xl md:text-9xl text-accent/90">
						<NumberTicker
							from={0}
							target={age}
							autoStart={true}
							transition={{ duration: 3.5, type: "tween", ease: "easeInOut" }}
							onComplete={() => console.log("complete")}
							onStart={() => console.log("start")}
						/>
					</div>
					<p className="text-4xl md:text-6xl font-bold tracking-wider">
						{t("birthday.yearsOld")}
					</p>
				</div>
				<hr className="w-1/3 md:w-1/4 mx-auto border-accent/40 my-8" />
				<p className="text-5xl md:text-7xl lg:text-8xl font-bold text-left px-4 md:px-0 break-words">
					<span
						className={`underline decoration-yellow-400 decoration-3 underline-offset-[12px]`}
					>
						{name}
					</span>{" "}
					{t("birthday.birthdayParty")}
				</p>
				<p className="text-xl md:text-2xl text-accent/80 mt-6 px-4 text-left max-w-4xl">
					<PartyPopper
						className={`inline-block w-6 h-6 mr-2 ${accentYellow}`}
					/>
					<BreathingText
						label={themeOrMessage}
						staggerDuration={0.5}
						fromFontVariationSettings="'wght' 100, 'slnt' 0"
						toFontVariationSettings="'wght' 800, 'slnt' -10"
					/>
				</p>
			</div>

			<div className="flex flex-col md:flex-row justify-around items-stretch py-10 md:py-12 flex-wrap border-t-2 border-b-2 border-accent/30 my-10 md:my-16 gap-8 md:gap-x-6">
				<div className="flex flex-col items-center justify-start gap-3 m-4 p-6 rounded border border-accent/20 shadow-sm shadow-accent/5 text-center flex-1 min-w-[280px] md:min-w-[320px] bg-accent-foreground/30 backdrop-blur-sm">
					<div className="flex items-center gap-3 mb-2">
						<Calendar size={40} strokeWidth={2.5} className={`${accentBlue}`} />
						<Clock size={40} strokeWidth={2.5} className={`${accentBlue}`} />
					</div>
					<span className="text-3xl md:text-4xl font-bold bg-accent/10 px-4 py-1 rounded block w-full">
						{formattedDate}
					</span>
					<span className="text-3xl md:text-4xl font-bold bg-accent/10 px-4 py-1 rounded block w-full">
						{formattedTime}
					</span>
				</div>

				<div className="flex flex-col items-center justify-start gap-3 m-4 p-6 rounded border border-accent/20 shadow-sm shadow-accent/5 text-center flex-1 min-w-[280px] md:min-w-[320px] bg-accent-foreground/30 backdrop-blur-sm">
					<MapPin
						size={50}
						strokeWidth={2.5}
						className={`${accentBlue} mb-2`}
					/>
					<span className="text-3xl md:text-4xl font-bold bg-accent/10 px-4 py-1 rounded block w-full">
						{location}
					</span>
					{address && (
						<span className="text-xl md:text-2xl text-accent/90 px-2 py-1 rounded block w-full mt-1">
							{address}
						</span>
					)}
					{hasMapLink && (
						<Link
							className={`flex gap-2 items-center justify-center underline hover:no-underline ${accentBlue} transition-colors duration-200 text-xl md:text-2xl font-bold mt-3 bg-accent/10 px-4 py-2 rounded hover:bg-accent/20 w-full`}
							href={mapHref}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Map size={22} strokeWidth={2.5} className="inline-block" />
							<span>{t("birthday.viewMapDirections")}</span>
							<SquareArrowOutUpRight
								size={22}
								strokeWidth={2.5}
								className="inline-block"
							/>
						</Link>
					)}
				</div>
			</div>

			<div className="my-10 md:my-16 px-4 md:px-8 flex flex-col md:flex-row gap-8 justify-center">
				{dressCode && (
					<div className="text-center md:text-left p-4 border border-accent/30 rounded flex-1 min-w-[250px] max-w-md bg-accent-foreground/30 backdrop-blur-sm">
						<h3
							className={`text-2xl font-bold mb-3 flex items-center justify-center md:justify-start gap-2 ${accentYellow}`}
						>
							<Users size={24} /> {t("birthday.attire")}
						</h3>
						<p className="text-lg text-accent/90">{dressCode}</p>
					</div>
				)}
				{giftInfo && (
					<div className="text-center md:text-left p-4 border border-accent/30 rounded flex-1 min-w-[250px] max-w-md bg-accent-foreground/30 backdrop-blur-sm">
						<h3
							className={`text-2xl font-bold mb-3 flex items-center justify-center md:justify-start gap-2 ${accentYellow}`}
						>
							<Gift size={24} /> {t("birthday.gifts")}
						</h3>
						<p className="text-lg text-accent/90">{giftInfo}</p>
					</div>
				)}
			</div>

			<div className="flex flex-col items-center justify-center mb-12 md:mb-16">
				<div className="text-center p-6 md:p-10 w-full md:w-2/3 lg:w-1/2 border-2 border-accent/60 rounded-lg m-4 shadow-lg shadow-accent/5 bg-accent-foreground/50 backdrop-blur-sm">
					<p className="text-3xl md:text-4xl font-bold mb-8 flex items-center justify-center gap-3">
						<Sparkles className={`${accentYellow}`} size={30} />
						{t("birthday.willYouCelebrateWithUs")}
						<Sparkles className={`${accentYellow}`} size={30} />
					</p>
					<form
						className="flex flex-col items-start gap-6"
						onSubmit={handleSubmit}
					>
						<input
							type="text"
							name="guestName"
							placeholder={t("birthday.yourNamePlaceholder")}
							required
							onChange={(e) =>
								setRsvpForm({ ...rsvpForm, name: e.target.value })
							}
							className={`text-xl p-3 border-2 border-accent/50 bg-accent-foreground text-accent w-full md:w-3/4 placeholder-gray-500 rounded focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-200`}
						/>
						<div className="flex gap-6 items-start flex-col justify-start w-full">
							<label className="text-2xl flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-accent/10 w-full transition-colors duration-200">
								<input
									type="radio"
									name="attendance"
									value="going"
									required
									onChange={(e) =>
										setRsvpForm({
											...rsvpForm,
											attendance: e.target.value as "going",
										})
									}
									className={`w-5 h-5 accent-blue-400`}
								/>
								{t("birthday.attendanceYes")}
							</label>
							<label className="text-2xl flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-accent/10 w-full transition-colors duration-200">
								<input
									type="radio"
									name="attendance"
									value="notGoing"
									required
									onChange={(e) =>
										setRsvpForm({
											...rsvpForm,
											attendance: e.target.value as "notGoing",
										})
									}
									className={`w-5 h-5 accent-blue-400`}
								/>
								{t("birthday.attendanceNo")}
							</label>
						</div>
						<button
							type="submit"
							disabled={!id}
							className={`disabled:cursor-not-allowed text-xl md:text-2xl font-bold border-2 border-yellow-400 ${accentYellow} py-3 px-8 hover:bg-yellow-400 hover:text-accent-foreground transition-all duration-300 ease-in-out cursor-pointer rounded-md shadow-sm hover:shadow-md active:scale-95 w-full md:w-auto flex items-center justify-center gap-2`}
						>
							<Send size={20} /> {t("birthday.sendRSVP")}
						</button>
					</form>
				</div>

				{(rsvpDeadlineFormatted !== t("birthday.defaultRSVPDeadline") ||
					contactInfo) && (
					<div className="mt-6 text-center text-accent/70 text-lg px-4">
						{rsvpDeadlineFormatted !== t("birthday.defaultRSVPDeadline") && (
							<p className="mb-2">
								{t("birthday.pleaseRSVPBy")}{" "}
								<span className={`font-bold ${accentYellow}`}>
									{rsvpDeadlineFormatted}
								</span>
							</p>
						)}
						{contactInfo && (
							<p>
								{t("birthday.questionsContact")}{" "}
								<span
									className={`font-bold ${accentBlue} underline decoration-dotted`}
								>
									{contactInfo}
								</span>
							</p>
						)}
					</div>
				)}
			</div>

			<footer className="text-center text-accent/60 text-base mt-12 border-t border-accent/20 pt-6">
				<Info size={18} className="inline mr-1" />{" "}
				{t("birthday.footerMessage" )}{ name},{age }
			</footer>
		</div>
	);
};
