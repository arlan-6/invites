"use server";
import { toast } from "sonner";
import prisma from "./prisma";
const CreateAdvancedInvite = async (
	inviteData: {
		description: string;
		name: string;
		age: string;
		dateTime: string;
		location: string;
		address: string;
		addressLink: string[] | string;
		themeOrMessage?: string;
		dressCode?: string;
		giftInfo?: string;
		rsvpDeadline?: string;
		contactInfo: string;
	},
	path: string,
	userId: string,
	templateId: string, // Set the maximum number of invites allowed
) => {
	const maxInvites = 1;
	try {
		// Check if the user is an admin or tester
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				role: true,
			},
		});

		// If the user is not an admin or tester, enforce the invite limit
		if (user?.role !== "admin" && user?.role !== "tester") {
			const existingInvitesCount = await prisma.advancedInvite.count({
				where: {
					userId: userId,
				},
			});

			if (existingInvitesCount >= maxInvites) {
				toast.error(
					`You have reached the maximum limit of ${maxInvites} invites.`,
				);
				throw new Error(
					`You have reached the maximum limit of ${maxInvites} invites.`,
				);
			}
		}

		const invite = await prisma.advancedInvite.create({
			data: {
				...inviteData,
				addressLink: !Array.isArray(inviteData.addressLink)
					? inviteData.addressLink.split(",")
					: inviteData.addressLink, // Convert array to string
				path: path,
				userId: userId, // Replace with actual user ID
				templateId: templateId, // Replace with actual template ID,
				expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Set expiration date to 30 days from now
			},
		});
		return invite;
	} catch (error) {
		console.error("Error creating advanced invite:", error);
		throw new Error(
			"Failed to create advanced invite. Please try again later.",
		);
	}
};

const GetAdvancedInviteById = async (id: string) => {
	try {
		const invite = await prisma.advancedInvite.findUnique({
			where: {
				id: id,
			},
		});
		return invite;
	} catch (error) {
		console.error("Error fetching advanced invite:", error);
		throw new Error("Failed to fetch advanced invite. Please try again later.");
	}
};

const PostRsvpTrackById = async (
	id: string,
	rsvpData: {
		name: string;
		attendance: "going" | "notGoing";
		answerDate: Date;
	},
) => {
	try {
		const i = await GetAdvancedInviteById(id);
		if (!i) {
			throw new Error("Invite not found");
		}
		const invite = await prisma.advancedInvite.update({
			where: {
				id: id,
			},
			data: {
				rsvpTrack: Array.isArray(i.rsvpTrack)
					? [...i.rsvpTrack, JSON.parse(JSON.stringify(rsvpData))]
					: [JSON.parse(JSON.stringify(rsvpData))],
			},
		});
		return invite;
	} catch (error) {
		console.error("Error posting RSVP tracking:", error);
		throw new Error("Failed to post RSVP tracking. Please try again later.");
	}
};

const GetAdvancedInviteByUserId = async (userId: string) => {
	try {
		const invites = await prisma.advancedInvite.findMany({
			where: {
				userId,
			},
            // include: {
            //     template: true,
            // },
		});
		return invites;
	} catch (error) {
		console.error("Error fetching advanced invites by user ID:", error);
		// throw new Error(
		// 	"Failed to fetch advanced invites by user ID. Please try again later.",
		// );
	}
};

const DeleteAdvancedInviteById = async (id: string) => {
	try {
		const invite = await prisma.advancedInvite.delete({
			where: {
				id: id,
			},
		});
		return invite;
	} catch (error) {
		console.error("Error deleting advanced invite:", error);
		throw new Error(
			"Failed to delete advanced invite. Please try again later.",
		);
	}
};

const GetAdvancedInviteRsvpTrackById = async (id: string) => {
	try {
		const invite = await prisma.advancedInvite.findUnique({
			where: {
				id: id,
			},
			select: {
				rsvpTrack: true,
			},
		});
		return invite?.rsvpTrack || null;
	} catch (error) {
		console.error("Error fetching RSVP track:", error);
		throw new Error("Failed to fetch RSVP track. Please try again later.");
	}
};

export {
	CreateAdvancedInvite,
	GetAdvancedInviteById,
	PostRsvpTrackById,
	GetAdvancedInviteByUserId,
	DeleteAdvancedInviteById,
	GetAdvancedInviteRsvpTrackById,
};
