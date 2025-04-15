"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Loader from "../ui/loader";
import Link from "next/link";
import {
	CircleOff,
	Copy,
	MapPin,
	Share2,
	SquareArrowOutUpRight,
	Trash2,
} from "lucide-react";
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
import { useLanguage } from "../language-provider";
import { AdvancedTemplateType } from "@/data/advanced-templates";

interface UseradvancedINivtesLIstProps {
	userId: string;
	invites: InviteType[];
	deleteInviteHandler: (inviteId: string) => void;
}
type InviteType = {
} & Omit<AdvancedInvite, "template">;
const UseradvancedINivtesLIst: React.FC<UseradvancedINivtesLIstProps> = ({
	userId,
	invites,
	deleteInviteHandler,
}) => {
	const {language} = useLanguage();
	const copyHandler = (invite_id: string, invite_path: string) => {
		navigator.clipboard.writeText(
			`${window.location.origin}/invite/${invite_path}/${invite_id}`,
		);
	};

	return (
		<div className="my-6">
			<Table className="border">
				<TableHeader className="bg-accent/50">
					<TableRow className="group">
						<TableHead className="w-[50px] text-right">#</TableHead>

						<TableHead className="w-[100px] flex gap-2 items-center">
							To invite <SquareArrowOutUpRight strokeWidth={2} size={18} />
						</TableHead>
						<TableHead>
							Description
						</TableHead>
						<TableHead>Temaplate</TableHead>
						<TableHead>View Rsvp</TableHead>

						<TableHead className="">
							<div className="flex gap-2 items-center">
								{" "}
								Share <Share2 strokeWidth={2} size={18} />
							</div>
						</TableHead>
						<TableHead className="">
							<div className="flex gap-2 items-center">
								{" "}
								Delete <CircleOff strokeWidth={2} size={18} />
							</div>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{invites.map((invite, i) => (
						<TableRow key={invite.id} className="group">
							<TableCell className="text-right">{i + 1}</TableCell>
							<TableCell className="font-semibold">
								<Link
									href={`invite/${invite.id}`}
									target="_blank"
									title="Go to invite"
								>
									<Button variant="link" size="sm">
										Invite
									</Button>
								</Link>
								<Button
									title="Copy link"
									size={"sm"}
									variant={"outline"}
									onClick={() => copyHandler(invite.id, invite.path)}
									className="lg:opacity-0 group-hover:opacity-100"
								>
									<Copy size={10} strokeWidth={1.25} />
								</Button>
							</TableCell>
							<TableCell className="font-semibold">
								{invite.description}
							</TableCell>
							<TableCell className="font-semibold">
								<Link
									href={`/dashboard/${invite.path}`}
									target="_blank"
									title="Go to template"
								>
									<Button variant="link" size="sm">
										{invite.path}
									</Button>
								</Link></TableCell>
							<TableCell className="">
								<Link href={`/dashboard/${invite.id}`}>
									<Button variant="link" >
										rsvp
										<SquareArrowOutUpRight className="lg:opacity-0 group-hover:opacity-100"/>
									</Button>
								</Link>
							</TableCell>

							<TableCell className="">
								
								<WhatsAppButton
									text={`${window.location.origin}/invite/${invite.path}/${invite.id}`}
								/>
								
							</TableCell>
							<TableCell className="">
								<Button
									onClick={() => deleteInviteHandler(invite.id)}
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
