"use client";

import React, { FC, useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { TemplateCard } from "./template-card"; // Assuming this component is correctly defined
import usesTemaplteFilterstore from "@/store/templateFilters"; // Assuming Zustand store is setup
import { useLanguage } from "./language-provider"; // Assuming Language context provider is setup
// Assuming this type accurately describes the structure within the template.translations JSON field
import { TemplateTranslationsType } from "@/data/templates"; // Verify this type matches your actual DB structure
// Assuming this is the correct path to your SERVER ACTION
import { getAllTemplates as fetchAllTemplatesServer } from "@/lib/templateUtils"; // Renamed import

// Define the structure we expect for a Template within this component
// Align this with the actual data structure returned by getAllTemplates
type Template = {
    id: string;
    color: string;
    imageCorner: string | null;
    cornerRitarion: boolean | null; // Matches DB schema?
    image: string | null;
    occasions: string[]; // Global occasions list
    tags: string[];
    translations: TemplateTranslationsType; // Use the specific translations type
    createdAt: Date;
    updatedAt: Date;
};


interface TemplatesListProps {
    className?: string;
    // removed templates prop - we will fetch internally
}

export const TemplatesList: FC<TemplatesListProps> = ({ className }) => {
    // --- State Management ---
    // Initialize state with appropriate defaults
    const [templates, setTemplates] = useState<Template[]>([]); // Start with empty array
    const [loading, setLoading] = useState<boolean>(true);     // Start loading on mount
    const [error, setError] = useState<string | null>(null);    // Use null for no error

    // --- Data Fetching ---
    useEffect(() => {
        const loadTemplates = async () => {
            setLoading(true); // Indicate loading started
            setError(null);   // Clear any previous error
            console.log("Fetching templates..."); // Debug log

            try {
                // Call the imported server action
                // Note: If getAllTemplates requires role/args, pass them here.
                const fetchedData = await fetchAllTemplatesServer();

                if (fetchedData === null) {
                    // Handle specific API responses like null (e.g., permissions, specific server error)
                    console.error("Failed to fetch templates: Server action returned null.");
                    setError("Could not load templates. Permissions issue or server error.");
                    setTemplates([]); // Ensure state is empty
                } else if (Array.isArray(fetchedData)) {
                     console.log(`Fetched ${fetchedData.length} templates.`); // Debug log
                     // Basic type check and setting state.
                     // A more robust check or mapping might be needed if types differ.
                    setTemplates(fetchedData as unknown as Template[]);
                } else {
                     // Handle unexpected return type
                    console.error("Unexpected data format received:", fetchedData);
                     setError("Received invalid data format from server.");
                     setTemplates([]);
                }

            } catch (err: any) {
                // Handle unexpected errors during the fetch call itself
                console.error("Error fetching templates in useEffect:", err);
                setError(err.message || "An unexpected error occurred while loading templates.");
                setTemplates([]); // Clear data on critical error
            } finally {
                setLoading(false); // Ensure loading is set to false in all cases
            }
        };

        loadTemplates(); // Execute the async function

    }, []); // Empty dependency array [] means run ONCE on mount

    // --- Filtering Logic ---
    const { language } = useLanguage();
    const { search } = usesTemaplteFilterstore();

    const filteredTemplates = useMemo(() => {
        // Start with the current list of templates
        const sourceTemplates = templates;

        // Normalize search term once for efficiency
        const normalizedSearch = search.toLowerCase().trim();

        // If no search term, return all templates
        if (!normalizedSearch) {
            return sourceTemplates;
        }

        // Filter based on the normalized search term
        return sourceTemplates.filter((temp) => {
            // Check if translations for the current language exist
            const trans = temp.translations?.[language];
            if (!trans) {
                return false; // Don't include if language translation is missing
            }

            // Check various fields using optional chaining and nullish coalescing
            const nameMatch = trans.name?.toLowerCase().includes(normalizedSearch) ?? false;
            const descMatch = trans.description?.toLowerCase().includes(normalizedSearch) ?? false;
            const middleTextMatch = trans.middleText?.toLowerCase().includes(normalizedSearch) ?? false;

            // Check occasions safely: default to empty array if missing
            const occasionMatch = (trans.occasions ?? [])
                .some(occasion => occasion?.toLowerCase().includes(normalizedSearch)); // Check each occasion

            // Return true if any field matches
            return nameMatch || descMatch || middleTextMatch || occasionMatch;
        });
    }, [templates, search, language]); // Recalculate only when these change


    // --- Render Logic ---

    // 1. Loading State
    if (loading) {
        return (
            <div className={cn("w-full flex justify-center items-center h-40", className)}>
                <p className="text-gray-500 animate-pulse">Loading templates...</p>
                {/* Consider adding a Spinner component here */}
            </div>
        );
    }

    // 2. Error State
    if (error) {
        return (
            <div className={cn("w-full flex justify-center items-center h-40 p-4 text-center", className)}>
                <p className="text-red-600 font-semibold">Error loading templates:</p>
                <p className="text-red-500 text-sm mt-1">{error}</p>
                {/* Optional: Add a Retry Button */}
                {/* <button onClick={fetchTemplates}>Retry</button> */}
            </div>
        );
    }

    // 3. No Templates State (handles both empty initial data and filtered results)
    if (!filteredTemplates || filteredTemplates.length === 0) {
        return (
            <div className={cn("w-full flex justify-center items-center h-40", className)}>
                 <p className="text-gray-500">
                    {search // If a search is active, give specific feedback
                        ? `No templates found matching "${search}".`
                        : "No templates available." // Otherwise, generic message
                    }
                </p>
            </div>
        );
    }

    // 4. Success State: Render the list
    return (
        <div className={cn("flex gap-4 flex-wrap p-4 md:p-6", className)}> {/* Adjusted gap/padding */}
            {filteredTemplates.map((template, i) => (
                // Assuming TemplateCard takes 'template' of type 'Template' and 'i'
                <TemplateCard key={template.id} template={template} i={i} />
            ))}
        </div>
    );
};