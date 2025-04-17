"use client";
import React, { FC, useEffect, useState } from "react";
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

interface invitesProps {
	className?: string;
	userId: string;
}
type InviteType = {
	template: Template;
} & Omit<Invite, "template">;
type InviteType2 = {
} & Omit<AdvancedInvite, "template">;
export const Invites: FC<invitesProps> = ({ className, userId }) => {
	const [invites, setInvites] = useState<InviteType[] | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [advancedInvites, setAdvancedInvites] = useState<InviteType2[] | null>(
		null,
	);
	const [loading2, setLoading2] = useState<boolean>(true);
	const [erro2r, setError2] = useState<string | null>(null);

	useEffect(() => {
		const fetchInvites = async () => {
			try {
				setLoading(true);
				const invites = await getUserInvites(userId);
				setInvites(invites);
			} catch (err) {
				console.error("Error fetching invites:", err);
				setError("Failed to load invites. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

        const fetchAdvancedInvites = async () => {
            try {
                setLoading2(true);
                const advancedInvites = await GetAdvancedInviteByUserId(userId);
        
                // Ensure the data matches the expected type
                if (Array.isArray(advancedInvites)) {
                    const typedInvites = advancedInvites.map((invite) => ({
                        ...invite,
                    }));
                    setAdvancedInvites(typedInvites);
                } else {
                    throw new Error("Invalid data format for advanced invites");
                }
            } catch (err) {
                console.error("Error fetching advanced invites:", err);
                setError2("Failed to load advanced invites. Please try again later.");
            } finally {
                setLoading2(false);
            }
        };

		fetchInvites();
		fetchAdvancedInvites();
	}, [userId]);

	const deleteInviteHandler = async (inviteId: string) => {
		try {
			await deleteInvite(inviteId);
			setInvites(
				(prevInvites) =>
					prevInvites?.filter((invite) => invite.id !== inviteId) || null,
			);
			toast.success("Invite deleted successfully!");
		} catch (err) {
			toast.error("Failed to delete invite. Please try again.");
			console.error("Error deleting invite:", err);
			setError("Failed to delete invite. Please try again.");
		}
	};

	const deleteAdvancedInviteHandler = async (inviteId: string) => {
		try {
			await DeleteAdvancedInviteById(inviteId);
			setAdvancedInvites(
				(prevInvites) =>
					prevInvites?.filter((invite) => invite.id !== inviteId) || null,
			);
			toast.success("Invite deleted successfully!");
		} catch (err) {
			toast.error("Failed to delete invite. Please try again.");
			console.error("Error deleting invite:", err);
			setError("Failed to delete invite. Please try again.");
		}
	};
	return (
		<div className={cn("", className)}>
			<div className="">
				{loading ? (
					<div className="flex justify-center items-center h-40">
						<Loader />
					</div>
				) : error ? (
					<div className="text-red-500 text-center">{error}</div>
				) : invites && invites.length > 0 ? (
					<>
						<div className="">Simple Invites</div>
						<div className="text-gray-500 text-sm">
							You have{" "}
							{invites.length === 1 ? "1 inivte" : `${invites.length} invites`}
						</div>
						<UserInvitesList
							invites={invites}
							deleteInviteHandler={deleteInviteHandler}
						/>
					</>
				) : (
					<div className="text-center text-gray-500">No invites found.</div>
				)}
				<br />
				{/* <UseradvancedINivtesLIst userId={userId} /> */}
				{loading2 ? (
					<div className="flex justify-center items-center h-40">
						<Loader />
					</div>
				) : erro2r ? (
					<div className="text-red-500 text-center">{erro2r}</div>
				) : advancedInvites && advancedInvites.length > 0 ? (<>
                    <div className="">Advanced Invites</div>
                    <div className="text-gray-500 text-sm">
                        You have{" "}
                        {advancedInvites.length === 1
                            ? "1 inivte"
                            : `${advancedInvites.length} invites`}
                    </div>
					<UserAdvancedInvitesList
						invites={advancedInvites}
						deleteInviteHandler={deleteAdvancedInviteHandler}
					/>
				</>) : (
					<div className="text-center text-gray-500">
						No advanced invites found.
					</div>
				)}
			</div>
		</div>
	);
};
