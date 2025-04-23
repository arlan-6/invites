"use client";

import React, { useState } from "react";
import { Invite, Template } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	Copy,
	CopyCheck,
	ExternalLink,
	Share2,
	Trash2,
} from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import WhatsAppButton from "../whatsapp-button"; // Assuming path is correct
import { toast } from "sonner";
import { useLanguage } from "../language-provider"; // Keep if used for translations
import { DeleteConfirm } from "./delete-comfirm"; // Assuming path is correct
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip"; // Assuming path is correct
import { InvitePreview } from "./invite-preview";
import { cn } from "@/lib/utils";

interface UserInvitesListProps {
	invites: InviteType[];
	deleteInviteHandler: (inviteId: string) => void;
}

type InviteType = {
	template: Template | null;
} & Omit<Invite, "templateId" | "createdAt" | "updatedAt"> & {
		id: string;
		title: string | null;
		templateId: string | null;
		// Ensure expiresAt is a Date object if it comes from Prisma directly
		expiresAt: Date;
	};

const UserInvitesList: React.FC<UserInvitesListProps> = ({
	invites,
	deleteInviteHandler,
}) => {
	const { language } = useLanguage();
	// State to track the ID of the invite being copied, or null if none
	const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);

	const copyHandler = (invite_id: string) => {
		// Prevent re-triggering if already copied within the timeout
		if (copiedInviteId === invite_id) return;

		const url = `${window.location.origin}/invite/${invite_id}`;
		navigator.clipboard
			.writeText(url)
			.then(() => {
				toast.success("Invite link copied!");
				setCopiedInviteId(invite_id); // Set the ID of the copied invite
				setTimeout(() => {
					setCopiedInviteId(null); // Reset after 2 seconds
				}, 2000);
			})
			.catch((err) => {
				toast.error("Failed to copy link.");
				console.error("Copy failed:", err);
			});
	};

	const getTemplateName = (template: Template | null): string => {
		if (!template) return "N/A";
		try {
			const name = (
				template.translations as Record<string, { name: string }>
			)?.[language]?.name;
			return name || template.id || "Unnamed Template";
		} catch (error) {
			console.error("Error accessing template translation:", error);
			return template.id || "Error";
		}
	};

	return (
		<TooltipProvider delayDuration={100}>
			<div className="my-6 border rounded-md overflow-x-auto"> {/* Added overflow-x-auto for responsiveness */}
				<Table>
					<TableHeader className="bg-muted/50">
						<TableRow>
							<TableHead className="w-[50px] text-center">#</TableHead>
							<TableHead>Title / View Invite</TableHead>
							<TableHead>Template</TableHead>
							<TableHead className="text-center">Expire date</TableHead>
							<TableHead className="text-center">
								<div className="flex items-center justify-center gap-1.5 whitespace-nowrap"> {/* Added whitespace-nowrap */}
									<Share2 strokeWidth={1.5} size={16} /> Share
								</div>
							</TableHead>
							<TableHead className="text-center w-[100px]">
								<div className="flex items-center justify-center gap-1.5 whitespace-nowrap"> {/* Added whitespace-nowrap */}
									<Trash2 strokeWidth={1.5} size={16} /> Delete
								</div>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{invites.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={6} // Adjusted colSpan
									className="text-center text-muted-foreground h-24"
								>
									You haven't created any simple invites yet.
								</TableCell>
							</TableRow>
						)}
						{invites.map((invite, i) => {
							const isCopied = copiedInviteId === invite.id; // Check if this specific invite is copied

							return (
								<TableRow key={invite.id} className="group">
									<TableCell className="text-center font-medium">
										{i + 1}
									</TableCell>
									<TableCell className="font-medium">
										<Tooltip>
											<TooltipTrigger asChild>
												<Link
													href={`/invite/${invite.id}`}
													target="_blank"
													className="hover:underline inline-flex items-center gap-1 group/link"
													title={`View invite: ${invite.title || invite.id}`}
												>
													{invite.title || `Invite (${invite.id})`}
													<ExternalLink
														size={14}
														strokeWidth={1.5}
														className="opacity-50 group-hover/link:opacity-100 transition-opacity"
													/>
												</Link>
											</TooltipTrigger>
											<TooltipContent className="bg-primary /20 backdrop-blur-xs rounded-2xl shadow-2xl">
												<InvitePreview invite={invite} />
											</TooltipContent>
										</Tooltip>
									</TableCell>
									<TableCell>
										<Tooltip>
											<TooltipTrigger asChild>
												{invite.templateId ? (
													<Link
														href={`/templates/${invite.templateId}`}
														target="_blank"
														className="hover:underline"
													>
														<Button variant="link" size="sm" className="p-0 h-auto">
															{getTemplateName(invite.template)}
														</Button>
													</Link>
												) : (
													<span className="text-muted-foreground text-sm">
														{getTemplateName(invite.template)}
													</span>
												)}
											</TooltipTrigger>
											{invite.template && ( // Only show tooltip if template exists
												<TooltipContent
													className={cn(
														"text-accent-foreground font-semibold p-0 overflow-hidden rounded-sm border shadow-sm", // Simplified styling
														invite.template?.color // Apply template color class if available
													)}
												>
													<p className={cn("bg-background p-2 px-3")}> {/* Use background */}
														Template: {getTemplateName(invite.template)}
													</p>
												</TooltipContent>
											)}
										</Tooltip>
									</TableCell>
									<TableCell className="text-center">
										<Tooltip>
											<TooltipTrigger asChild>
												{/* Ensure expiresAt is a Date object */}
												<div className="text-sm whitespace-nowrap"> {/* Added whitespace-nowrap */}
													{invite.expiresAt instanceof Date
														? `${invite.expiresAt.toISOString().split("T")[0]} | ${invite.expiresAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`
														: "Invalid Date"}
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p>
													Expiration:{" "}
													{invite.expiresAt instanceof Date
														? invite.expiresAt.toLocaleString()
														: "N/A"}
												</p>
											</TooltipContent>
										</Tooltip>
									</TableCell>
									<TableCell className="text-center">
										<div className="flex items-center justify-center gap-1">
											<Tooltip>
												<TooltipTrigger asChild>
													{/* --- Improved Copy Button --- */}
													<Button
														size={"icon"} // Use icon size for consistency
														variant={"outline"}
														onClick={() => copyHandler(invite.id)}
														// Disable button briefly after click to prevent spamming
														disabled={isCopied}
														className={cn(
															"relative transition-all duration-300 ease-in-out overflow-hidden",
															// Optional: visual indication while disabled
															isCopied && "border-green-500"
														)}
													>
														{/* Container for Copy Icon */}
														<span
															className={cn(
																"absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out",
																isCopied
																	? "opacity-0 scale-50" // Fade and shrink out
																	: "opacity-100 scale-100" // Fade and scale in
															)}
														>
															<Copy size={16} strokeWidth={1.5} />
														</span>
														{/* Container for CopyCheck Icon */}
														<span
															className={cn(
																"absolute inset-0 flex shadow-2xl shadow-green-400 items-center justify-center transition-all duration-300 ease-in-out",
																isCopied
																	? "opacity-100 scale-130" // Fade and scale in
																	: "opacity-0 scale-50" // Fade and shrink out
															)}
														>
															<CopyCheck
																size={16}
																strokeWidth={1.5}
																className="text-green-400 shadow-2xl shadow-green-400" // Success color
															/>
														</span>
														<span className="sr-only">
															{isCopied ? "Copied!" : "Copy Invite Link"}
														</span>
													</Button>
													{/* --- End Improved Copy Button --- */}
												</TooltipTrigger>
												<TooltipContent>
													<p>{isCopied ? "Copied!" : "Copy Invite Link"}</p>
												</TooltipContent>
											</Tooltip>
											<WhatsAppButton
												text={`${window.location.origin}/invite/${invite.id}`}
											/>
										</div>
									</TableCell>
									<TableCell className="text-center">
										<DeleteConfirm
											id={invite.id}
											onConfirm={deleteInviteHandler}
											title={`Delete "${invite.title || invite.id}"?`}
											description="Are you sure you want to permanently delete this simple invite? This action cannot be undone."
											confirmLabel="Yes, Delete"
											cancelLabel="Cancel"
										>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														variant={"outline"}
														size={"icon"} // Use icon size
														className="hover:text-destructive hover:border-destructive/50" // Adjusted hover
													>
														<Trash2 size={16} strokeWidth={1.5} />
														<span className="sr-only">Delete Invite</span>
													</Button>
												</TooltipTrigger>
												<TooltipContent>
													<p>Delete Invite</p>
												</TooltipContent>
											</Tooltip>
										</DeleteConfirm>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</TooltipProvider>
	);
};

export default UserInvitesList;