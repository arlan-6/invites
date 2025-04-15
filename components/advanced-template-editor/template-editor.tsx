"use client";

import React, { FC, useCallback, useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import useTemplateStore from "@/store/advancedTemplate";
import useAdvancedInviteStore from "@/store/advancedInviteEdit";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Accordion } from "../accordion"; // Assuming this is your custom Accordion or Shadcn's
import { ScrollArea } from "../ui/scroll-area";
import { ShareDialogButton } from "./share-dialog-button"; // Assume this handles its own localization internally or pass `t`
import { Label } from "../ui/label";
import { useLanguage } from "../language-provider";
import { describe } from "node:test";

// Import your localization hook

interface TemplateEditorProps {
	className?: string;
}

// Keep the original config for structure and non-translatable parts like type/accept
const inputBaseConfig: Record<
	string,
	{
		type?: string;
		accept?: string;
		required?: boolean;
        // Note: Label and Placeholder are now handled via translation keys
	}
> = {
	description: { type: "text", required: true },
	name: { type: "text", required: true },
	age: { type: "number", required: true },
	dateTime: { type: "datetime-local", required: true },
	location: { type: "text", required: true },
	address: { type: "text", required: true },
	addressLink: { type: "text", required: true },
	contactInfo: { type: "text", required: true },
	message: { required: false },
	image: { type: "file", accept: "image/*", required: false },
	themeOrMessage: { type: "text", required: false },
	dressCode: { type: "text", required: false },
	giftInfo: { type: "text", required: false },
	rsvpDeadline: { type: "datetime-local" },
};

export const TemplateEditor: FC<TemplateEditorProps> = ({ className }) => {
	const [isEditorOpen, setIsEditorOpen] = useState(true);
	const router = useRouter();

    // --- Localization Hook ---
    const { t } = useLanguage();

	const inputs = useTemplateStore((state) => state.inputs as (keyof typeof inputBaseConfig)[]);
	const inviteData = useAdvancedInviteStore((state) => state.inviteData);
	const setInviteData = useAdvancedInviteStore((state) => state.setInviteData);
	const resetInviteData = useAdvancedInviteStore((state) => state.resetInviteData);

	const [fileInputKey, setFileInputKey] = useState(Date.now());
	const [fileName, setFileName] = useState<string | null>(null);

	useEffect(() => {
		resetInviteData();
	}, [resetInviteData]);


	const handleInputChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
            const { id: inputKey, value, type, files } = e.target;

            let formattedValue: any;

            if (type === 'file') {
                const file = files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setInviteData({ [inputKey]: reader.result as string });
                        if (inputKey === 'image') { // Assuming 'image' is the key for the file input we track name for
                           setFileName(file.name);
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    setInviteData({ [inputKey]: null });
                    if (inputKey === 'image') {
                         setFileName(null);
                         setFileInputKey(Date.now());
                    }
                }
                return;
			} else if ((inputKey === "dateTime" || inputKey === "rsvpDeadline") && value) {
				const isoDateTime = new Date(value).toISOString();
				if (!isNaN(Date.parse(isoDateTime))) {
					formattedValue = isoDateTime; // Ensure valid ISO-8601 DateTime
				} else {
					console.error(`Invalid ISO-8601 DateTime: ${value}`);
					return; // Exit if invalid
				}
			} else {
				formattedValue = value; // Default for text, number etc.
			}

            if (type !== 'file') {
                 setInviteData({ [inputKey]: formattedValue });
            }
        },
        [setInviteData] // Removed fileName/setFileName dependencies unless more complex logic needed
    );

	const handleClearFile = (inputKey: string) => {
		setInviteData({ [inputKey]: null });
		if (inputKey === 'image') { // Only reset fileName display for the image input
           setFileName(null);
           setFileInputKey(Date.now());
        }
	};

	const requiredInputs = inputs?.filter((key) => inputBaseConfig[key]?.required) ?? [];
	const optionalInputs = inputs?.filter((key) => !inputBaseConfig[key]?.required) ?? [];

	const renderInput = (inputKey: keyof typeof inputBaseConfig) => {
		const baseConfig = inputBaseConfig[inputKey];
		if (!baseConfig) return null;

        // --- Get translated labels and placeholders ---
        const label = t(`advanced-template-editor.label.${inputKey}`);
        const placeholder = t(`advanced-template-editor.placeholder.${inputKey}`); // Get placeholder translation

		const currentValue = (inviteData as any)[inputKey];
		const isFile = baseConfig.type === "file";

		let displayValue: string | number | readonly string[] | undefined = currentValue;

		if (isFile) {
            // We specifically target 'image' key for the filename display logic here
            const showClearButton = inputKey === 'image' && fileName;
            const selectedText = inputKey === 'image' && fileName
                 ? t('advanced-template-editor.fileInput.selected', { fileName }) // Use interpolation
                 : '';


			return (
				<div key={inputKey} className="mb-4 space-y-1.5">
					<Label htmlFor={inputKey} className="flex justify-between items-center">
						<span>{label} {baseConfig.required && "*"}</span>
                        {showClearButton && (
                            <Button variant="ghost" size="sm" onClick={() => handleClearFile(inputKey)} className="text-xs h-auto p-1">
                                {t('advanced-template-editor.clearButton')}
                            </Button>
                        )}
					</Label>
					<Input
						id={inputKey}
						type="file"
						accept={baseConfig.accept}
						onChange={handleInputChange}
						className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
						key={fileInputKey}
					/>
                    {selectedText && <p className="text-sm text-muted-foreground mt-1">{selectedText}</p>}
				 </div>
			);
		}

		return (
			<div key={inputKey} className="mb-4 space-y-1.5">
				<Label htmlFor={inputKey}>
					{label} {baseConfig.required && "*"}
				</Label>
				<Input
					id={inputKey}
					type={baseConfig.type || "text"}
					placeholder={placeholder} // Use translated placeholder
					required={baseConfig.required}
					value={
						baseConfig.type === "datetime-local" && displayValue
							? displayValue.toString().slice(0, 16) // Format ISO string for datetime-local input
							: displayValue ?? ""
					}
					onChange={handleInputChange}
					min={baseConfig.type === "number" ? "0" : undefined}
					autoComplete="off"
				/>
			</div>
		);
	};


	return (
		<>
			<div className="fixed right-5 top-20 z-[100] ">
				<Button onClick={() => setIsEditorOpen(!isEditorOpen)} size="icon"
                    // --- Translate aria-label ---
                    aria-label={isEditorOpen ? t('advanced-template-editor.toggleButton.close') : t('advanced-template-editor.toggleButton.open')}>
					{isEditorOpen ? <ArrowRight /> : <ArrowLeft />}
				</Button>
			</div>

			<div
				className={cn(
					"fixed top-0 right-0 w-96 h-screen bg-background/80 backdrop-blur-lg border-l border-border shadow-lg",
					"transition-transform duration-300 ease-in-out z-[99]",
					isEditorOpen ? "translate-x-0" : "translate-x-full",
					className
				)}
			>
				 <ScrollArea className="h-full">
					 <div className="p-5 pb-20">
                         <div className="flex justify-between items-center mb-4">
                             {/* --- Translate Title --- */}
                            <h2 className="text-xl font-semibold">{t('advanced-template-editor.title')}</h2>
                         </div>

                        {/* Assuming ShareDialogButton handles its own localization or takes `t` as a prop */}
						<ShareDialogButton />

						<div className="mt-6 space-y-6">
							{!inputs || inputs.length === 0 ? (
								<div className="flex flex-col justify-center items-center h-40 text-center">
                                    {/* --- Translate Empty State --- */}
									<p className="text-muted-foreground mb-2">{t('advanced-template-editor.emptyState.message')}</p>
									<Button onClick={() => router.refresh()} variant="outline">
                                        {/* --- Translate Refresh Button --- */}
                                        {t('advanced-template-editor.refreshButton')}
                                    </Button>
								</div>
							) : (
								<>
									<Accordion
                                        // --- Translate Accordion Title ---
										title={t('advanced-template-editor.accordion.required')}
										titleClassName="text-lg font-medium p-1"
										className="border-b border-border pb-4"
									>
										<div className="pt-2">
											 {requiredInputs.map(renderInput)}
										</div>
									</Accordion>

									<Accordion
                                         // --- Translate Accordion Title ---
										title={t('advanced-template-editor.accordion.optional')}
										titleClassName="text-lg font-medium p-1"
										 className="border-b border-border pb-4"
										isClosed={true}
									>
									   <div className="pt-2">
											{optionalInputs.map(renderInput)}
									   </div>
									</Accordion>
								</>
							)}
						</div>
					</div>
				</ScrollArea>
			</div>
		</>
	);
};