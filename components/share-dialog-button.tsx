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
import { Copy } from "lucide-react";
import { toast } from "sonner";

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
}

export const ShareDialogButton: FC<shareDialogButtonProps> = ({
    className,
    templateId,
    inviteData,
}) => {
    // Validate inviteData
    if (
        !inviteData ||
        (inviteData.title === "" ||
            inviteData.date === "" ||
            inviteData.time === "" ||
            inviteData.location === "" &&
            inviteData.message === "")
    ) {
        toast.error("No data to share!");
        return null;
    }

    const [compressedData, setCompressedData] = useState<string | null>(null);
    const [ShareLink, setShareLink] = useState<string | null>(null);

    // Update compressedData and ShareLink whenever inviteData changes
    useEffect(() => {
        const data = JSON.stringify({ templateId, inviteData });
        const compressed = LZString.compressToEncodedURIComponent(data);
        setCompressedData(compressed);
        setShareLink(`${window.location.origin}/invite/${compressed}`);
    }, [templateId, inviteData]); // Add inviteData as a dependency

    const copyHandler = () => {
        navigator.clipboard.writeText(ShareLink || "");
        toast.info("Link copied to clipboard!");
    };

    return (
        <Dialog>
            <DialogTrigger className="bg-zinc-950 px-4 py-2 text-sm text-white hover:bg-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
                Share
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
                <div className="flex items-center gap-2">
                    <div className="w-5/6 overflow-hidden truncate border p-2 px-4 rounded border-gray-300 dark:border-gray-700">
                        {ShareLink && <>{ShareLink}</>}
                    </div>
                    <div className="cursor-pointer hover:bg-gray-100 border rounded p-2 border-gray-300 dark:border-gray-700">
                        <Copy className="" onClick={copyHandler} strokeWidth={1} />
                    </div>
                </div>
                <DialogClose />
            </DialogContent>
        </Dialog>
    );
};