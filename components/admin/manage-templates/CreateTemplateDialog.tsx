"use client";

import React, { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
// *** IMPORT YOUR ACTUAL API FUNCTION ***
import { createTemplate } from "@/lib/inviteTemplateEdit";
// *** IMPORT HELPERS FROM TYPES FILE ***
import { prepareDataForApi, type Role, type TemplateFormData, defaultTemplateFormData } from "./template-types";
// Import UI Components
import { TemplateFormFields } from "./TemplateFormFields";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreateTemplateDialogProps {
  userRole: Role;
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export default function CreateTemplateDialog({
  userRole,
  isOpen,
  onSuccess,
  onClose,
}: CreateTemplateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TemplateFormData>(defaultTemplateFormData);
  const [formError, setFormError] = useState<string | null>(null);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData(defaultTemplateFormData);
      setFormError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // --- Form Data Update Handlers ---
  const handleFormDataChange = useCallback(<K extends keyof TemplateFormData>(key: K, value: TemplateFormData[K]) => {
      setFormData(prev => ({ ...prev, [key]: value }));
      setFormError(null); // Clear error on change
    }, []);

  const handleTranslationChange = useCallback((
     lang: keyof TemplateFormData['translations'],
     field: keyof TemplateFormData['translations']['en'],
     value: string
   ) => {
       setFormData((prev) => ({
        ...prev,
        translations: {
          ...prev.translations,
          [lang]: { ...prev.translations[lang], [field]: value },
        },
      }));
       setFormError(null); // Clear error on change
   }, []);


  // --- Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    let dataToSend;
    try {
       dataToSend = prepareDataForApi(formData); // Validate and prepare data
    } catch (validationError: any) {
      setFormError(validationError.message);
      toast.warning(validationError.message); // Also show toast for validation error
      return;
    }

    setIsSubmitting(true);
    // console.log("Submitting creation with prepared data:", dataToSend);

    try {
        const result = await createTemplate(dataToSend, userRole); // Call server function

        if (result) { // API returns the created template object or null
            onSuccess(); // Signal success (triggers refetch/close in parent)
        } else {
            // API returned null, likely due to permissions or server validation fail
            // Toast should be handled by the server function
            setFormError("Failed to create template. Check server logs or permissions."); // Show a message in the dialog
        }
    } catch (err: any) {
        // Catch unexpected client-side/network errors
        console.error("Create Template Dialog Error:", err);
        const message = err.message || "An unexpected network or client-side error occurred.";
        setFormError(message);
        toast.error(`Creation Error: ${message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
      <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
        <DialogTitle>Create New Template</DialogTitle>
        <DialogDescription>
            Fill in the details. Required fields are marked with <span className="text-red-500">*</span>.
        </DialogDescription>
      </DialogHeader>

      <ScrollArea className="flex-grow" type="scroll">
			<div className="max-h-[60vh]">

        <form onSubmit={handleSubmit} id="create-template-form">
          <TemplateFormFields
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onTranslationChange={handleTranslationChange}
            isSubmitting={isSubmitting}
          />
          {formError && (
            <div className="px-6 pb-4">
              <p role="alert" className="text-destructive text-sm text-center py-2 px-3 font-medium border border-destructive/50 bg-destructive/10 rounded">
                {formError}
              </p>
            </div>
          )}
        </form>
          </div>
      </ScrollArea>

      <DialogFooter className="px-6 pb-6 pt-4 border-t flex-shrink-0 bg-background">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}> Cancel </Button>
        </DialogClose>
        <Button type="submit" form="create-template-form" disabled={isSubmitting || !!formError} className="min-w-[120px]">
          {isSubmitting ? ( <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating... </> ) : ( "Create Template" )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}