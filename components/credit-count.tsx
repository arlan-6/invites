"use client";

import React, { FC, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { authClient } from "@/auth-client"; // Assuming this exports `useSession` hook correctly
import { Button } from "./ui/button";
import { FaInfoCircle } from "react-icons/fa";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import getUserCredits from "@/lib/userUtils"; // Assuming this returns { credits: number | null, error: string | null }

interface CreditCountProps {
	className?: string;
}

export const CreditCount: FC<CreditCountProps> = ({ className }) => {
	// State for the fetched credit data
	const [creditsData, setCreditsData] = useState<{
		credits: number | null;
		error: string | null;
	}>({ credits: null, error: null });

	// Separate loading state for the credit fetch itself
	const [isLoadingCredits, setIsLoadingCredits] = useState(false);

	// Get session state
	const {
		data: session,
		isPending: isSessionLoading, // Renamed for clarity
		error: sessionError,
		refetch, // Keep refetch if needed elsewhere, but not used in basic display
	} = authClient.useSession();

	// Memoized fetch function using useCallback to potentially optimize if passed as prop
	const fetchCredits = useCallback(async (userId: string) => {
		setIsLoadingCredits(true);
		setCreditsData({ credits: null, error: null }); // Reset state before fetching
		try {
			const result = await getUserCredits(userId);
			setCreditsData(result);
		} catch (err) {
			console.error("Failed to fetch credits:", err);
			setCreditsData({
				credits: null,
				error: "Failed to load credits.",
			});
		} finally {
			setIsLoadingCredits(false);
		}
	}, []); // Empty dependency array for useCallback, function itself doesn't depend on props/state

	// Effect to fetch credits when session user ID is available
	useEffect(() => {
		if (session?.user?.id) {
			fetchCredits(session.user.id);
		} else {
			// Reset credits if there's no user ID (e.g., logged out)
			setCreditsData({ credits: null, error: null });
		}
	}, [session?.user?.id, fetchCredits]); // Depend on userId and the memoized fetch function


	// 1. Handle Session Loading State
	if (isSessionLoading) {
		return (
			<div className={cn("text-sm text-muted-foreground", className)}>
				Loading session...
			</div>
		);
	}

	// 2. Handle Session Error State
	if (sessionError) {
		console.error("Session error:", sessionError);
		return (
			<div className={cn("text-sm text-destructive", className)}>
				Error loading session.
			</div>
		);
	}

	// 3. Handle No Session State (Logged out)
	if (!session) {
		// Don't render anything or show a logged-out message if desired
        // return <div className={cn("text-sm text-muted-foreground", className)}>Not logged in.</div>;
		return null; // Often preferable to render nothing if user isn't logged in
	}

	// 4. Handle Credit Fetching Error State
	if (creditsData.error) {
		return (
			<div className={cn("text-sm text-destructive flex items-center gap-1", className)}>
                <FaInfoCircle/> <span>{creditsData.error}</span>
            </div>
		);
	}

    // 5. Handle Credits Loading State (session loaded, but credits fetch is ongoing)
    // Also covers the initial state where creditsData.credits is null before fetch completes
	if (isLoadingCredits || creditsData.credits === null) {
		return (
			<div className={cn("text-sm text-muted-foreground", className)}>
				Loading credits...
			</div>
		);
	}

	// 6. Success State: Render the credit count and dialog
	return (
		<div className={cn("text-sm", className)}>
			<Dialog>
				<DialogTrigger asChild>
					<button // Using a button for semantics and accessibility
                        className="text-secondary-foreground flex items-center gap-1 hover:underline hover:underline-offset-2 transition-all cursor-pointer"
                    >
                        <span className="text-secondary-foreground/60">Credits:</span>
                        <span className="font-medium">{creditsData.credits}</span>
                        <FaInfoCircle className="ml-1 text-secondary-foreground/60" />
					</button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>About Your Credits</DialogTitle>
						<DialogDescription>
                            Credits are used for specific actions on our platform. You currently have {creditsData.credits} credits available.
                            {/* Add more specific info: e.g., "Each image generation costs 1 credit." */}
                            {/* Optionally add info on how to get more credits */}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="secondary">
								Close
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
            {/* Example button to manually refetch session & credits if needed */}
            {/* <Button onClick={() => refetch()} size="sm" variant="outline" className="ml-4">Refresh</Button> */}
		</div>
	);
};