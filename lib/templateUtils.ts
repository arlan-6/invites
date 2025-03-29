import { Template } from "@prisma/client";
import prisma from "./prisma";

/**
 * Get all templates from the database.
 * @returns {Promise<Template[]>} Array of all templates.
 */
export async function getAllTemplates() {
    return await prisma.template.findMany();
}

/**
 * Get a template by its ID from the database.
 * @param {string} id - The ID of the template to retrieve.
 * @returns {Promise<Template | null>} The template with the given ID, or null if not found.
 */
export async function getTemplateById(id: string) {
    return await prisma.template.findUnique({
        where: { id },
    });
}

// /**
//  * Add a new template to the database.
//  * @param {Omit<Template, "id" | "createdAt" | "updatedAt">} newTemplate - The template data to add.
//  * @returns {Promise<Template>} The newly created template.
//  */
// export async function addTemplate(newTemplate: Omit<Template, "id" | "createdAt" | "updatedAt">) {
//     return await prisma.template.create({
//         data: newTemplate,
//     });
// }

/**
 * Delete a template by its ID from the database.
 * @param {string} id - The ID of the template to delete.
 * @returns {Promise<boolean>} True if the template was deleted, false if not found.
 */
export async function deleteTemplateById(id: string) {
    const deletedTemplate = await prisma.template.delete({
        where: { id },
    });
    return !!deletedTemplate;
}