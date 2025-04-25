// ~/lib/userUtils.ts (or your preferred location)
"use server";

import prisma from "./prisma"; // Make sure this path is correct for your project structure
import { Prisma } from '@prisma/client'; // Import Prisma types for error handling if needed

// Define the expected return type for clarity
type GetUserCreditsResult = {
	credits: number | null;
	error: string | null;
};

/**
 * Fetches the credit count for a given user ID from the database.
 * To be used as a Server Action.
 * @param id The unique identifier of the user.
 * @returns Promise<{ credits: number | null; error: string | null }>
 */
const getUserCredits = async (id: string): Promise<GetUserCreditsResult> => {
	// Optional: Basic input validation
	if (!id) {
		return { credits: null, error: "User ID is required." };
	}

	try {
		const user = await prisma.user.findUnique({
			where: {
				id,
			},
			select: { // Select only the credits field for efficiency
				credits: true,
			},
		});

		// Case 1: User not found in the database
		if (!user) {
			console.log(`User not found for ID: ${id}`); // Optional: server-side log
			return {
				credits: null,
				error: "User not found.", // Clearer error message
			};
		}

        // Case 2: User found, but credits field is null or undefined
        // Adjust this check based on your specific database schema:
        // - If 'credits' is non-nullable Int with a default (e.g., 0), user.credits will always be a number if user exists.
        // - If 'credits' CAN be NULL in your schema, this check is important.
        if (user.credits === null || typeof user.credits === 'undefined') {
             console.warn(`Credits field is null/undefined for user ID: ${id}`); // Optional: server-side warning
             // Decide return value: Could return 0, or an error, depending on business logic
             // Option A: Treat null/undefined as 0 credits
             // return { credits: 0, error: null };
             // Option B: Return an error state
              return { credits: null, error: "Credit data unavailable for user." };
        }


		// Case 3: Success - User found and has a valid credit count (including 0)
		return { credits: user.credits, error: null };

	} catch (error) {
		console.error(`Database error fetching credits for user ID ${id}:`, error); // Log the actual error server-side

        // Optional: Check for specific Prisma errors if needed
        // if (error instanceof Prisma.PrismaClientKnownRequestError) { ... }

		// Return a generic error to the client for security/simplicity
		return {
			credits: null,
			error: "An unexpected error occurred while fetching credits.",
		};
	}
};

export default getUserCredits;