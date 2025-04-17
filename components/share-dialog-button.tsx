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
	const [shareLink, setShareLink] = useState<string | null>(null);
	const [directShareLink, setDirectShareLink] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [isFailed, setIsFailed] = useState<boolean>(false);
	const { data: session, isPending } = authClient.useSession();
	const { t } = useLanguage();
	const { updateInviteData } = useInviteStore();

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
				expiresAt: new Date(new Date(`${inviteData.date}T${inviteData.time}`).getTime() + 7 * 24 * 60 * 60 * 1000), // Add 1 week to the expiration date
				role: session?.user?.role || "user", // Assuming "user" as the default role
			};

			// Create a new invite
			const newInvite = await createInvite(invitePayload);

			// Generate share links
			const compressedData = LZString.compressToEncodedURIComponent(
				JSON.stringify({ templateId, inviteData }),
			);

			setShareLink(`${window.location.origin}/invite/${compressedData}`);
			setDirectShareLink(`${window.location.origin}/invite/${newInvite.id}`);
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
				title: "",
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
	}, []);

	return (
		<Dialog
			onOpenChange={(isOpen) => {
				if (isOpen) {
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
						<Link href="/sign-up">
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
								<Input value={directShareLink} readOnly />
								<Button
									variant="outline"
									onClick={() => copyHandler(directShareLink)}
								>
									<Copy strokeWidth={1} />
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

				{!shareLink && !loading && (
					<div className="text-center text-red-500">No data to share!</div>
				)}
				<br />
				<Link href={"/dashboard"}>
					<Button variant={"outline"}>Go to dashboard</Button>
				</Link>
				<DialogClose />
			</DialogContent>
		</Dialog>
	);
};
