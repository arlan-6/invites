"use client";

import React, { useEffect, useState } from "react";
import { Invite } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Loader from "../ui/loader";
import { getUserInvites } from "@/lib/inviteUtils";
import Link from "next/link";

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
		<div className="bg-white shadow-md rounded-lg p-6">
			<h2 className="text-xl font-semibold mb-4 text-gray-900">Your Invites</h2>
			<ul className="space-y-4">
				{invites.map((invite) => (
					<li
						key={invite.id}
						className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
					>
						<div>
							<h3 className="text-base font-medium text-gray-800">
								{invite.title}
							</h3>
							<p className="text-sm text-gray-500">
								{new Date(invite.date).toLocaleDateString()} at{" "}
								{new Date(invite.date).toLocaleTimeString()}
							</p>
							<p className="text-sm text-gray-600">{invite.location}</p>
						</div>
						<Link href={`invite/${invite.id}`} target="_blank">
							<Button variant="outline" size="sm">
								View
							</Button>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default UserInvitesList;
