import React, { FC, useMemo } from "react";
import { cn } from "@/lib/utils";
import { TemplateTranslationsType } from "@/data/templates"; // Ensure TemplateType might also be needed depending on your data structure
import { useLanguage } from "./language-provider";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Roboto } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import BreathingText from "@/fancy/components/text/breathing-text";
import InviteTimer from "./invite-timer";

// Initialize the Roboto font
const roboto = Roboto({
    subsets: ["cyrillic", "latin"],
    weight: ["300", "400", "500", "700", "900"], // Include all weights used in the component
    style: ["italic", "normal"], // Include all styles used
});

// Define the props interface for the component
interface InviteTemplateProps {
    className?: string;
    template: {
        id: string;
        color: string; // Example: "from-teal-500 to-cyan-600"
        imageCorner: string | null;
        cornerRitarion: boolean | null; // Controls corner image rotation
        image: string | null; // Optional main background image (not used in this layout)
        occasions: string[];
        tags: string[];
        translations: TemplateTranslationsType;
        createdAt: Date;
        updatedAt: Date;
    };
    formData?: {
        title?: string;
        date?: string;
        time?: string;
        location?: string;
        message?: string;
    };
}

// Constants for styling placeholder text
const PLACEHOLDER_CLASS = "opacity-60 italic";

// Define the InviteTemplate functional component
export const InviteTemplate: FC<InviteTemplateProps> = ({
    className,
    template,
    formData,
}) => {
    // Get translation function and current language
    const { t, language } = useLanguage() as {
        language: "kk" | "ru" | "en";
        t: (key: string) => string;
    };

    // Memoize derived form data to prevent re-calculation on every render
    const derivedFormData = useMemo(() => {
        return {
            title: formData?.title || t("inviteEditor.event-title-placeholder"),
            date: formData?.date || t("inviteEditor.event-date-placeholder"),
            time: formData?.time || t("inviteEditor.event-time-placeholder"),
            location: formData?.location || t("inviteEditor.event-location-placeholder"),
            message: formData?.message || "", // Default to empty string if no message
        };
    }, [formData, t]); // Dependencies: formData and t function

    // Memoize the rendering logic for corner images for performance
    const renderCornerImages = useMemo(() => {
        // Don't render if no imageCorner URL is provided
        if (!template.imageCorner) return null;

        // Define rotation classes based on the cornerRitarion prop
        const rotationClasses = {
            topLeft: template.cornerRitarion ? "" : "-rotate-90",
            topRight: "",
            bottomRight: template.cornerRitarion ? "" : "rotate-90",
            bottomLeft: template.cornerRitarion ? "" : "rotate-180",
        };

        // Common classes for all corner images, including responsive adjustments
        const commonClasses = "absolute opacity-70 sm:opacity-90 w-12 h-12 sm:w-16 sm:h-16 transition-all duration-300 ease-out"; // Added transition

        // Return the JSX for the corner images container
        return (
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <img src={template.imageCorner} alt="" className={cn(commonClasses, "top-2 left-2 sm:top-4 sm:left-4", rotationClasses.topLeft)} />
                <img src={template.imageCorner} alt="" className={cn(commonClasses, "top-2 right-2 sm:top-4 sm:right-4", rotationClasses.topRight)} />
                <img src={template.imageCorner} alt="" className={cn(commonClasses, "bottom-2 right-2 sm:bottom-4 sm:right-4", rotationClasses.bottomRight)} />
                <img src={template.imageCorner} alt="" className={cn(commonClasses, "bottom-2 left-2 sm:bottom-4 sm:left-4", rotationClasses.bottomLeft)} />
            </div>
        );
    }, [template.imageCorner, template.cornerRitarion]); // Dependencies for memoization

    // Render error message if template data is missing
    if (!template) {
         return (
            <div className="flex items-center justify-center h-96 text-center text-red-500 p-8 border border-red-300 rounded-lg bg-red-50 w-full max-w-sm">
                <h1>Template data is missing!</h1>
            </div>
        );
    }

    // Determine if optional sections should be shown
    const hasTimer = template.tags?.includes("timer") && formData?.date && formData?.time; // Timer requires tag AND form data
    const hasMiddleText = template.tags?.includes("middleText");
    // Get the middle text content for the current language
    const middleTextContent = template.translations[language]?.middleText || "";

    // --- Animation Variants for Framer Motion (Complete Definitions) ---
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 }, // Initial state: slightly scaled down and transparent
        visible: { // Animated state: fully opaque and normal scale
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5, // Animation duration
                ease: "easeOut", // Easing function
                // Example of staggering children if needed:
                // when: "beforeChildren", // Animate container before children
                // staggerChildren: 0.1 // Delay between each child animation
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 }, // Initial state: shifted down and transparent
        visible: { // Animated state: normal position and opaque
            opacity: 1,
            y: 0,
            transition: {
                 duration: 0.4, // Animation duration for items
                 ease: "easeOut" // Easing function
            },
        },
    };
    // --- End Animation Variants ---

    // Render the main invitation card component
    return (
        <motion.div
            variants={containerVariants} // Apply container animation variants
            initial="hidden" // Start in the 'hidden' state
            animate="visible" // Animate to the 'visible' state
            className={cn(
                "relative rounded-xl shadow-2xl", // Base styling: rounded corners, shadow
                "w-full max-w-sm mx-auto", // Responsive width: full width on small screens, max width 'sm', centered
                "text-white overflow-hidden", // Text color, prevent content overflow
                "p-6 pt-10 sm:p-8 sm:pt-14", // Responsive padding (more padding on larger screens)
                "bg-gradient-to-bl", // Use gradient direction
                template.color, // Apply the specific gradient colors from template data
                roboto.className, // Apply the Roboto font class globally
                className // Allow passing additional classes via props
            )}
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.2)" }} // Subtle text shadow for better readability
        >
            {/* Render the corner images (behind content) */}
            {renderCornerImages}

            {/* Content Wrapper: Relative positioning, flex column layout, full height */}
            <div className="relative z-10 flex flex-col h-full min-h-full">

                {/* Header Section: Animated */}
                <motion.div variants={itemVariants} className="text-center mb-4 sm:mb-6"> {/* Responsive margin */}
                    {/* Optional decorative intro text */}
                    <p className="text-xs sm:text-sm uppercase tracking-wider opacity-70 mb-1 sm:mb-2 font-light">
                        {t('invitePreview.youAreInvited') || "You are Invited"} {/* Translatable text */}
                    </p>
                    {/* Main Event Title: Responsive size */}
                    <h1
                        className={cn(
                            "text-3xl sm:text-4xl font-bold leading-tight break-words",
                            !formData?.title && PLACEHOLDER_CLASS // Apply placeholder style if title is missing
                        )}
                    >
                        {derivedFormData.title}
                    </h1>
                </motion.div>

                {/* Divider Line: Animated */}
                <motion.div
                    variants={itemVariants}
                    className="w-1/2 h-px bg-white/40 mx-auto my-4 sm:my-6" // Responsive margin
                ></motion.div>

                {/* Optional Middle/Breathing Text Section: Animated */}
                {hasMiddleText && middleTextContent && (
                     <motion.div variants={itemVariants} className="my-6 sm:my-8 text-center"> {/* Responsive margin */}
                         <BreathingText
                            className="text-3xl sm:text-4xl font-semibold italic" // Responsive text size
                            label={middleTextContent}
                            fromFontVariationSettings="'wght' 200, 'slnt' -5" // Animation settings
                            toFontVariationSettings="'wght' 800, 'slnt' 0"
                            staggerDuration={0.6}
                         />
                    </motion.div>
                 )}

                {/* Event Details Section (Vertical Stack): Animated */}
                <motion.div
                    variants={itemVariants}
                    className={cn(
                        "flex flex-col items-center text-sm sm:text-base mt-4 mb-6 sm:mb-8 gap-y-3 sm:gap-y-4", // Flex column, responsive text/margin/gap
                        "bg-black/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg" // Visual grouping with responsive padding
                    )}
                >
                     {/* Event Date */}
                     <div className="flex items-center gap-2 sm:gap-2.5 w-full justify-center">
                        <CalendarDays size={18} className="text-white/80 flex-shrink-0" /> {/* Responsive icon */}
                        <span className={cn(!formData?.date && PLACEHOLDER_CLASS)}>
                            {derivedFormData.date}
                        </span>
                    </div>
                     {/* Event Time */}
                     <div className="flex items-center gap-2 sm:gap-2.5 w-full justify-center">
                        <Clock size={18} className="text-white/80 flex-shrink-0" /> {/* Responsive icon */}
                        <span className={cn(!formData?.time && PLACEHOLDER_CLASS)}>
                            {derivedFormData.time}
                        </span>
                    </div>
                     {/* Event Location */}
                    <div className="flex items-center gap-2 sm:gap-2.5 w-full justify-center text-center">
                        <MapPin size={18}  className="text-white/80 flex-shrink-0" /> {/* Responsive icon */}
                        <span className={cn("font-light", !formData?.location && PLACEHOLDER_CLASS)}>
                            {derivedFormData.location}
                        </span>
                    </div>
                </motion.div>

                {/* Timer Section: Animates in/out with AnimatePresence */}
                 <AnimatePresence>
                     {template.tags?.includes("timer") && ( // Only render if tag is present
                         <motion.div
                            key="timer" // Unique key for AnimatePresence
                            initial={{ opacity: 0, height: 0 }} // Start hidden and collapsed
                            animate={{ opacity: 1, height: 'auto' }} // Animate to visible and auto height
                            exit={{ opacity: 0, height: 0 }} // Animate out to hidden and collapsed
                            transition={{ duration: 0.3 }} // Animation duration
                            className="mb-6 sm:mb-8 w-full flex flex-col items-center text-center overflow-hidden" // Responsive margin
                         >
                            {/* Show timer only if date and time are provided */}
                            {formData?.date && formData?.time ? (
                                <>
                                    <p className="text-xs sm:text-sm opacity-80 mb-1 sm:mb-2">{t('invitePreview.timerStarts') || "Event starts in:"}</p>
                                    {/* Render the actual timer component */}
                                    <InviteTimer time={formData.time} targetDate={formData.date} />
                                </>
                            ) : (
                                // Show placeholder if date/time are missing
                                <div className={cn("text-xs sm:text-sm text-amber-100/80", PLACEHOLDER_CLASS)}>
                                    {t("invitePreview.timerPlaceholder") || "Select Date & Time for timer"}
                                </div>
                             )}
                        </motion.div>
                    )}
                 </AnimatePresence>

                {/* Message Section: Animates in/out, pushed to bottom */}
                <AnimatePresence>
                    {/* Render only if a message exists */}
                    {derivedFormData.message && (
                        <motion.div
                            key="message" // Unique key for AnimatePresence
                            initial={{ opacity: 0, y: 10 }} // Start hidden and slightly down
                            animate={{ opacity: 1, y: 0 }} // Animate to visible and normal position
                            exit={{ opacity: 0, y: 10 }} // Animate out to hidden and slightly down
                            transition={{ delay: 0.2, duration: 0.4 }} // Delay slightly after other items
                             className={cn(
                                "mt-auto pt-4 sm:pt-6 border-t border-white/20", // mt-auto pushes to bottom in flex col, responsive padding-top, top border separator
                                "text-base sm:text-lg font-light text-center italic", // Responsive text size and styling
                            )}
                        >
                             <p>"{derivedFormData.message}"</p> {/* Display message in quotes */}
                         </motion.div>
                     )}
                </AnimatePresence>

             </div> {/* End Content Wrapper */}
        </motion.div> // End Main Container motion.div
    );
};