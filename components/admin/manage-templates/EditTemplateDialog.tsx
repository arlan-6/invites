"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
// *** IMPORT YOUR ACTUAL API FUNCTION ***
import { updateTemplate } from "@/lib/inviteTemplateEdit";
// *** IMPORT TYPES AND HELPERS ***
import {
	prepareDataForApi,
	arrayToString,
	type Template,
	type Role,
	type TemplateFormData,
	// type DbTemplateTranslations,
	defaultTemplateFormData,
} from "./template-types"; // Import necessary types
// Import UI Components
import { TemplateFormFields } from "./TemplateFormFields";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TemplateTranslationsType } from "@/data/templates";

interface EditTemplateDialogProps {
	userRole: Role;
	template: Template; // Template is required for editing
	onSuccess: () => void; // Call this on successful update
	onClose: () => void; // Call this to request closing the dialog
}

export default function EditTemplateDialog({
	userRole,
	template,
	onSuccess,
	onClose,
}: EditTemplateDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState<TemplateFormData>(
		defaultTemplateFormData,
	);
	const [formError, setFormError] = useState<string | null>(null);

	// Initialize form
	useEffect(() => {
		if (!template) return;
		console.log("EditDialog useEffect triggered for template:", template.id); // Debug log

		try {
			let loadedTranslations: Partial<TemplateTranslationsType> = {};
			// Safely check and parse translations
			if (template.translations && typeof template.translations === "object") {
				try {
					// Check if it's actually parseable (might already be an object)
					if (typeof template.translations === "string") {
						loadedTranslations = JSON.parse(
							template.translations as any,
						) as TemplateTranslationsType;
					} else {
						loadedTranslations =
							template.translations as unknown as TemplateTranslationsType;
					}
				} catch (parseError) {
					console.error(
						"Error parsing template translations in EditDialog:",
						parseError,
					);
					loadedTranslations = {}; // Use empty if parsing fails
				}
			} else {
				console.warn(
					"Template translations are missing or not an object in EditDialog for:",
					template.id,
				);
			}

			setFormData({
				color: template.color || "",
				imageCorner: template.imageCorner || "",
				cornerRotation: template.cornerRitarion ?? false, // Map DB `cornerRitarion` to state `cornerRotation`
				image: template.image || "",
				occasions: arrayToString(template.occasions),
				tags: arrayToString(template.tags),
				translations: {
					kk: {
						name: loadedTranslations?.kk?.name ?? "",
						description: loadedTranslations?.kk?.description ?? "",
						middleText: loadedTranslations?.kk?.middleText ?? "",
						occasions: arrayToString(loadedTranslations?.kk?.occasions),
					},
					ru: {
						name: loadedTranslations?.ru?.name ?? "",
						description: loadedTranslations?.ru?.description ?? "",
						middleText: loadedTranslations?.ru?.middleText ?? "",
						occasions: arrayToString(loadedTranslations?.ru?.occasions),
					},
					en: {
						name: loadedTranslations?.en?.name ?? "",
						description: loadedTranslations?.en?.description ?? "",
						middleText: loadedTranslations?.en?.middleText ?? "",
						occasions: arrayToString(loadedTranslations?.en?.occasions),
					},
				},
			});
			setFormError(null);
			setIsSubmitting(false);
		} catch (error) {
			console.error("Error initializing edit form:", error);
			setFormError("Failed to load template data. Please try again.");
			setFormData(defaultTemplateFormData);
		}
	}, [template]);

	// --- Form Data Update Handlers ---
	const handleFormDataChange = useCallback(
		<K extends keyof TemplateFormData>(key: K, value: TemplateFormData[K]) => {
			setFormData((prev) => ({ ...prev, [key]: value }));
			setFormError(null);
		},
		[],
	);

	const handleTranslationChange = useCallback(
		(
			lang: keyof TemplateFormData["translations"],
			field: keyof TemplateFormData["translations"]["en"],
			value: string,
		) => {
			setFormData((prev) => ({
				...prev,
				translations: {
					...prev.translations,
					[lang]: { ...prev.translations[lang], [field]: value },
				},
			}));
			setFormError(null);
		},
		[],
	);

	// --- Form Submission ---
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!template) {
			setFormError("Cannot save, template data is missing.");
			return;
		}
		setFormError(null);

		let dataToSend;
		try {
			dataToSend = prepareDataForApi(formData); // Validate and prepare
		} catch (validationError: any) {
			setFormError(validationError.message);
			toast.warning(validationError.message);
			return;
		}

		setIsSubmitting(true);
		console.log(
			`Submitting update for ${template.id} with prepared data:`,
			dataToSend,
		);

		try {
			const result = await updateTemplate(template.id, dataToSend, userRole); // Call server function

			if (result) {
				// API returns updated template or null
				onSuccess(); // Signal success
			} else {
				// API returned null (permission, validation, not found)
				// Toast should be handled by server function
				setFormError(
					"Failed to update template. Check server logs or permissions.",
				);
			}
		} catch (err: any) {
			// Catch unexpected client-side/network errors
			console.error("Edit Template Dialog Error:", err);
			const message =
				err.message || "An unexpected network or client-side error occurred.";
			setFormError(message);
			toast.error(`Update Error: ${message}`);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
			<DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
				<DialogTitle>Edit Template</DialogTitle>
				<DialogDescription>
					Modify template
					<code className="text-xs bg-muted px-1 py-0.5 rounded">
						{template?.id || "N/A"}
					</code>
					. Required fields marked with <span className="text-red-500">*</span>.
				</DialogDescription>
			</DialogHeader>
				<ScrollArea className="flex-grow" type="scroll">
			<div className="max-h-[60vh]">
				<form onSubmit={handleSubmit} id="edit-template-form">
					<TemplateFormFields
						formData={formData}
						onFormDataChange={handleFormDataChange}
						onTranslationChange={handleTranslationChange}
						isSubmitting={isSubmitting}
					/>
					{formError && (
						<div className="px-6 pb-4">
							
							<p
								role="alert"
								className="text-destructive text-sm text-center py-2 px-3 font-medium border border-destructive/50 bg-destructive/10 rounded"
							>
								
								{formError}
							</p>
						</div>
					)}
				</form>
			</div>
			</ScrollArea>
			
			<DialogFooter className="px-6 pb-6 pt-4 border-t flex-shrink-0 bg-background">
				<DialogClose asChild>
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						disabled={isSubmitting}
					>
						
						Cancel
					</Button>
				</DialogClose>
				<Button
					type="submit"
					form="edit-template-form"
					disabled={isSubmitting || !template || !!formError}
					className="min-w-[120px]"
				>
					{isSubmitting ? (
						<>
							
							<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
						</>
					) : (
						"Save Changes"
					)}
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}
