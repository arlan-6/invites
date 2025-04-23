// src/components/admin/templates/template-types.ts
import type { Prisma, Template as PrismaTemplate } from "@prisma/client";

// Re-export Prisma Template type for use in components
export type Template = PrismaTemplate;

// Role type (matches server function)
export type Role = 'admin' | 'editor' | 'moderator' | 'user';

// Form state structure (uses strings for input)
export interface TemplateFormData {
  color: string;
  imageCorner: string; // URL or empty string
  cornerRotation: boolean; // State name in the form
  image: string; // URL or empty string
  occasions: string; // Comma-separated string
  tags: string;     // Comma-separated string (required)
  translations: {
    kk: { name: string; description: string; middleText: string; occasions: string };
    ru: { name: string; description: string; middleText: string; occasions: string };
    en: { name: string; description: string; middleText: string; occasions: string };
  };
}

// Default empty form state
export const defaultTemplateFormData: TemplateFormData = {
  color: "",
  imageCorner: "",
  cornerRotation: false,
  image: "",
  occasions: "",
  tags: "",
  translations: {
    kk: { name: "", description: "", middleText: "", occasions: "" },
    ru: { name: "", description: "", middleText: "", occasions: "" },
    en: { name: "", description: "", middleText: "", occasions: "" },
  },
};

// Type helper matching the structure expected by createTemplate/updateTemplate
// Needs to align with CreateTemplateData / UpdateTemplateData in your server file
export interface TemplateApiPayload {
  color: string;
  imageCorner?: string | null;
  cornerRitarion?: boolean | null; // <-- Matches your server function type 'CreateTemplateData'
  image?: string | null;
  occasions: string[];
  tags: string[];
  translations: Prisma.JsonValue; // Use Prisma.JsonValue
}

// --- Utility Functions ---

/**
 * Converts form data (strings for arrays) into the payload format
 * expected by the backend API functions (actual arrays, Prisma JSON).
 * Performs basic client-side validation.
 */
export const prepareDataForApi = (formData: TemplateFormData): TemplateApiPayload => {
    const tagsArray = formData.tags.split(',').map(s => s.trim()).filter(Boolean);
    const occasionsArray = formData.occasions.split(',').map(s => s.trim()).filter(Boolean);

    // Basic Client-Side Validation
    if (!formData.color || tagsArray.length === 0) {
        throw new Error("Validation failed: Color and Tags are required.");
    }

    const translations = {
        kk: {
            name: formData.translations.kk.name.trim(),
            description: formData.translations.kk.description.trim(),
            middleText: formData.translations.kk.middleText.trim() || undefined,
            occasions: formData.translations.kk.occasions.split(',').map(s => s.trim()).filter(Boolean),
        },
        ru: {
            name: formData.translations.ru.name.trim(),
            description: formData.translations.ru.description.trim(),
            middleText: formData.translations.ru.middleText.trim() || undefined,
            occasions: formData.translations.ru.occasions.split(',').map(s => s.trim()).filter(Boolean),
        },
        en: {
            name: formData.translations.en.name.trim(),
            description: formData.translations.en.description.trim(),
            middleText: formData.translations.en.middleText.trim() || undefined,
            occasions: formData.translations.en.occasions.split(',').map(s => s.trim()).filter(Boolean),
        }
    };

     // Validate required translation fields
    for (const lang of ['kk', 'ru', 'en'] as const) {
        if (!translations[lang].name || !translations[lang].description) {
            throw new Error(`Validation failed: Name and Description are required for ${lang.toUpperCase()} translations.`);
        }
    }

    return {
        color: formData.color.trim(),
        imageCorner: formData.imageCorner.trim() || null,
        // Map the form state `cornerRotation` to the DB/API field `cornerRitarion`
        cornerRitarion: formData.cornerRotation,
        image: formData.image.trim() || null,
        occasions: occasionsArray,
        tags: tagsArray,
        translations: translations as Prisma.JsonValue, // Cast the validated structure
    };
};

// Helper function to convert array back to comma-separated string for form inputs
// (used in EditDialog initialization)
export const arrayToString = (arr: string[] | undefined | null): string =>
    Array.isArray(arr) ? arr.join(", ") : "";