// // src/components/admin/templates/template-api.ts
// // Placeholder API functions - replace with your actual backend calls
// import type { Role, Template, TemplateApiData } from "./template-types";
// import { Prisma } from '@prisma/client'; // Import Prisma

// // Simulating network delay
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// // Mock Database (Replace with actual DB interaction)
// let mockTemplates: Template[] = [
//     // Add some initial mock data if needed for testing
//     {
//         id: 'clwkd8a7h0000swpi6u9u7a8p',
//         color: 'blue',
//         imageCorner: null,
//         cornerRitarion: false, // Ensure this matches your schema
//         image: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=MainBlue',
//         occasions: ['birthday', 'celebration'],
//         tags: ['timer', 'formal'],
//         translations: { // Ensure structure matches DbTemplateTranslations
//             "en": { name: "Blue Formal", description: "A formal blue template", occasions: ["birthday", "celebration"] },
//             "ru": { name: "Синий формальный", description: "Формальный синий шаблон", occasions: ["день рождения", "праздник"] },
//             "kk": { name: "Көк ресми", description: "Ресми көк үлгі", occasions: ["туған күн", "мереке"] }
//         } as unknown as Prisma.JsonValue, // Cast necessary for mock data
//         createdAt: new Date('2023-10-26T10:00:00.000Z'),
//         updatedAt: new Date('2023-10-26T10:00:00.000Z')
//     },
//      {
//         id: 'clwkd8qqc0001swpieky3g9c2',
//         color: '#FFC0CB', // Pink hex
//         imageCorner: 'https://via.placeholder.com/50/FFC0CB/000000?text=Corner',
//         cornerRitarion: true,
//         image: 'https://via.placeholder.com/150/FFC0CB/000000?text=MainPink',
//         occasions: ['wedding', 'anniversary'],
//         tags: ['flowers', 'middleText', 'elegant'],
//          translations: {
//             "en": { name: "Elegant Pink", description: "An elegant pink design", middleText:"With Love", occasions: ["wedding", "anniversary"] },
//             "ru": { name: "Элегантный Розовый", description: "Элегантный розовый дизайн", middleText:"С любовью", occasions: ["свадьба", "годовщина"] },
//             "kk": { name: "Керемет Қызғылт", description: "Керемет қызғылт дизайн", middleText:"Махаббатпен", occasions: ["үйлену тойы", "мерейтой"] }
//         } as unknown as Prisma.JsonValue,
//         createdAt: new Date('2023-11-15T14:30:00.000Z'),
//         updatedAt: new Date('2023-11-18T09:15:00.000Z')
//     },
// ];
// let nextId = mockTemplates.length + 1;


// export const getAllTemplatesApi = async (userRole: Role): Promise<Template[]> => {
//   console.log("API: getAllTemplates called by role:", userRole);
//   await delay(500); // Simulate network delay
//   // In real API, check role against permissions
//   if (userRole !== "admin" && userRole !== "moderator" && userRole !== "editor" && userRole !== "user") {
//      // Adjust roles allowed to VIEW here. Maybe 'user' can view?
//      console.warn("API: Access Denied for role:", userRole);
//     // Throw or return empty based on your API design
//     // throw new Error("Access Denied: You cannot view templates.");
//     return [];
//   }
//   // Return a copy to prevent direct modification of mock data
//   return JSON.parse(JSON.stringify(mockTemplates));
// };

// export const createTemplateApi = async (data: TemplateApiData, userRole: Role): Promise<Template> => {
//   console.log("API: createTemplate called by role:", userRole, "with data:", data);
//   await delay(700);
//   if (userRole !== "admin" && userRole !== "editor") {
//      throw new Error("Access Denied: You cannot create templates.");
//    }
//     if (!data.color || data.tags.length === 0) {
//       throw new Error("Validation Error: Color and Tags are required.");
//     }

//   const newTemplate: Template = {
//     ...data,
//     id: `new_template_${nextId++}`, // Simple unique ID for mock
//     // Map cornerRotation (form state) to cornerRitarion (DB field) IF they are different
//     // cornerRitarion: data.cornerRotation, // Use if DB field is cornerRitarion
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   };
//   mockTemplates.push(newTemplate);
//   console.log("API: Template created:", newTemplate.id);
//   return JSON.parse(JSON.stringify(newTemplate)); // Return a copy
// };

// export const updateTemplateApi = async (id: string, data: TemplateApiData, userRole: Role): Promise<Template> => {
//   console.log("API: updateTemplate called for id:", id, "by role:", userRole, "with data:", data);
//    await delay(700);
//   if (userRole !== "admin" && userRole !== "editor") {
//     throw new Error("Access Denied: You cannot edit templates.");
//   }
//   const index = mockTemplates.findIndex(t => t.id === id);
//   if (index === -1) {
//     throw new Error(`Template with ID ${id} not found.`);
//   }
//     if (!data.color || data.tags.length === 0) {
//       throw new Error("Validation Error: Color and Tags are required.");
//     }

//   const updatedTemplate: Template = {
//     ...mockTemplates[index], // Spread existing data
//     ...data,                // Override with new data
//      // Map cornerRotation (form state) to cornerRitarion (DB field) IF different
//     // cornerRitarion: data.cornerRotation, // Use if DB field is cornerRitarion
//     id, // Ensure ID is not changed
//     updatedAt: new Date(),
//   };
//   mockTemplates[index] = updatedTemplate;
//   console.log("API: Template updated:", updatedTemplate.id);
//   return JSON.parse(JSON.stringify(updatedTemplate)); // Return a copy
// };

// export const deleteTemplateApi = async (id: string, userRole: Role): Promise<{ success: boolean }> => {
//   console.log("API: deleteTemplate called for id:", id, "by role:", userRole);
//   await delay(600);
//   if (userRole !== "admin") {
//     throw new Error("Access Denied: Only Admins can delete templates.");
//   }
//   const initialLength = mockTemplates.length;
//   mockTemplates = mockTemplates.filter(t => t.id !== id);
//   if (mockTemplates.length === initialLength) {
//       throw new Error(`Template with ID ${id} not found.`);
//      // Alternatively return { success: false } if your API doesn't throw
//      // return { success: false };
//   }
//   console.log("API: Template deleted:", id);
//   return { success: true };
// };

// // Helper to convert FormData (strings) to API Data (arrays, nulls, correct JSON)
// export const prepareDataForApi = (formData: import("./template-types").TemplateFormData): TemplateApiData => {
//   const tagsArray = formData.tags.split(',').map(s => s.trim()).filter(Boolean);

//   if (!formData.color || tagsArray.length === 0) {
//     throw new Error("Client Validation: Color and Tags are required.");
//   }

//   const translations: import("./template-types").DbTemplateTranslations = {
//     kk: {
//       name: formData.translations.kk.name.trim(),
//       description: formData.translations.kk.description.trim(),
//       middleText: formData.translations.kk.middleText.trim() || undefined,
//       occasions: formData.translations.kk.occasions.split(',').map(s => s.trim()).filter(Boolean),
//     },
//     ru: {
//         name: formData.translations.ru.name.trim(),
//         description: formData.translations.ru.description.trim(),
//         middleText: formData.translations.ru.middleText.trim() || undefined,
//         occasions: formData.translations.ru.occasions.split(',').map(s => s.trim()).filter(Boolean),
//     },
//     en: {
//         name: formData.translations.en.name.trim(),
//         description: formData.translations.en.description.trim(),
//         middleText: formData.translations.en.middleText.trim() || undefined,
//         occasions: formData.translations.en.occasions.split(',').map(s => s.trim()).filter(Boolean),
//     }
//   };

//    // Validate required fields within translations
//    for (const lang of ['kk', 'ru', 'en'] as const) {
//        if (!translations[lang].name || !translations[lang].description) {
//            throw new Error(`Client Validation: Name and Description are required for ${lang.toUpperCase()} translations.`);
//        }
//    }


//   return {
//     color: formData.color.trim(),
//     imageCorner: formData.imageCorner.trim() || null,
//     // Ensure this mapping matches your schema field name and form state name
//     cornerRitarion: formData.cornerRotation, // Map state 'cornerRotation' to DB 'cornerRitarion'
//     image: formData.image.trim() || null,
//     occasions: formData.occasions.split(',').map(s => s.trim()).filter(Boolean),
//     tags: tagsArray,
//     translations: translations as Prisma.JsonValue, // Cast to Prisma.JsonValue for the API
//   };
// };