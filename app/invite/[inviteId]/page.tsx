"use client";

import React, { useEffect, useState } from "react";
import LZString from "lz-string";
import { useParams } from "next/navigation";
import { getTemplateById, TemplateType } from "@/data/templates";
import { InviteTemplate } from "@/components/invite-template";
import { getInviteById } from "@/lib/inviteUtils";
import Loader from "@/components/ui/loader";
import {  User } from "@prisma/client";

const Page: React.FC = () => {
    const params = useParams<{ inviteId: string }>();
    const [template, setTemplate] = useState<TemplateType | null>(null);
    const [inviteData, setInviteData] = useState<{
        title?: string;
        date?: string;
        time?: string;
        location?: string;
        message?: string;
    } | null>(null);
	const [creator,setCreator] = useState<User|null>(null)
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvite = async () => {
            try {
                setLoading(true);

                // Attempt to decompress the invite data
                const decompressedData = LZString.decompressFromEncodedURIComponent(
                    params.inviteId.replace(/%2B/g, "+")
                );

                if (decompressedData) {
                    // If decompression is successful, parse the data
                    const { templateId, inviteData } = JSON.parse(decompressedData);
                    const template = getTemplateById(templateId);

                    if (!template) {
                        throw new Error("Template not found!");
                    }

                    setTemplate(template);
                    setInviteData(inviteData);
                } else {
                    // If decompression fails, fallback to fetching from Prisma
                    const invite = await getInviteById(params.inviteId);

                    if (!invite) {
                        throw new Error("Invite not found!");
                    }

                    const template = getTemplateById(invite.templateId);

                    if (!template) {
                        throw new Error("Template not found!");
                    }

                    setTemplate(template);
					setCreator(invite.user)
                    // Convert Prisma invite data to the expected format
                    setInviteData({
                        title: invite.title,
                        date: invite.date.toISOString().split("T")[0], // Convert Date to string (YYYY-MM-DD)
                        time: invite.date.toISOString().split("T")[1]?.slice(0, 5), // Extract time (HH:mm)
                        location: invite.location,
                        message: invite.message || "",
                    });
                }
            } catch (err: any) {
                console.error("Error loading invite:", err);
                setError(err.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchInvite();
    }, [params.inviteId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h1 className="text-center text-3xl text-red-500">{error}</h1>
            </div>
        );
    }

    if (!template || !inviteData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h1 className="text-center text-3xl">Template or Invite not found!</h1>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-t from-background to-primary h-screen w-full">
			<div className="relative w-auto top-10 pl-4 text-white z-0">
				<p className="w-auto">Created by: {creator?.name || "Unknown"}</p>
			</div>
            <div className="h-screen w-full flex justify-center items-center">
                <InviteTemplate template={template} formData={inviteData} />
            </div>
        </div>
    );
};

export default Page;