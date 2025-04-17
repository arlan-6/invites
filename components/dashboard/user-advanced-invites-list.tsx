"use client";

import React from "react"; // useEffect, useState removed as not used
import { Button } from "@/components/ui/button";
// import Loader from "../ui/loader"; // Removed if not used
import Link from "next/link";
import {
	// CircleOff, // Removed unused
	Copy,
	ExternalLink,
	// MapPin, // Removed unused
	Share2,
	// SquareArrowOutUpRight, // Removed unused
	Trash2,
} from "lucide-react";
import {
	Table,
	TableBody,
	// TableCaption, // Removed as commented out
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import WhatsAppButton from "../whatsapp-button"; // Assuming this exists
import { toast } from "sonner";
// Imports for types/utils seem necessary, kept them
import { AdvancedInvite } from "@prisma/client";
// import { useLanguage } from "../language-provider"; // Removed if not used
import { DeleteConfirm } from "./delete-comfirm"; // Ensure correct path/name
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"; // Ensure correct path

interface UserAdvancedInvitesListProps { // Renamed from UseradvancedINivtesLIstProps
	// userId: string; // Removed if not used in rendering
	invites: AdvancedInvite[];
	deleteInviteHandler: (inviteId: string) => void;
}

// Ensure InviteType is correctly defined based on actual usage and data structure
type InviteType = {
    id: string;
    path: string;
    description: string | null;
    rsvpTrack: { id: string }[]; // Adjust structure as needed
} & Omit<AdvancedInvite, "template">; // Check if Omit<> causes issues or if manual typing is better

const UserAdvancedInvitesList: React.FC<UserAdvancedInvitesListProps> = ({
	// userId, // Removed
	invites,
	deleteInviteHandler,
}) => {
	// const {language} = useLanguage(); // Removed

	const copyHandler = (invite_id: string, invite_path: string) => {
        const url = `${window.location.origin}/invite/${invite_path}/${invite_id}`;
		navigator.clipboard.writeText(url)
        .then(() => {
            toast.success("Invite link copied!"); // Simple confirmation
        })
        .catch(err => {
            toast.error("Failed to copy link.");
            console.error("Copy failed:", err);
        });
	};

	return (
		<TooltipProvider delayDuration={100}>
			<div className="my-6 border rounded-md overflow-hidden">
				<Table>
					<TableHeader className="bg-muted/50">
						<TableRow>
							<TableHead className="w-[50px] text-center">#</TableHead>
							<TableHead>Description / View Invite</TableHead>
							<TableHead>Template</TableHead>
							<TableHead>RSVPs</TableHead>
							<TableHead className="text-center">
								<div className="flex items-center justify-center gap-1.5">
									<Share2 strokeWidth={1.5} size={16} /> Share
								</div>
							</TableHead>
							<TableHead className="text-center w-[100px]">
								<div className="flex items-center justify-center gap-1.5">
									<Trash2 strokeWidth={1.5} size={16} /> Delete
								</div>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{invites.length === 0 && (
							<TableRow>
								<TableCell colSpan={6} className="text-center text-muted-foreground h-24">
									You haven't created any advanced invites yet.
								</TableCell>
							</TableRow>
						)}
						{invites.map((invite, i) => (
							<TableRow key={invite.id} className="group">
								<TableCell className="text-center font-medium">{i + 1}</TableCell>

								<TableCell className="font-medium">
									<Link
										href={`/invite/${invite.path}/${invite.id}`}
										target="_blank"
										className="hover:underline inline-flex items-center gap-1 group/link"
										title={`View invite: ${invite.description || invite.path}`}
									>
										{invite.description || `Invite (${invite.path})`}
										<ExternalLink size={14} strokeWidth={1.5} className="opacity-50 group-hover/link:opacity-100 transition-opacity" />
									</Link>
								</TableCell>

								<TableCell>
									<Tooltip>
										<TooltipTrigger asChild>
											<Link
												href={`/dashboard/${invite.path}`}
												target="_blank"
												className="hover:underline"
											>
												<Button variant="link" size="sm" className="p-0 h-auto">
													{invite.path}
												</Button>
											</Link>
										</TooltipTrigger>
										<TooltipContent>
											<p>View/Edit Template: {invite.path}</p>
										</TooltipContent>
									</Tooltip>
								</TableCell>

								<TableCell>
									<Tooltip>
										<TooltipTrigger asChild>
                                            <Link href={`/dashboard/${invite.id}`}
                                                  className="hover:underline"
                                                  title={`View ${invite.rsvpTrack.length} RSVP(s)`}>
												<Button variant="link" size="sm" className="p-0 h-auto">
													{invite.rsvpTrack.length > 0 ? `${invite.rsvpTrack.length} RSVP(s)` : "No RSVPs"}
												</Button>
											</Link>
										</TooltipTrigger>
										<TooltipContent>
											<p>View Responses ({invite.rsvpTrack.length})</p>
										</TooltipContent>
									</Tooltip>
								</TableCell>

								{/* Share Actions */}
								<TableCell className="text-center">
                                    {/* Suggestion: Pass size="sm" and variant="ghost" to WhatsAppButton if possible for consistency */}
									<div className="flex items-center justify-center gap-2">
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													size={"sm"}
													variant={"outline"}
													onClick={() => copyHandler(invite.id, invite.path)}
												>
													<Copy size={16} strokeWidth={1.5} />
													<span className="sr-only">Copy Invite Link</span>
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Copy Invite Link</p>
											</TooltipContent>
										</Tooltip>
										<WhatsAppButton
                                            // variant="ghost" // Optional: Attempt to match variant if component allows
											text={`${window.location.origin}/invite/${invite.path}/${invite.id}`}
										/>
									</div>
								</TableCell>

								{/* Delete Action */}
								<TableCell className="text-center">
									<DeleteConfirm
										id={invite.id}
										onConfirm={deleteInviteHandler}
										// ** IMPORTANT: Re-added context-specific props **
                                        title="Delete This Invite?"
                                        description={`Delete "${invite.description || invite.path}"? Associated RSVPs will also be removed. This cannot be undone.`} // Made description slightly shorter
                                        confirmLabel="Yes, Delete"
									>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    size={"sm"}
                                                    // ** Updated className for hover-only destructive color **
                                                    className="hover:text-red-800 hover:bg-text-red-800/10"
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
						))}
					</TableBody>
				</Table>
			</div>
		</TooltipProvider>
	);
};

// Ensure the export name matches the component name
export default UserAdvancedInvitesList;