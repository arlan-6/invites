"use client";

import React, { FC, useState, useCallback, useMemo } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./motion-primitives/dialog";
import LZString from "lz-string";
import {
	ArrowLeft,
	ArrowRight,
	Copy,
	CopyCheck,
	Phone,
	Share2,
	SquareArrowOutUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import { authClient } from "@/auth-client";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useLanguage } from "./language-provider";
import { createInvite } from "@/lib/inviteUtils";
import { redirect } from "next/navigation";
import WhatsAppButton from "./whatsapp-button";
import useInviteStore from "@/store/inviteEdit";
import { cn } from "@/lib/utils";

interface ShareDialogButtonProps {
	className?: string;
	templateId: string;
	inviteData: {
		title?: string;
		date?: string;
		time?: string;
		location?: string;
		message?: string;
	};
	shareText?: string;
}

export const ShareDialogButton: FC<ShareDialogButtonProps> = ({
	templateId,
	inviteData,
	shareText,
}) => {
	const [dialogOpen, setDialogopen] = useState<boolean>(false);
	const [shareLink, setShareLink] = useState<string | null>(null);
	const [directShareLink, setDirectShareLink] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [isFailed, setIsFailed] = useState<boolean>(false);
	const { data: session, isPending, refetch } = authClient.useSession();
	const { t } = useLanguage();
	const { updateInviteData } = useInviteStore();
	const [copied, setCopied] = useState<boolean>(false);

	const isInviteDataValid = useMemo(() => {
		return (
			inviteData &&
			inviteData.title &&
			inviteData.date &&
			inviteData.time &&
			inviteData.location
		);
	}, [inviteData]);

	const handleDialogOpen = useCallback(async () => {
		if (!isInviteDataValid) {
			setShareLink(null);
			setDirectShareLink(null);
			toast.error("Invalid invite data. Please fill in all required fields.");
			return;
		}
		if (!session || !session.user) {
			toast.error("Sign in first!");
			return;
		}

		try {
			setLoading(true);

			// Prepare invite payload
			const invitePayload = {
				title: inviteData.title as string,
				date: new Date(`${inviteData.date}T${inviteData.time}`),
				location: inviteData.location || "",
				message: inviteData.message || "",
				userId: session?.user?.id || "",
				templateId,
				expiresAt: new Date(
					new Date(`${inviteData.date}T${inviteData.time}`).getTime() +
						7 * 24 * 60 * 60 * 1000,
				), // Add 1 week to the expiration date
				role: session?.user?.role || "user", // Assuming "user" as the default role
			};

			// Create a new invite
			const newInvite = await createInvite(invitePayload);

			// Generate share links
			// const compressedData = LZString.compressToEncodedURIComponent(
			// 	JSON.stringify({ templateId, inviteData }),
			// );

			// setShareLink(`${window.location.origin}/invite/${compressedData}`);
			setDirectShareLink(`${window.location.origin}/invite/${newInvite.id}`);
			// refetch();
			// console.log(session.user.credits);
			// const c = session.user.credits-1
			// await authClient.updateUser({
			// 	credits: c,
			// });
			// refetch();

			toast.success("Invite created successfully!");
		} catch (err: any) {
			console.error("Error generating share links:", err);
			setIsFailed(true);
			toast.error(
				err.message || "Failed to generate share links. Please try again.",
			);
		} finally {
			setLoading(false);
			updateInviteData({
				eventTitle: "",
				eventDate: "",
				eventTime: "",
				eventLocation: "",
				eventMessage: "",
			});
		}
	}, [isInviteDataValid, inviteData, session?.user?.id, templateId]);

	const copyHandler = useCallback((link: string | null) => {
		if (!link) return;
		navigator.clipboard.writeText(link);
		toast.success("Link copied to clipboard!");
		setCopied(true); // Set the ID of the copied invite
		setTimeout(() => {
			setCopied(false); // Reset after 2 seconds
		}, 2000);
	}, []);

	return (
		<Dialog
			open={dialogOpen}
			onOpenChange={(isOpen) => {
				if (isOpen) {
					setDialogopen(true);
					handleDialogOpen();
				} else if (!isFailed) {
					redirect("/dashboard");
				}
			}}
		>
			<HoverCard>
				<HoverCardTrigger>
					<DialogTrigger
						disabled={!session || isPending || !isInviteDataValid}
						className="shadow"
					>
						<>
							{!session
								? t("inviteEditor.needSignUp")
								: !loading
								? shareText
								: "Loading..."}
							<Share2 size={16} strokeWidth={1.5} />
						</>
					</DialogTrigger>
				</HoverCardTrigger>
				<HoverCardContent hidden={!(!session || isPending)}>
					<div className="mb-2">🚫 {t("inviteEditor.needSignUp")} ✨</div>
					<div className="flex items-center justify-center">
						<ArrowRight className="text-primary motion-preset-wobble motion-duration-1000 motion-delay-500 mr-1" />
						<Link href="/log-in-google">
							<Button variant="default">{t("navigation.signup")}</Button>
						</Link>
						<ArrowLeft className="text-primary motion-preset-wobble motion-duration-1000" />
					</div>
				</HoverCardContent>
			</HoverCard>

			<DialogContent className="w-full max-w-md bg-white p-6 dark:bg-zinc-900">
				<DialogHeader>
					<DialogTitle className="text-zinc-900 dark:text-white">
						{shareText}
					</DialogTitle>
					<DialogDescription className="text-zinc-600 dark:text-zinc-400">
						<span>{t("inviteEditor.dialogCloseText")} </span>
						<br />
						<br />
						<span>{t("inviteEditor.dialogLinkText")}</span>
					</DialogDescription>
				</DialogHeader>

				{loading ? (
					<div className="text-center text-gray-500">Generating links...</div>
				) : (
					<>
						{shareLink && (
							<div className="flex items-center gap-2 mb-4">
								{/* <Input value={shareLink} readOnly />
								<Button
									variant="outline"
									onClick={() => copyHandler(shareLink)}
								>
									<Copy strokeWidth={1} />
								</Button>
								<WhatsAppButton text={encodeURIComponent(shareLink)} /> */}
							</div>
						)}

						{directShareLink && (
							<div className="flex items-center gap-2">
								<Input
									value={directShareLink}
									readOnly
									onClick={(e) => {
										(e.target as HTMLInputElement).select();
									}}
								/>
								<Button
									variant="outline"
									onClick={() => copyHandler(directShareLink)}
									disabled={copied}
									className="relative flex items-center justify-center px-5"
								>
									<span
										className={cn(
											"absolute transition-transform duration-300 ease-in-out",
											copied
												? "opacity-0 scale-0" // Shrink and fade out
												: "opacity-100 scale-100", // Normal state
										)}
									>
										<Copy size={16} strokeWidth={1.5} />
									</span>
									<span
										className={cn(
											"absolute transition-transform duration-300 ease-in-out",
											copied
												? "opacity-100 scale-130 text-green-400" // Success state
												: "opacity-0 scale-0", // Shrink and fade out
										)}
									>
										<CopyCheck size={16} strokeWidth={1.5} />
									</span>
								</Button>
								<WhatsAppButton text={directShareLink} />
								<Link
									href={directShareLink}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Button>
										<SquareArrowOutUpRight />
									</Button>
								</Link>
							</div>
						)}
					</>
				)}

				{!directShareLink && !loading && (
					<div className="text-center text-red-500">No data to share!</div>
				)}
				<br />
				<Link href={"/dashboard"}>
					<Button variant={"link"}>{t('inviteEditor.goToDashboard')}</Button>
				</Link>
				<DialogClose />
			</DialogContent>
		</Dialog>
	);
};
