"use client"; // Keep if InviteTemplate or other used components require it

import React, { FC } from "react";
// Remove unused imports if useEffect/useState/useParams are gone
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
import { TemplateTranslationsType } from "@/data/templates"; // Keep if needed for type
import { InviteTemplate } from "@/components/invite-template";
// Remove unused imports if useEffect/useState are gone
// import Loader from "@/components/ui/loader";
// import { Invite, User } from "@prisma/client"; // Remove Invite if prop is removed
// import { getInviteById } from "@/lib/inviteUtils"; // Remove if fetching is outside
// import { getTemplateById } from "@/lib/templateUtils"; // Remove if fetching is outside
import { cn } from "@/lib/utils"; // Keep cn if used

// Define the expected type for the template prop, matching InviteTemplate's expectation
// Replace this with the actual exported type if available
type InviteTemplateData = {
    id: string;
    color: string;
    imageCorner: string | null;
    cornerRitarion: boolean | null;
    image: string | null;
    occasions: string[];
    tags: string[];
    translations: TemplateTranslationsType;
    createdAt: Date;
    updatedAt: Date;
};

// Define the props for this specific view component
interface InviteViewProps {
    className?: string; // Allow passing custom classes
    template: InviteTemplateData | null; // Allow null if fetching might fail upstream
    inviteData: {
        title?: string;
        date?: string;
        time?: string;
        location?: string;
        message?: string;
    } | null; // Allow null if fetching might fail upstream
    creator: string | null; // Allow null, use lowercase 'string'
}

const InviteView: FC<InviteViewProps> = ({ className, template, inviteData, creator }) => {
    // No more client-side fetching state needed here

    // Handle cases where data wasn't successfully fetched by the parent
    // Render a simple message or null, parent should ideally show a better UI/404
    if (!template || !inviteData) {
        return (
            <div className="flex justify-center items-center min-h-screen text-center p-4">
                <h1 className="text-2xl text-muted-foreground">
                    Invitation details could not be loaded.
                </h1>
            </div>
        );
    }

    // Render the main view
    return (
        // Use a flex container for centering, add padding, maybe a subtle background
        <div className={cn(
            "w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 pt-15 md:pt-5",
            // Optional: Add a subtle background gradient if desired
             "bg-gradient-to-br from-background  to-secondary/10",
            className // Merge with external classes
            )}
        >
            {/* Invite Card - Primary focus */}
            <div className="mb-4 transform transition-transform duration-300 hover:scale-[1.02]"> {/* Subtle hover effect */}
                <InviteTemplate
                    // Pass props directly - no type assertion needed if types match
                    template={template}
                    formData={inviteData}
                />
            </div>

            {/* Creator Info - Positioned below the card */}
            <div className="text-center text-sm text-muted-foreground mt-2">
                Created by: {creator || "Unknown"}
                {/* Optional: Add internationalization if needed */}
                {/* {t('inviteView.createdBy', { name: creator || t('common.unknown') })} */}
            </div>
        </div>
    );
};

export default InviteView;