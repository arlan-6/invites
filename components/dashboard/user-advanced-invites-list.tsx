"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Loader from "../ui/loader";
import Link from "next/link";
import { Copy, MapPin, SquareArrowOutUpRight, Trash2 } from "lucide-react";
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
import {
	DeleteAdvancedInviteById,
	GetAdvancedInviteByUserId,
} from "@/lib/advancedInvitesUtils";
import { AdvancedInvite } from "@prisma/client";

interface UseradvancedINivtesLIstProps {
	userId: string;
}

const UseradvancedINivtesLIst: React.FC<UseradvancedINivtesLIstProps> = ({
	userId,
}) => {
	const [invites, setInvites] = useState<AdvancedInvite[] | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchInvites = async () => {
			try {
				setLoading(true);
				const invites = await GetAdvancedInviteByUserId(userId);
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

	const copyHandler = (invite_id: string, invite_path: string) => {
		navigator.clipboard.writeText(
			`${window.location.origin}/invite/${invite_path}/${invite_id}`,
		);
	};

	const handleDeleteInvite = async (inviteId: string) => {
		try {
			await DeleteAdvancedInviteById(inviteId);
			toast.success("Invite deleted successfully!");
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
		<div className="max-w-6xl mx-auto bg-background shadow-lg rounded-lg p-6">
			<Table>
				<TableCaption>List of advanced invites</TableCaption>
				<TableHeader>
					<TableRow>
                        <TableHead>View Rsvp</TableHead>
						<TableHead>Title</TableHead>
						<TableHead>Date & Time</TableHead>
						<TableHead>Location</TableHead>
						<TableHead>Address</TableHead>
						<TableHead>Contact Info</TableHead>
						<TableHead className="text-center">Links</TableHead>
						<TableHead className="text-right">Delete</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{invites.map((invite) => (
						<TableRow key={invite.id}>
                            <TableCell className="text-center">
                                <Link href={`/dashboard/${invite.id}`}>
                                    <Button variant="outline" size="sm" className="text-blue-600">
                                        rsvp
                                        <SquareArrowOutUpRight />
                                    </Button>
                                </Link>
                            </TableCell>
							<TableCell>
								<Link href={"/dashboard/" + invite.id}>{invite.name}</Link>
							</TableCell>
							<TableCell>
								{new Date(invite.dateTime).toLocaleDateString()}{" "}
								{new Date(invite.dateTime).toLocaleTimeString()}
							</TableCell>
							<TableCell>{invite.location}</TableCell>
							<TableCell>{invite.address}</TableCell>
							<TableCell>{invite.contactInfo || "N/A"}</TableCell>
							<TableCell className="text-center flex items-center gap-3 justify-center">
								<Link
									href={`invite/${invite.path}/${invite.id}`}
									target="_blank"
									title="Go to invite"
								>
									<Button variant="outline" size="sm" className="text-blue-600">
										<SquareArrowOutUpRight />
									</Button>
								</Link>
								<WhatsAppButton
									text={`${window.location.origin}/invite/${invite.path}/${invite.id}`}
								/>
								<Button
									title="Copy link"
									onClick={() => copyHandler(invite.id, invite.path)}
								>
									<Copy />
								</Button>
							</TableCell>
							<TableCell className="text-right">
								<Button
									onClick={() => handleDeleteInvite(invite.id)}
									variant={"outline"}
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

export default UseradvancedINivtesLIst;
