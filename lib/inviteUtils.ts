'use server';
import prisma from "./prisma";

async function createInvite(data: {
    title: string;
    date: Date;
    location: string;
    message: string;
    userId: string;
    templateId: string;
    expiresAt: Date;
    role: string; // Assuming role is passed in the data
}) {
    try {
        // Validate required fields
        if (!data.title || !data.date || !data.location || !data.userId || !data.templateId || !data.expiresAt) {
            throw new Error("Missing required fields. Please provide all necessary invite details.");
        }

        // Check invite limits for non-admin users
        if (data.role !== "admin") {
            const userInvitesCount = await prisma.invite.count({
                where: {
                    userId: data.userId,
                },
            });

            if (userInvitesCount >= 5) {
                throw new Error("Invite limit reached. Non-admin users can only create up to 5 invites.");
            }
        }

        // Create the invite
        const newInvite = await prisma.invite.create({
            data: {
                title: data.title,
                date: data.date,
                location: data.location,
                message: data.message,
                userId: data.userId,
                templateId: data.templateId,
                expiresAt: data.expiresAt,
            },
        });

        console.log("Invite created successfully:", newInvite);
        return newInvite;
    } catch (error: any) {
        console.error("Error creating invite:", error);

        // Provide a more specific error message
        if (error.message.includes("Missing required fields")) {
            throw new Error(error.message);
        }

        throw new Error("Failed to create invite. Please try again later.");
    }
}
async function getInviteById(inviteId: string) {
    try {
        const invite = await prisma.invite.findUnique({
            where: {
                id: inviteId,
            },
            include: {
                user: true,
                template: true,
            },
        });

        if (!invite) {
            console.warn(`Invite with ID ${inviteId} not found.`);
            return null;
        }

        console.log("Invite details retrieved successfully:", invite);
        return invite;
    } catch (error) {
        console.error(`Error retrieving invite with ID ${inviteId}:`, error);
        throw new Error("Failed to retrieve invite.");
    }
}

async function getUserInvites(userId: string) {
    try {
        const invites = await prisma.invite.findMany({
            where: {
                userId,
            },
            include: {
                template: true,
            },
        });

        // console.log(`Invites for user ID ${userId} retrieved successfully:`, invites);
        return invites;
    } catch (error) {
        console.error(`Error retrieving invites for user ID ${userId}:`, error);
        throw new Error("Failed to retrieve user invites.");
    }
}

async function updateInvite(
    inviteId: string,
    updatedData: Partial<{
        title: string;
        date: Date;
        location: string;
        message: string;
        expiresAt: Date;
    }>
) {
    try {
        const updatedInvite = await prisma.invite.update({
            where: {
                id: inviteId,
            },
            data: updatedData,
        });

        console.log(`Invite with ID ${inviteId} updated successfully:`, updatedInvite);
        return updatedInvite;
    } catch (error) {
        console.error(`Error updating invite with ID ${inviteId}:`, error);
        throw new Error("Failed to update invite.");
    }
}

async function deleteInvite(inviteId: string) {
    try {
        await prisma.invite.delete({
            where: {
                id: inviteId,
            },
        });

        console.log(`Invite with ID ${inviteId} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting invite with ID ${inviteId}:`, error);
        throw new Error("Failed to delete invite.");
    }
}

export {
    createInvite,
    getInviteById,
    getUserInvites,
    updateInvite,
    deleteInvite,
};