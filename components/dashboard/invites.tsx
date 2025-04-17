"use client";
import React, { FC, useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import UserInvitesList from "./user-invites-list";
import UserAdvancedInvitesList from "./user-advanced-invites-list";
import { AdvancedInvite, Invite, Template } from "@prisma/client";
import { deleteInvite, getUserInvites } from "@/lib/inviteUtils";
import Loader from "../ui/loader";
import { toast } from "sonner";
import {
	DeleteAdvancedInviteById,
	GetAdvancedInviteByUserId,
} from "@/lib/advancedInvitesUtils";
import { AdvancedTemplateType } from "@/data/advanced-templates";

interface InvitesProps {
	className?: string;
	userId: string;
}
type SimpleInviteType = {
	template: Template;
} & Omit<Invite, "template">;
type AdvancedInviteType = {
} & Omit<AdvancedInvite, "template">;
export const Invites: FC<InvitesProps> = ({ className, userId }) => {
	// Combined State
	const [invites, setInvites] = useState<SimpleInviteType[] | null>(null);
	const [advancedInvites, setAdvancedInvites] = useState<AdvancedInviteType[] | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
    // Store errors separately for clarity
	const [simpleError, setSimpleError] = useState<string | null>(null);
	const [advancedError, setAdvancedError] = useState<string | null>(null);

	// --- Fetching Logic ---
	const fetchData = useCallback(async () => {
		setIsLoading(true);
		setSimpleError(null);
		setAdvancedError(null);

		const results = await Promise.allSettled([
			getUserInvites(userId),
			GetAdvancedInviteByUserId(userId),
		]);

		// Process Simple Invites Result
		if (results[0].status === "fulfilled") {
			setInvites(results[0].value as SimpleInviteType[]); // Add type assertion
		} else {
			console.error("Error fetching simple invites:", results[0].reason);
			setSimpleError("Failed to load simple invites.");
            setInvites([]); // Set empty array on error to show 'empty' state below title
		}

		// Process Advanced Invites Result
		if (results[1].status === "fulfilled") {
             // Add type assertion - ensure GetAdvancedInviteByUserId returns expected structure
			setAdvancedInvites(results[1].value as AdvancedInviteType[]);
		} else {
			console.error("Error fetching advanced invites:", results[1].reason);
			setAdvancedError("Failed to load advanced invites.");
            setAdvancedInvites([]); // Set empty array on error
		}

		setIsLoading(false);
	}, [userId]);

	useEffect(() => {
		fetchData();
	}, [fetchData]); // Depend on the memoized fetchData function

	// --- Deletion Handlers ---
	const deleteInviteHandler = async (inviteId: string) => {
		// Optimistic UI update (optional)
		const originalInvites = invites;
		setInvites((prev) => prev?.filter((inv) => inv.id !== inviteId) ?? null);

		try {
			await deleteInvite(inviteId);
			toast.success("Simple invite deleted successfully!");
		} catch (err) {
			setInvites(originalInvites); // Revert on error
			toast.error("Failed to delete simple invite.");
			console.error("Error deleting simple invite:", err);
			setSimpleError("Failed to delete invite. Please refresh."); // Set section-specific error
		}
	};

	const deleteAdvancedInviteHandler = async (inviteId: string) => {
        // Optimistic UI update
		const originalAdvancedInvites = advancedInvites;
        setAdvancedInvites((prev) => prev?.filter((inv) => inv.id !== inviteId) ?? null);

		try {
			await DeleteAdvancedInviteById(inviteId);
			toast.success("Advanced invite deleted successfully!");
		} catch (err) {
            setAdvancedInvites(originalAdvancedInvites); // Revert
			toast.error("Failed to delete advanced invite.");
			console.error("Error deleting advanced invite:", err);
            setAdvancedError("Failed to delete invite. Please refresh."); // Set section-specific error
		}
	};

	// --- Helper Function for Counts ---
    const getInviteCountText = (count: number | undefined | null): string => {
        if (count === null || count === undefined) return "";
        if (count === 1) return "You have 1 invite";
        return `You have ${count} invites`;
    }

    // --- Render Loading State ---
	if (isLoading) {
		return (
			<div className={cn("flex justify-center items-center min-h-[300px]", className)}>
				<Loader />
			</div>
		);
	}

	return (
		<div className={cn("space-y-8", className)}> {/* Added spacing between sections */}

			{/* === Simple Invites Section === */}
			<section>
                {/* Section Header */}
				<h2 className="text-lg font-semibold mb-1">Simple Invites</h2>
                {!simpleError && (
                    <p className="text-muted-foreground text-sm mb-4">
                        {getInviteCountText(invites?.length)}
                    </p>
                )}

				{/* Section Content */}
                {simpleError ? (
                    <div className="text-destructive text-center p-4 border border-destructive/30 rounded-md bg-destructive/5">
                        {simpleError}
                    </div>
                    // Or use Alert component:
                    // <Alert variant="destructive">
                    //     <AlertCircle className="h-4 w-4" />
                    //     <AlertTitle>Error</AlertTitle>
                    //     <AlertDescription>{simpleError}</AlertDescription>
                    // </Alert>
                ) : invites && invites.length > 0 ? (
					<UserInvitesList
						invites={invites}
						deleteInviteHandler={deleteInviteHandler}
					/>
				) : (
					<div className="text-center text-muted-foreground border rounded-md p-10"> {/* More distinct empty state */}
                        No simple invites found.
                    </div>
				)}
			</section>

			{/* === Advanced Invites Section === */}
			<section>
                 {/* Section Header */}
                <h2 className="text-lg font-semibold mb-1">Advanced Invites</h2>
                 {!advancedError && (
                    <p className="text-muted-foreground text-sm mb-4">
                        {getInviteCountText(advancedInvites?.length)}
                    </p>
                 )}

                {/* Section Content */}
				{advancedError ? (
					<div className="text-destructive text-center p-4 border border-destructive/30 rounded-md bg-destructive/5">
                        {advancedError}
                    </div>
                    // Or use Alert component
				) : advancedInvites && advancedInvites.length > 0 ? (
					<UserAdvancedInvitesList
						invites={advancedInvites}
						deleteInviteHandler={deleteAdvancedInviteHandler}
					/>
				) : (
					<div className="text-center text-muted-foreground border rounded-md p-10"> {/* More distinct empty state */}
                        No advanced invites found.
                    </div>
				)}
			</section>
		</div>
	);
};