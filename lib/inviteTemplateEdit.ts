'use server'

import { Prisma } from "@prisma/client"; // Import Prisma type for JsonValue
import { toast } from "sonner"
import prisma from "./prisma"

// Define allowed roles for clarity
type Role = 'admin' | 'editor' | 'moderator' | 'user';

// --- Helper Function for Role Checks (Optional but good practice) ---
const hasPermission = (
    allowedRoles: Role[],
    userRole: Role,
    errorMessage: string = 'Access Denied: You do not have permission for this action.'
): boolean => {
    if (!allowedRoles.includes(userRole)) {
        toast.error(errorMessage);
        // Optionally throw an error, but returning false might be sufficient
        // throw new Error(errorMessage);
        return false;
    }
    return true;
};

// --- Get All Templates ---
// Allows Admin and Moderator access
export const getAllTemplates = async (role: Role) => {
    try {
        // Corrected Role Check: Only allow admin and moderator
        if (!hasPermission(['admin', 'moderator'], role)) {
            // Return empty array or null if permission denied,
            // depends on how you want to handle it frontend
            return null;
            // Or: throw new Error('Access Denied');
        }

        const templates = await prisma.template.findMany({
            orderBy: { // Optional: Add default sorting
                createdAt: 'desc'
            }
        });
        // console.log(`[getAllTemplates] Found ${templates.length} templates for role: ${role}`);
        return templates;
    } catch (error) {
        console.error("[getAllTemplates] Error:", error);
        toast.error('Error fetching templates.');
        return null; // Return null or empty array on error
    }
}

// --- Get Single Template by ID ---
// Allows Admin, Moderator, and Editor access
export const getTemplateById = async (id: string, role: Role) => {
    try {
        if (!hasPermission(['admin', 'moderator', 'editor'], role)) {
            return null;
        }
        if (!id) {
             toast.warning('Template ID is required.');
             return null;
        }

        const template = await prisma.template.findUnique({
            where: { id }
        });

        if (!template) {
            toast.warning(`Template with ID ${id} not found.`);
            return null;
        }
        // console.log(`[getTemplateById] Found template ${id} for role: ${role}`);
        return template;

    } catch (error) {
        console.error(`[getTemplateById] Error fetching template ${id}:`, error);
        toast.error('Error fetching template details.');
        return null;
    }
}


// --- Create New Template ---
// Define input type for clarity
type CreateTemplateData = {
    color: string;
    imageCorner?: string | null;
    cornerRitarion?: boolean | null; // Using schema name
    image?: string | null;
    occasions: string[];
    tags: string[];
    translations: Prisma.JsonValue; // Use Prisma.JsonValue for type safety
}
// Allows Admin and Editor access
export const createTemplate = async (data: CreateTemplateData, role: Role) => {
    try {
        if (!hasPermission(['admin', 'editor'], role)) {
            return null;
        }

        // Basic Validation (can be expanded)
        if (!data.color || !data.occasions?.length || !data.tags?.length || !data.translations) {
             toast.error('Missing required fields for template creation.');
             return null;
        }

        const newTemplate = await prisma.template.create({
            data: {
                color: data.color,
                imageCorner: data.imageCorner,
                cornerRitarion: data.cornerRitarion, // Using schema name
                image: data.image,
                occasions: data.occasions,
                tags: data.tags,
                translations: data.translations,
            }
        });
        // console.log(`[createTemplate] Template created with ID ${newTemplate.id} by role: ${role}`);
        // //toast.success('Template created successfully!');
        return newTemplate;

    } catch (error) {
        console.error("[createTemplate] Error:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle specific Prisma errors if needed
             toast.error(`Database error creating template: ${error.code}`);
        } else {
             toast.error('An unexpected error occurred while creating the template.');
        }
        return null;
    }
}

// --- Update Existing Template ---
// Define input type for update (Partial allows updating only some fields)
type UpdateTemplateData = Partial<Omit<CreateTemplateData, ''>>; // Omit fields that shouldn't be updated directly if any

// Allows Admin and Editor access
export const updateTemplate = async (id: string, data: UpdateTemplateData, role: Role) => {
     try {
        if (!hasPermission(['admin', 'editor'], role)) {
            return null;
        }
        if (!id) {
             toast.warning('Template ID is required for update.');
             return null;
        }
        // Ensure there's actually data to update
        if (Object.keys(data).length === 0) {
            toast.warning('No data provided for update.');
            return null; // Or return the existing template fetched first
        }

        const updatedTemplate = await prisma.template.update({
            where: { id },
            data: {
                ...data, // Spread the partial data
                translations: data.translations as Prisma.InputJsonValue, // Cast translations to InputJsonValue
                updatedAt: new Date() // Explicitly set updatedAt if needed (Prisma @updatedAt handles this automatically)
            }
        });
        // console.log(`[updateTemplate] Template ${id} updated by role: ${role}`);
        //toast.success('Template updated successfully!');
        return updatedTemplate;

    } catch (error) {
        console.error(`[updateTemplate] Error updating template ${id}:`, error);
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') { // Record to update not found
                 toast.error(`Template with ID ${id} not found for update.`);
            } else {
                 toast.error(`Database error updating template: ${error.code}`);
            }
        } else {
             toast.error('An unexpected error occurred while updating the template.');
        }
        return null;
    }
}


// --- Delete Template ---
// Allows Admin access ONLY
export const deleteTemplate = async (id: string, role: Role) => {
    try {
        // Stricter permission for delete
        if (!hasPermission(['admin'], role)) {
            return null;
        }
         if (!id) {
             toast.warning('Template ID is required for deletion.');
             return null;
        }

        // Optional: Check for related records (Invites) before deleting if needed
        // const relatedInvites = await prisma.invite.count({ where: { templateId: id } });
        // if (relatedInvites > 0) {
        //     toast.error(`Cannot delete template: It is currently used by ${relatedInvites} invite(s).`);
        //     return null;
        // }

        const deletedTemplate = await prisma.template.delete({
            where: { id }
        });
        // console.log(`[deleteTemplate] Template ${id} deleted by role: ${role}`);
        //toast.success('Template deleted successfully!');
        // Return the deleted object or a simple success indicator
        return deletedTemplate; // or return { success: true };

    } catch (error) {
        console.error(`[deleteTemplate] Error deleting template ${id}:`, error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') { // Record to delete not found
                 toast.error(`Template with ID ${id} not found for deletion.`);
            } else {
                 toast.error(`Database error deleting template: ${error.code}`);
            }
        } else {
             toast.error('An unexpected error occurred while deleting the template.');
        }
        return null; // or return { success: false };
    }
}