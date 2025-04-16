"use client";

import React from "react";
import { Invite, Template } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	CircleOff,
	Copy,
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
import { useLanguage } from "../language-provider";
import { DeleteConfirm } from "./delete-comfirm";

interface UserInvitesListProps {
	userId: string;
	invites: InviteType[];
	deleteInviteHandler: (inviteId: string) => void;
}
type InviteType = {
	template: Template;
} & Omit<Invite, "template">;

const UserInvitesList: React.FC<UserInvitesListProps> = ({
	userId,
	invites,
	deleteInviteHandler,
}) => {
	const { language } = useLanguage();

	const copyHandler = (invite_id: string) => {
		navigator.clipboard.writeText(
			`${window.location.origin}/invite/${invite_id}`,
		);
		toast.success("Invite link copied to clipboard!");
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
						<TableHead className="w-[100px]">Title</TableHead>
						<TableHead>Template</TableHead>
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
							<TableCell className="font-semibold text-right">
								{i + 1}
							</TableCell>
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
									onClick={() => copyHandler(invite.id)}
									className="lg:opacity-0 group-hover:opacity-100"
								>
									<Copy size={10} strokeWidth={1.25} />
								</Button>
							</TableCell>
							<TableCell className="font-semibold">{invite.title}</TableCell>
							<TableCell className="text-gray-500">
								{/* {invite.templateId} */}
								<Link href={"/templates/" + invite.templateId}>
									<Button variant={"link"}>
										{invite.template.translations &&
											(
												invite.template.translations as Record<
													string,
													{ name: string }
												>
											)[language]?.name}
									</Button>
								</Link>
							</TableCell>
							<TableCell>
								<WhatsAppButton
									text={`${window.location.origin}/invite/${invite.id}`}
								/>
							</TableCell>
							<TableCell
							// className="lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200 "
							>
								<DeleteConfirm
									deleteHandler={deleteInviteHandler}
									id={invite.id}
								>
									<Button
										// onClick={() => deleteInviteHandler(invite.id)}
										title="Delete invite"
										variant={"outline"}
										className=""
									>
										<Trash2 />
									</Button>
								</DeleteConfirm>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default UserInvitesList;
