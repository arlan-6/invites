"use client";
import React, { FC, useEffect, useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./motion-primitives/dialog";
import LZString from "lz-string";
import { Copy, Phone, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";

interface shareDialogButtonProps {
	className?: string;
	templateId: string;
	inviteData: {
		title?: string;
		date?: string;
		time?: string;
		location?: string;
		message?: string;
	};
	shareText?: string;
}

export const ShareDialogButton: FC<shareDialogButtonProps> = ({
	templateId,
	inviteData,
	shareText,
}) => {
	const [ShareLink, setShareLink] = useState<string | null>(null);

	// Update compressedData and ShareLink whenever inviteData changes
	useEffect(() => {
		if (
			!inviteData ||
			inviteData.title === "" ||
			inviteData.date === "" ||
			inviteData.time === "" ||
			(inviteData.location === "" && inviteData.message === "")
		) {
			setShareLink(null);
			return;
		}

		const data = JSON.stringify({ templateId, inviteData });
		const compressed = LZString.compressToEncodedURIComponent(data);
		setShareLink(`${window.location.origin}/invite/${compressed}`);
	}, [templateId, inviteData]); // Add inviteData as a dependency

	const copyHandler = () => {
		navigator.clipboard.writeText(ShareLink || "");
		toast.info("Link copied to clipboard!");
	};

	return (
		<Dialog
			// onOpenChange={() => toast.error("No data to share!", { duration: 500 })}
		>
			<DialogTrigger className="">
				<>
					{shareText}
					<Share2 size={16} strokeWidth={1.5} />
				</>
			</DialogTrigger>
			<DialogContent className="w-full max-w-md bg-white p-6 dark:bg-zinc-900">
				<DialogHeader>
					<DialogTitle className="text-zinc-900 dark:text-white">
						Share
					</DialogTitle>
					<DialogDescription className="text-zinc-600 dark:text-zinc-400">
						Link to the invitation
					</DialogDescription>
				</DialogHeader>
				{ShareLink ? (
					<div className="flex items-center gap-2">
						{/* <div className="w-5/6 overflow-hidden truncate border p-2 px-4 rounded border-gray-300 dark:border-gray-700">
						{ShareLink && <>{ShareLink}</>}

					</div> */}
						<Input value={ShareLink} readOnly />
						<Button
							variant={"outline"}
							className="cursor-pointer m-0"
							onClick={copyHandler}
						>
							<Copy className="" strokeWidth={1} />
						</Button>
						<Link
							href={`https://api.whatsapp.com/send?text=${ShareLink}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Button variant={"outline"} className="cursor-pointer m-0">
								<Phone className="" strokeWidth={1} />
							</Button>
						</Link>
					</div>
				) : (
					<div className="text-center text-red-500">No data to share!</div>
				)}
				<DialogClose />
			</DialogContent>
		</Dialog>
	);
};
