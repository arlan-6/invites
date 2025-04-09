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
} from "../motion-primitives/dialog";
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
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import { authClient } from "@/auth-client";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useLanguage } from "../language-provider";
import { redirect } from "next/navigation";
import WhatsAppButton from "../whatsapp-button";
import useInviteStore from "@/store/inviteEdit";
import useAdvancedInviteStore, { AdvancedInviteData } from "@/store/advancedInviteEdit";
import useTemplateStore from "@/store/advancedTemplate";
import { AdvancedInvite } from "@prisma/client";
import { CreateAdvancedInvite } from "@/lib/advancedInvitesUtils";

interface ShareDialogButtonProps {
	className?: string;

	shareText?: string;
}

export const ShareDialogButton: FC<ShareDialogButtonProps> = ({
	shareText,
}) => {
	const [open, setOpen] = useState(false);
	const [creating, setCreating] = useState(false);
	const [createdInvite, setCreatedInvite] = useState<AdvancedInvite | null>(
		null,
	);
	const isready = useAdvancedInviteStore().isReady;
	const { data, isPending, error } = authClient.useSession();

	const handleOpenHange = async (open: boolean) => {
		setOpen(open);
		if (open) {
			const isReady = isready();

			if (!isReady) {
				toast.error("Please fill all required fields");
				setOpen(false);
				return;
			}
			if (!data || !data.user || error || isPending) {
				toast.error("Please login to share your invite");
				setOpen(false);
				return;
			}

			try {
				setCreating(true);
				const InviteData = useAdvancedInviteStore.getState().inviteData;
				const path = useTemplateStore.getState().path;
				const userId = data.user.id;
				const templateId = useTemplateStore.getState().id;
				if (!path) {
					toast.error("Path is not set");
					return;
				}
				if (!templateId) {
					toast.error("Template ID is not set");
					return;
				}
				if (!userId) {
					toast.error("User ID is not set");
					return;
				}
				const invite = await CreateAdvancedInvite(
					InviteData,
					path,
					userId,
					templateId,
				);
				if (!invite) {
					toast.error("Error creating invite!");
					setOpen(false);
					return;
				}
				setCreatedInvite(invite);
			} catch (error) {
				toast.error("Error creating invite!");

				setOpen(false);
				setCreating(false);
			}
		}
		else{
			if (createdInvite) {
				setCreatedInvite(null);
				redirect("/dashboard")
			}
		}
	};
	return (
		<Dialog defaultOpen={false} onOpenChange={handleOpenHange} open={open}>
			<DialogTrigger>Publish</DialogTrigger>
			<DialogContent className="p-5">
				<DialogHeader>
					<DialogTitle>Edit profile</DialogTitle>
					<DialogDescription>
						<div className="">
							{creating && <div>Creating ang Publishing invite</div>}
						</div>
						<div className="">
							{createdInvite && (
								<div className="flex flex-col gap-2">
									<div className="flex gap-2 items-center">
										<Share2 size={20} />
										<span>Invite link</span>
									</div>
									<Link
										href={`/invite/${createdInvite.id}`}
										className="text-blue-500"
									>
										{`/invite/${createdInvite.path}/${createdInvite.id}`}
									</Link>
								</div>
							)}
						</div>
						Make changes to your profile here. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				kls
			</DialogContent>
		</Dialog>
	);
};

