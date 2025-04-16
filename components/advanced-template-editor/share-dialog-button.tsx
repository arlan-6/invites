"use client";

import React, { FC, useState, useCallback } from "react";
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
import useAdvancedInviteStore, {
	AdvancedInviteData,
} from "@/store/advancedInviteEdit";
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

	const isReady = useAdvancedInviteStore().isReady;
	const { data, isPending, error } = authClient.useSession();

	// Helper function to validate required fields
	const validateFields = useCallback(() => {
		const path = useTemplateStore.getState().path;
		const templateId = useTemplateStore.getState().id;
		const userId = data?.user?.id;

		if (!path) {
			toast.error("Path is not set");
			return false;
		}
		if (!templateId) {
			toast.error("Template ID is not set");
			return false;
		}
		if (!userId) {
			toast.error("User ID is not set");
			return false;
		}
		return { path, templateId, userId };
	}, [data]);

	const handleOpenChange = useCallback(
		async (open: boolean) => {
			setOpen(open);

			if (open) {
				if (!isReady()) {
					setOpen(false);
					return;
				}

				if (!data || error || isPending) {
					toast.error("Please login to share your invite");
					setOpen(false);
					return;
				}

				const validation = validateFields();
				if (!validation) {
					setOpen(false);
					return;
				}

				try {
					setCreating(true);
					const { path, templateId, userId } = validation;
					const inviteData = useAdvancedInviteStore.getState().inviteData;

					const invite = await CreateAdvancedInvite(
						inviteData,
						path,
						userId,
						templateId,
					);
					if (!invite) {
						throw new Error("Error creating invite");
					}

					setCreatedInvite(invite);
				} catch (err) {
					toast.error((err as Error)?.message || "Error creating invite!");
					setOpen(false);
				} finally {
					setCreating(false);
				}
			} else {
				if (createdInvite) {
					setCreatedInvite(null);
					redirect("/dashboard");
				}
			}
		},
		[isReady, data, error, isPending, validateFields, createdInvite],
	);

	return (
		<Dialog defaultOpen={false} onOpenChange={handleOpenChange} open={open}>
			<DialogTrigger>Publish</DialogTrigger>
			<DialogContent className="p-5">
				<DialogHeader>
					<DialogTitle>Publish Invite</DialogTitle>
					<DialogDescription>
						<div>
							{creating && <span className="animate-pulse">Creating and Publishing invite...</span>}
						</div>
						<div>
							{createdInvite && (
								<div className="flex flex-col gap-2">
									<div className="flex gap-2 items-center">
										<Share2 size={20} />
										<span>Invite link</span>
									</div>
									<Link
										href={`/invite/${createdInvite.path}/${createdInvite.id}`}
										target="_blank"
										onClick={() => {
											redirect("/dashboard");
										}}
										className="text-blue-500"
									>
										{`/invite/${createdInvite.path}/${createdInvite.id}`}
									</Link>
								</div>
							)}
						</div>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};
