"use client";
import React, { FC, useState } from "react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { getTemplateById } from "@/data/templates";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ShareDialogButton } from "./share-dialog-button";

interface InviteEditorProps {
	className?: string;
}

type InviteData ={
    title?: string;
    date?: string;
    time?: string;
    location?: string;
    message?: string;
}

export const InviteEditor: FC<InviteEditorProps> = ({ className }) => {
	const params = useParams<{ id: string }>();

	const template = getTemplateById(params.id);
	if (!template) {
		return (
			<div className={cn("", className)}>
				<h1 className="text-center text-3xl">Template not found!</h1>
			</div>
		);
	}

	const [formData, setFormData] = useState<InviteData>({
        title: "",
        date: "",
        time: "",
        location: "",
        message: "",}
    );

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

const handleDelete = () => {
    // Delete the template
    setFormData({
        title: "",
        date: "",
        time: "",
        location: "",
        message: "",
    }
    )
}

	return (
		<div className={cn("", className)}>
			{params.id}

			<div className="">
				<div className="flex justify-around items-center mb-8">
                    <div className="">
					<h1 className="text-2xl">{template.name}</h1>
					<p className="">{template.description}</p></div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleDelete} className="hover:border-red-500 hover:text-red-800 hover:bg-red-100 transition-colors duration-150 cursor-pointer" >Delete</Button>
                        <ShareDialogButton templateId={params.id} inviteData={formData}/>
                    </div>
				</div>

				<div className="w-full flex items-center justify-center gap-16">
					<div
						className={cn(
							"bg-gradient-to-bl p-6 rounded-lg w-96 text-white",
							template.color,
						)}
					>
						<Input
							name="title"
							placeholder="Event title: birthday party"
							maxLength={30}
							value={formData.title}
							onChange={handleChange}
						/>
						<Input
							name="date"
							placeholder="Event date: 2022-12-31"
							maxLength={10}
							value={formData.date}
							onChange={handleChange}
						/>
						<Input
							name="time"
							placeholder="Event time: 21:00"
							maxLength={5}
							value={formData.time}
							onChange={handleChange}
						/>
						<Input
							name="location"
							placeholder="Location: street, city"
							maxLength={20}
							value={formData.location}
							onChange={handleChange}
						/>
						<Input
							name="message"
							placeholder="Message"
							maxLength={50}
							value={formData.message}
							onChange={handleChange}
						/>
					</div>
					<div
						className={cn(
							"bg-gradient-to-bl p-6 rounded-lg w-96 text-white",
							template.color,
						)}
					>
						<div className="text-3xl text-center">
							{formData.title || "Event title"}
						</div>
						<div className="flex justify-center gap-2 text-amber-50 text-sm">
							<div className="">{formData.date || "Event date"}</div>
							<div className="">{formData.time || "Event time"}</div>
						</div>
						<div className="">{formData.location || "Location"}</div>
						<div className="text-center">{formData.message || "Message"}</div>
					</div>
				</div>


			</div>
		</div>
	);
};
