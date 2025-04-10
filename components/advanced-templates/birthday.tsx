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
	// Home, // Removed unused icon
	Sparkles,
	Gift,
	Info,
	Send,
	PartyPopper,
	Users,
	Map,
	LoaderIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PostRsvpTrackById } from "@/lib/advancedInvitesUtils"; // Assuming this exists
import { TextRoll } from "../motion-primitives/text-roll"; // Assuming this exists
import NumberTicker from "@/fancy/components/text/basic-number-ticker"; // Assuming this exists
import BreathingText from "@/fancy/components/text/breathing-text"; // Assuming this exists
import { useLanguage } from "../language-provider"; // Assuming this exists

// Helper function for formatting (ensure path is correct)
// import { formatDate } from "@/lib/formatDateUtils"; // Or keep it inline if preferred

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

// Keep formatDate inline for simplicity here, or import it
const formatDate = (isoDate?: string): string => {
	if (!isoDate) return "TBC";
	try {
		// Add explicit time to avoid timezone issues based solely on date
		const dateObj = new Date(isoDate + "T00:00:00Z"); // Assuming UTC date input
		return dateObj.toLocaleDateString(undefined, {
			// Use locale default
			year: "numeric",
			month: "short",
			day: "numeric",
			timeZone: "UTC", // Specify timezone if the input date has no offset
		});
	} catch {
		return isoDate; // Fallback if parsing fails
	}
};

export const Birthday: FC<birthdayProps> = ({ className, inviteData, id }) => {
	const { t } = useLanguage(); // Ensure language provider setup
	const [numberTickerComplete, setNumberTickerComplete] = useState(false);

	const [rsvpForm, setRsvpForm] = useState<{
		name: string;
		attendance: "going" | "notGoing";
	}>({
		name: "",
		attendance: "notGoing", // Default to notGoing? Or maybe empty initially?
	});
	const [rsvpSending, setRsvpSending] = useState(false); // Optional state for loading

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
				hour12: true, // Using 12-hour format is common for invites
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
		: t("birthday.defaultRSVPDeadline"); // Check if TBC is better than a default phrase here
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
	const accentBlue = "text-blue-400"; // Renamed from text-cyan-400 for clarity if needed

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!id) {
			toast.error(t("birthday.missingInviteID"));
			return;
		}
		if (!rsvpForm.name || !rsvpForm.attendance) {
			toast.error(t("birthday.rsvpFormIncomplete"));
			return;
		}
		setRsvpSending(true); // Optional loading state
		try {
			const invite = await PostRsvpTrackById(id, {
				name: rsvpForm.name,
				attendance: rsvpForm.attendance,
				answerDate: new Date(),
			});
			if (!invite) {
				// Or check response status if PostRsvpTrackById returns more info
				throw new Error("RSVP submission failed");
			}
			setRsvpSending(false); // Reset loading state
			toast.message(
				t("birthday.rsvpSubmissionSuccess", { name: rsvpForm.name }),
			); // Personalize confirmation
			// Optionally reset form or show a success message inline
			// setRsvpForm({ name: '', attendance: 'notGoing' }); // Reset form state
			setRsvpForm({ name: "", attendance: "notGoing" }); // Reset form state
		} catch (error) {
			setRsvpSending(false); // Reset loading state
			console.error("RSVP Error:", error);
			toast.error(t("birthday.rsvpSubmissionFailed"));
		}
	};

	return (
		<div
			className={cn(
				// Base styles: dark background, light text, padding, font
				"w-full bg-accent-foreground text-accent p-4 sm:p-6 md:p-10 min-h-screen font-normal overflow-x-hidden", // Prevent horizontal scroll
				className,
				roboto.variable, // Make sure the variable is applied to the root or body
				"font-mono", // Apply the mono font family using the variable
			)}
		>
			{/* === HEADER SECTION === */}
			<div className="text-center mb-10 md:mb-16">
				<div className="py-8 md:py-10">
					{/* --- "You're Invited" Title --- */}
					<div
						className={`flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold mb-10 md:mb-16 tracking-wider relative`}
					>
						<span className={`opacity-70 ${accentYellow} mr-3 sm:mr-4 md:mr-6`}>
							{"{"}
						</span>
						<span>
							{/* Using simple text for now, TextRoll can be added back if needed */}
							{t("birthday.youAreInvited")}
						</span>
						<span className={`opacity-70 ${accentYellow} ml-3 sm:ml-4 md:ml-6`}>
							{"}"}
						</span>
					</div>

					{/* --- Cake Icon & Age --- */}
					<Cake
						className={`mx-auto mb-4 ${accentBlue} transition-transform duration-1500 animate-bounce-slow`} // Using custom bounce animation
						size={100} // Smaller size for mobile
						md-size={150} // Larger size for medium screens and up
						strokeWidth={1.5}
						style={{ animationDuration: "2s" }} // Slower bounce
					/>
					<div
						className={cn(
							// Responsive font size for age, increased scale on complete
							"font-extrabold text-7xl sm:text-8xl md:text-9xl text-accent/90 transition-transform duration-500 w-full",
							{
								"scale-125 md:scale-150": numberTickerComplete, // Slightly less scale on smaller screens
							},
						)}
					>
						<NumberTicker
							from={0}
							target={age}
							autoStart={true}
							transition={{ duration: 3.5, type: "tween", ease: "easeInOut" }}
							onComplete={() => {
								// Add a small delay before setting complete to allow animation finish
								setTimeout(() => setNumberTickerComplete(true), 100);
							}}
						/>
					</div>
					<p className="text-3xl sm:text-4xl font-bold tracking-wider mt-1">
						{t("birthday.yearsOld")}
					</p>
				</div>

				{/* --- Divider --- */}
				<hr className="w-1/3 md:w-1/4 mx-auto border-accent/30 my-6 md:my-8" />

				{/* --- Person's Name & Party Type --- */}
				<p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-left px-2 sm:px-4 md:px-0 break-words">
					<span
						className={`underline decoration-yellow-400 decoration-3 underline-offset-[8px] md:underline-offset-[12px]`} // Adjusted underline offset
					>
						{name}
					</span>
					{"'s"}
					<br className="sm:hidden" /> {/* Break line on mobile only */}
					<span className="ml-0 sm:ml-4">{t("birthday.birthdayParty")}</span>
				</p>

				{/* --- Theme/Message --- */}
				<p className="text-lg sm:text-xl text-accent/80 mt-6 px-2 sm:px-4 text-left max-w-full md:max-w-4xl mx-auto">
					<PartyPopper
						className={`inline-block w-5 h-5 sm:w-6 sm:h-6 mr-2 ${accentYellow}`}
					/>
					{/* BreathingText could be complex on performance/mobile, consider simpler display first */}
					<span className="italic">{themeOrMessage}</span>
					{/* If BreathingText is desired:
                     <BreathingText
						label={themeOrMessage}
						staggerDuration={0.5}
						fromFontVariationSettings="'wght' 100, 'slnt' 0"
						toFontVariationSettings="'wght' 800, 'slnt' -10"
					/> */}
				</p>
			</div>

			{/* === DATE/TIME & LOCATION SECTION === */}
			<div className="flex flex-col md:flex-row justify-around items-stretch py-8 md:py-12 flex-wrap border-t-2 border-b-2 border-accent/30 my-8 md:my-12 gap-6 sm:gap-8">
				{/* --- Date & Time Card --- */}
				<div className="flex flex-col items-center justify-start gap-2 m-2 p-4 sm:p-6 rounded border border-accent/20 shadow-sm shadow-accent/10 text-center w-full md:flex-1 bg-accent-foreground/30 backdrop-blur-sm">
					<div className="flex items-center gap-3 mb-2">
						<Calendar
							size={32}
							sm-size={40}
							strokeWidth={2}
							className={`${accentBlue}`}
						/>
						<Clock
							size={32}
							sm-size={40}
							strokeWidth={2}
							className={`${accentBlue}`}
						/>
					</div>
					<span className="text-2xl sm:text-3xl font-bold bg-accent/10 px-4 py-1 rounded block w-full">
						{formattedDate}
					</span>
					<span className="text-2xl sm:text-3xl font-bold bg-accent/10 px-4 py-1 rounded block w-full mt-1">
						{formattedTime}
					</span>
				</div>

				{/* --- Location Card --- */}
				<div className="flex flex-col items-center justify-start gap-2 m-2 p-4 sm:p-6 rounded border border-accent/20 shadow-sm shadow-accent/10 text-center w-full md:flex-1 bg-accent-foreground/30 backdrop-blur-sm">
					<MapPin
						size={40}
						sm-size={50} // Slightly adjusted size
						strokeWidth={2}
						className={`${accentBlue} mb-2`}
					/>
					<span className="text-2xl sm:text-3xl font-bold bg-accent/10 px-4 py-1 rounded block w-full">
						{location}
					</span>
					{address && (
						<span className="text-base sm:text-lg text-accent/90 px-2 py-1 rounded block w-full mt-1">
							{address}
						</span>
					)}
					{hasMapLink && (
						<Link
							className={`flex gap-2 items-center justify-center underline hover:no-underline ${accentBlue} transition-colors duration-200 text-base sm:text-lg font-semibold mt-3 bg-accent/10 px-4 py-2 rounded hover:bg-accent/20 w-full`}
							href={mapHref}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Map
								size={18}
								sm-size={20}
								strokeWidth={2.5}
								className="inline-block"
							/>
							<span>{t("birthday.viewMapDirections")}</span>
							<SquareArrowOutUpRight
								size={18}
								sm-size={20}
								strokeWidth={2.5}
								className="inline-block ml-1"
							/>
						</Link>
					)}
				</div>
			</div>

			{/* === DRESS CODE & GIFT INFO SECTION === */}
			<div className="my-8 md:my-12 px-2 sm:px-4 md:px-8 flex flex-col md:flex-row gap-6 sm:gap-8 justify-center">
				{/* --- Attire Card --- */}
				{dressCode && (
					<div className="text-center md:text-left p-4 sm:p-5 border border-accent/30 rounded w-full md:flex-1 md:max-w-md bg-accent-foreground/30 backdrop-blur-sm">
						<h3
							className={`text-xl sm:text-2xl font-bold mb-3 flex items-center justify-center md:justify-start gap-2 ${accentYellow}`}
						>
							<Users size={20} sm-size={24} /> {t("birthday.attire")}
						</h3>
						<p className="text-base sm:text-lg text-accent/90">{dressCode}</p>
					</div>
				)}
				{/* --- Gift Card --- */}
				{giftInfo && (
					<div className="text-center md:text-left p-4 sm:p-5 border border-accent/30 rounded w-full md:flex-1 md:max-w-md bg-accent-foreground/30 backdrop-blur-sm">
						<h3
							className={`text-xl sm:text-2xl font-bold mb-3 flex items-center justify-center md:justify-start gap-2 ${accentYellow}`}
						>
							<Gift size={20} sm-size={24} /> {t("birthday.gifts")}
						</h3>
						<p className="text-base sm:text-lg text-accent/90">{giftInfo}</p>
					</div>
				)}
			</div>

			{/* === RSVP SECTION === */}
			<div className="flex flex-col items-center justify-center my-10 md:my-16">
				{/* --- RSVP Form Box --- */}
				<div className="text-center p-4 sm:p-6 md:p-8 lg:p-10 w-full sm:w-11/12 md:w-2/3 lg:w-1/2 border-2 border-accent/50 rounded-lg m-2 sm:m-4 shadow-lg shadow-accent/15 bg-accent-foreground/50 backdrop-blur-sm">
					<p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 flex items-center justify-center gap-2 sm:gap-3">
						<Sparkles className={`${accentYellow}`} size={24} sm-size={30} />
						{t("birthday.willYouCelebrateWithUs")}
						<Sparkles className={`${accentYellow}`} size={24} sm-size={30} />
					</p>
					<form
						className="flex flex-col items-start gap-4 sm:gap-6" // Adjusted gap
						onSubmit={handleSubmit}
					>
						{/* --- Name Input --- */}
						<input
							type="text"
							name="guestName"
							value={rsvpForm.name} // Controlled component
							placeholder={t("birthday.yourNamePlaceholder")}
							required
							aria-label={t("birthday.yourNamePlaceholder")}
							onChange={(e) =>
								setRsvpForm({ ...rsvpForm, name: e.target.value })
							}
							className={`text-base sm:text-lg p-3 border-2 border-accent/40 bg-accent-foreground/80 text-accent w-full placeholder-gray-400 rounded focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-200`}
						/>
						{/* --- Attendance Radios --- */}
						<div className="flex gap-3 sm:gap-4 items-start flex-col justify-start w-full text-left">
							<label className="text-lg sm:text-xl flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-accent/10 w-full transition-colors duration-200">
								<input
									type="radio"
									name="attendance"
									value="going"
									required
									checked={rsvpForm.attendance === "going"}
									onChange={(e) =>
										setRsvpForm({
											...rsvpForm,
											attendance: e.target.value as "going",
										})
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 accent-blue-400`}
								/>
								{t("birthday.attendanceYes")}
							</label>
							<label className="text-lg sm:text-xl flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-accent/10 w-full transition-colors duration-200">
								<input
									type="radio"
									name="attendance"
									value="notGoing"
									required
									checked={rsvpForm.attendance === "notGoing"}
									onChange={(e) =>
										setRsvpForm({
											...rsvpForm,
											attendance: e.target.value as "notGoing",
										})
									}
									className={`w-4 h-4 sm:w-5 sm:h-5 accent-blue-400`}
								/>
								{t("birthday.attendanceNo")}
							</label>
						</div>
						{/* --- Submit Button --- */}
						<button
							type="submit"
							disabled={
								!id || !rsvpForm.name || !rsvpForm.attendance || rsvpSending
							} // Disable if no id or incomplete form
							className={`disabled:cursor-not-allowed disabled:opacity-60 text-lg sm:text-xl font-bold border-2 border-yellow-400 ${accentYellow} py-3 px-6 sm:px-8 hover:bg-yellow-400 hover:text-accent-foreground transition-all duration-300 ease-in-out cursor-pointer rounded-md shadow-sm hover:shadow-md active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2 mt-2`} // Full width on mobile, auto on larger
						>
							{rsvpSending ? (
								<span className="flex gap-3 items-center"><LoaderIcon className="animate-spin"/> {t("birthday.sendRSVPLoading")}</span> // Loading spinner or text
							) : (
								<>
									<Send size={18} sm-size={20} /> {t("birthday.sendRSVP")}
								</>
							)}
						</button>
					</form>
				</div>

				{/* --- RSVP Deadline & Contact Info --- */}
				{(rsvpDeadlineFormatted !== t("birthday.defaultRSVPDeadline") ||
					contactInfo) && ( // Conditionally render container
					<div className="mt-6 text-center text-accent/70 text-base sm:text-lg px-4">
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
									className={`font-bold ${accentBlue} underline decoration-dotted underline-offset-2`} // Added underline style
								>
									{contactInfo}
								</span>
							</p>
						)}
					</div>
				)}
			</div>

			{/* === FOOTER === */}
			<footer className="text-center text-accent/60 text-sm sm:text-base mt-10 md:mt-12 border-t border-accent/20 pt-6">
				<Info size={16} sm-size={18} className="inline mr-1" />{" "}
				{/* Adjusted template literal usage */}
				{t("birthday.footerMessage", { name: name, age: age })}
			</footer>

			{/* Add custom bounce animation styles (can be in global css or style jsx) */}
			<style jsx global>{`
				@keyframes bounce-slow {
					0%,
					100% {
						transform: translateY(-10%);
						animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
					}
					50% {
						transform: translateY(0);
						animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
					}
				}
				.animate-bounce-slow {
					animation: bounce-slow 2s infinite; /* Use 2s duration from above */
				}
			`}</style>
		</div>
	);
};
