"use client";

import React, { useEffect, useState } from "react";
import { Invite } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Loader from "../ui/loader";
import { getUserInvites, deleteInvite } from "@/lib/inviteUtils";
import Link from "next/link";
import { MapPin, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import WhatsAppButton from "../whatsapp-button";
import { toast } from "sonner";

interface UserInvitesListProps {
	userId: string;
}

const UserInvitesList: React.FC<UserInvitesListProps> = ({ userId }) => {
	const [invites, setInvites] = useState<Invite[] | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

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

		fetchInvites();
	}, [userId]);

	const handleDeleteInvite = async (inviteId: string) => {
		try {
			await deleteInvite(inviteId);
			toast.success("Invite deleted successfully!");
			// Update the state to remove the deleted invite
			setInvites(
				(prevInvites) =>
					prevInvites?.filter((invite) => invite.id !== inviteId) || null,
			);
		} catch (err) {
			console.error("Error deleting invite:", err);
			toast.error("Failed to delete invite. Please try again.");
		}
	};
	if (loading) {
		return (
			<div className="flex justify-center items-center h-40">
				<Loader />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center h-40">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	if (!invites || invites.length === 0) {
		return (
			<div className="flex justify-center items-center h-40">
				<p className="text-gray-500">No invites found.</p>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto bg-background shadow-lg rounded-lg p-6">
			<Table>
				<TableCaption>List of simple invites</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Title</TableHead>
						<TableHead>Date & Time</TableHead>
						<TableHead className="flex items-center gap-3">
							<MapPin size={16} strokeWidth={1} />
							Location
						</TableHead>
						<TableHead className="text-right">Links</TableHead>
						<TableHead className="text-right">Delete</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{invites.map((invite) => (
						<TableRow key={invite.id}>
							<TableCell>{invite.title}</TableCell>
							<TableCell>
								{new Date(invite.date).toLocaleDateString()}{" "}
								{new Date(invite.date).toLocaleTimeString()}
							</TableCell>
							<TableCell>{invite.location}</TableCell>
							<TableCell className="text-right flex items-center gap-3 justify-end">
								<Link href={`invite/${invite.id}`} target="_blank">
									<Button variant="outline" size="sm" className="text-blue-600">
										<SquareArrowOutUpRight />
									</Button>
								</Link>

								<WhatsAppButton
									text={`${window.location.origin}/invite/${invite.id}`}
								/>
							</TableCell>
							<TableCell className="text-right">
								<Button
									onClick={() => handleDeleteInvite(invite.id)}
									variant={"outline"}
									className=""
								>
									<Trash2 />
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default UserInvitesList;
