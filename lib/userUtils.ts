// ~/lib/userUtils.ts (or your preferred location)
"use server";

import prisma from "./prisma"; // Make sure this path is correct
import { Prisma } from '@prisma/client'; // Import Prisma types for error handling

// --- Type Definitions ---

type GetUserCreditsResult = {
	credits: number | null;
	error: string | null;
};

type UpdateUserCreditsResult = {
	success: boolean;
	credits?: number; // The new credit count on success
	error?: string;  // Error message on failure
};


// --- Server Actions ---

/**
 * Fetches the credit count for a given user ID from the database.
 * @param id The unique identifier of the user.
 * @returns Promise resolving to an object containing credits or an error.
 */
const getUserCredits = async (id: string): Promise<GetUserCreditsResult> => {
    // Basic input validation
	if (!id) {
		return { credits: null, error: "User ID is required." };
	}

	try {
		const user = await prisma.user.findUnique({
			where: { id },
			select: { credits: true },
		});

		if (!user) {
			console.warn(`User not found for ID: ${id}`);
			return { credits: null, error: "User not found." };
		}

        // Handle potential null value from DB based on your schema definition
        if (user.credits === null || typeof user.credits === 'undefined') {
             console.warn(`Credits field is null/undefined for user ID: ${id}`);
             // Option A: Treat null/undefined as 0 credits
             // return { credits: 0, error: null };
             // Option B: Return an error state (current implementation)
              return { credits: null, error: "Credit data unavailable for user." };
              // Option C: Treat it as valid if your schema allows nullable Int
              // return { credits: user.credits, error: null } // (which is null here)
        }

		return { credits: user.credits, error: null };

	} catch (error) {
		console.error(`Database error fetching credits for user ID ${id}:`, error);
		return {
			credits: null,
			error: "An unexpected error occurred while fetching credits.",
		};
	}
};


/**
 * Updates the credit count for a specific user.
 * Performs basic validation (non-negative integer value).
 * @param userId The unique identifier of the user whose credits should be updated.
 * @param newValue The absolute new integer value for the user's credits. Must be non-negative.
 * @returns Promise resolving to an object indicating success or failure, including the updated credit count on success.
 */
const updateUserCredits = async (userId: string, newValue: number): Promise<UpdateUserCreditsResult> => {
	// 1. Input Validation
	if (!userId) {
		return { success: false, error: "User ID is required." };
	}
    // Ensure newValue is a non-negative integer
    if (typeof newValue !== 'number' || !Number.isInteger(newValue) || newValue < 0) {
        return { success: false, error: "New credit value must be a non-negative integer." };
    }

    // Optional: Add ceiling/max value check if needed
    // if (newValue > SOME_MAX_VALUE) { ... }

	try {
		// 2. Prisma Update Operation
        // Use `update` which throws an error if the user doesn't exist
		const updatedUser = await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				credits: newValue,
			},
            select: { // Select the updated credits back
                credits: true
            }
		});

        // Defensive check: Ensure credits is a number (though update should guarantee it based on schema type)
        const finalCredits = typeof updatedUser.credits === 'number' ? updatedUser.credits : 0;

		// 3. Success Response
		return { success: true, credits: finalCredits };

	} catch (error) {
		// 4. Error Handling
		console.error(`Failed to update credits for user ${userId} to ${newValue}:`, error);

		// Check specifically for Prisma's "Record to update not found" error
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
			return { success: false, error: "User not found." };
		}

		// Handle other potential database errors
		return { success: false, error: "Could not update credits due to a server error." };
	}
};

// Export using named exports for clarity when importing multiple functions
export { getUserCredits, updateUserCredits };
// If you only have these two and prefer default for getUserCredits,
// you could do: export default getUserCredits; export { updateUserCredits };