"use client";

import React from "react";
import { Invite, Template } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	// CircleOff, // Replace with Trash2 in header
	Copy,
    ExternalLink, // For external navigation links
	Share2,
	// SquareArrowOutUpRight, // Replace with ExternalLink where appropriate
	Trash2, // Use consistently for delete
} from "lucide-react";
import {
	Table,
	TableBody,
	// TableCaption, // Can be omitted if description is outside
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import WhatsAppButton from "../whatsapp-button"; // Assuming path is correct
import { toast } from "sonner";
import { useLanguage } from "../language-provider"; // Keep if used for translations
import { DeleteConfirm } from "./delete-comfirm"; // Assuming path is correct
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"; // Assuming path is correct

interface UserInvitesListProps {
	// userId: string; // Mark as potentially unused if only for fetching data
	invites: InviteType[];
	deleteInviteHandler: (inviteId: string) => void;
}

// Define InviteType more explicitly if possible for clarity
type InviteType = {
	template: Template | null; // Allow template to be null if possible relation
} & Omit<Invite, "templateId" | "createdAt" | "updatedAt"> & { // Omit fields not used or handled manually
    id: string;
    title: string | null;
    templateId: string | null; // Include if needed for fallback link
};

const UserInvitesList: React.FC<UserInvitesListProps> = ({
	// userId, // Comment out if not used in rendering
	invites,
	deleteInviteHandler,
}) => {
	const { language } = useLanguage(); // Keep if translations are used

	const copyHandler = (invite_id: string) => {
        // Ensure this URL structure is correct for simple invites
		const url = `${window.location.origin}/invite/${invite_id}`;
		navigator.clipboard.writeText(url)
        .then(() => {
            toast.success("Invite link copied!");
        })
        .catch(err => {
            toast.error("Failed to copy link.");
            console.error("Copy failed:", err);
        });
	};

	// Helper function for safe translation access
	const getTemplateName = (template: Template | null): string => {
		if (!template) return "N/A"; // Handle null template case
		try {
			// Added optional chaining for robustness
			const name = (template.translations as Record<string, { name: string }>)
				?.[language]?.name;
			return name || template.id || "Unnamed Template"; // Fallback name
		} catch (error) {
			console.error("Error accessing template translation:", error);
			return template.id || "Error"; // Fallback in case of error
		}
	};

	return (
		// Wrap with TooltipProvider
		<TooltipProvider delayDuration={100}>
            {/* Consistent container styling */}
			<div className="my-6 border rounded-md overflow-hidden">
				<Table>
					{/* <TableCaption>A list of your simple invites.</TableCaption> */}
                    {/* Consistent Header Styling */}
					<TableHeader className="bg-muted/50">
						<TableRow>
							<TableHead className="w-[50px] text-center">#</TableHead>
							{/* Use Title as primary link */}
							<TableHead>Title / View Invite</TableHead>
							<TableHead>Template</TableHead>
							<TableHead className="text-center">Expire date</TableHead>

                            {/* Consistent Action Headers */}
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
                        {/* Empty State */}
						{invites.length === 0 && (
							<TableRow>
								<TableCell colSpan={5} className="text-center text-muted-foreground h-24">
									You haven't created any simple invites yet.
								</TableCell>
							</TableRow>
						)}
                        {/* Invite Rows */}
						{invites.map((invite, i) => (
							<TableRow key={invite.id} className="group">
                                {/* Index */}
								<TableCell className="text-center font-medium">
									{i + 1}
								</TableCell>

                                {/* Title as Primary Link */}
								<TableCell className="font-medium">
									<Link
										href={`/invite/${invite.id}`} // Link to view the invite
										target="_blank"
										className="hover:underline inline-flex items-center gap-1 group/link"
										title={`View invite: ${invite.title || invite.id}`}
									>
										{invite.title || `Invite (${invite.id})`} {/* Fallback */}
                                        {/* External link icon */}
										<ExternalLink size={14} strokeWidth={1.5} className="opacity-50 group-hover/link:opacity-100 transition-opacity" />
									</Link>
								</TableCell>

                                {/* Template Link */}
								<TableCell>
									<Tooltip>
										<TooltipTrigger asChild>
                                            {/* Link to template view/edit page */}
											<Link
												href={`/templates/${invite.templateId}`} // Assuming this structure
												target="_blank"
												className="hover:underline"
											>
												<Button variant="link" size="sm" className="p-0 h-auto">
													{getTemplateName(invite.template)}
												</Button>
											</Link>
										</TooltipTrigger>
										<TooltipContent>
                                            {/* Tooltip provides more context */}
											<p>View/Edit Template: {getTemplateName(invite.template)}</p>
										</TooltipContent>
									</Tooltip>
								</TableCell>
								<TableCell className="text-center">
								<Tooltip>
										<TooltipTrigger asChild>
											<div className="">
                                            {invite.expiresAt.toISOString().split("T")[0]} | {' '}
                                            {invite.expiresAt.toISOString().split("T")[1].split(".")[0].slice(0, 5)} 
											</div>
										</TooltipTrigger>
										<TooltipContent>
                                            {/* Tooltip provides more context */}
											<p>Expiration Date: {invite.expiresAt.toLocaleString()}</p>
										</TooltipContent>
									</Tooltip>
									</TableCell>
                                {/* Share Actions Cell */}
								<TableCell className="text-center">
                                    {/* Group Copy and WhatsApp */}
									<div className="flex items-center justify-center gap-1">
										<Tooltip>
											<TooltipTrigger asChild>
                                                {/* Consistent Copy Button */}
												<Button
													size={"sm"}
													variant={"outline"}
													onClick={() => copyHandler(invite.id)}
												>
													<Copy size={16} strokeWidth={1.5} />
													<span className="sr-only">Copy Invite Link</span>
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Copy Invite Link</p>
											</TooltipContent>
										</Tooltip>
                                        {/* Consistent WhatsApp Button */}
										<WhatsAppButton
                                            // variant="outline" // Optional: if styling allows
											text={`${window.location.origin}/invite/${invite.id}`}
										/>
									</div>
								</TableCell>

                                {/* Delete Action Cell */}
								<TableCell className="text-center">
									<DeleteConfirm
										id={invite.id}
										onConfirm={deleteInviteHandler} // Use consistent prop name
										// ** Provide specific, contextual text **
                                        title={`Delete "${invite.title || invite.id}"?`}
                                        description="Are you sure you want to permanently delete this simple invite? This action cannot be undone."
                                        confirmLabel="Yes, Delete" // Use consistent prop name
                                        cancelLabel="Cancel"   // Use consistent prop name
									>
                                        {/* Consistent Delete Trigger */}
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    size={"sm"}
                                                    // Consistent hover style
                                                    className="hover:text-destructive hover:bg-destructive/10"
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

export default UserInvitesList;