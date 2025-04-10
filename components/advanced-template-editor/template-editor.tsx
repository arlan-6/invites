"use client";
import React, { FC, useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import useTemplateStore from "@/store/advancedTemplate";
import { Input } from "../ui/input";
import useAdvancedInviteStore from "@/store/advancedInviteEdit";
import { ShareDialogButton } from "./share-dialog-button";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Accordion } from "../accordion";

interface TemplateEditorProps {
	className?: string;
}

const inputConfig: Record<
	string,
	{ type?: string; placeholder?: string; accept?: string; required?: boolean }
> = {
	name: { type: "text", placeholder: "Name", required: true },
	age: { type: "number", placeholder: "Age", required: true },
	dateTime: {
		type: "datetime-local",
		placeholder: "Date and Time",
		required: true,
	},
	location: { type: "text", placeholder: "Location", required: true },
	address: { type: "text", placeholder: "Address", required: true },
	addressLink: { type: "text", placeholder: "Address Link", required: true },
	contactInfo: {
		type: "text",
		placeholder: "Contact Information",
		required: true,
	},
	message: { placeholder: "Message", required: false },
	image: {
		type: "file",
		accept: "image/*",
		placeholder: "Image",
		required: false,
	},
	themeOrMessage: {
		type: "text",
		placeholder: "Theme or Message",
		required: false,
	},
	dressCode: { type: "text", placeholder: "Dress Code", required: false },
	giftInfo: { type: "text", placeholder: "Gift Information", required: false },
	rsvpDeadline: { type: "datetime-local", placeholder: "RSVP Deadline" },
};

export const TemplateEditor: FC<TemplateEditorProps> = ({ className }) => {
	const [open, setOpen] = useState(true);
	const router = useRouter();
	const [inputs, setInputs] = useState<string[]>([]);
	const inviteData = useAdvancedInviteStore.getState().inviteData;
	const resetInviteData = useAdvancedInviteStore.getState().resetInviteData;
	const setInviteData = useAdvancedInviteStore.getState().setInviteData;

	useEffect(() => {
		const inputss = useTemplateStore.getState()
			.inputs as (keyof typeof inputConfig)[];
		setInputs(inputss);
	}, [setInputs]);
	resetInviteData();

	const handleInputChange = (input: string, value: string) => {
		const formattedValue =
			(input === "dateTime" || input === "rsvpDeadline") && value
				? new Date(value).toISOString()
				: input === "addressLink"
				? value.split(",")
				: value;

		setInviteData({
			[input]: formattedValue,
		});
	};

	const requiredInputs = inputs.filter((input) => inputConfig[input]?.required);
	const optionalInputs = inputs.filter(
		(input) => !inputConfig[input]?.required,
	);

	return (
		<div className=" right-0 top-15 max-w-96 h-full bg-accent ">
			<div className="fixed right-5 top-20 z-[9999999] animate-bounce ">
				<Button onClick={() => setOpen(!open)}>
					{!open ? <ArrowLeft /> : <ArrowRight />}
				</Button>
			</div>
			<div
				className={cn(
					"fixed p-5 pb-32 right-0 w-96 h-screen overflow-hidden bg-background/50 backdrop-blur-lg",
					className,
					open ? "block" : "hidden",
				)}
			>
				<ShareDialogButton />
				<div className="overflow-y-scroll w-full h-full p-4 mt-2">
					{!inputs ||
						(inputs.length === 0 && (
							<div className="flex justify-center items-center h-full">
								<p className="text-gray-500">Refresh page </p>
								<div className="">
									<Button onClick={() => router.refresh()}>Try again...</Button>
								</div>
							</div>
						))}
						<Accordion title="Required Inputs" titleClassName="text-lg p-1" className="mb-4 ">
					{requiredInputs.map((input) => {
						const config = inputConfig[input];
						if (!config) return null;

						return (
							<div key={input} className="mb-4">
								<label
									htmlFor={input}
									className="block text-sm font-medium text-gray-700"
								>
									{config.placeholder} {config.required && "*"}
								</label>
								<Input
									id={input}
									{...config}
									value={
										input === "addressLink"
											? (inviteData as any)[input]?.join(",")
											: (inviteData as any)[input]
									}
									onChange={(e) => handleInputChange(input, e.target.value)}
								/>
							</div>
						);
					})}
					</Accordion>
					<hr className="my-4 border-gray-300" />
					<Accordion title="Optional Inputs" titleClassName="text-lg p-1" className="mb-4 ">
						{optionalInputs.map((input) => {
							const config = inputConfig[input];
							if (!config) return null;

							return (
								<div key={input} className="mb-4">
									<label
										htmlFor={input}
										className="block text-sm font-medium text-gray-700"
									>
										{config.placeholder} {config.required && "*"}
									</label>
									<Input
										id={input}
										{...config}
										value={
											input === "addressLink"
												? (inviteData as any)[input]?.join(",")
												: (inviteData as any)[input]
										}
										onChange={(e) => handleInputChange(input, e.target.value)}
									/>
								</div>
							);
						})}
					</Accordion>
				</div>
			</div>
		</div>
	);
};
