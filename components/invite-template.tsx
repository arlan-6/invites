import React, { FC, useMemo } from "react";
import { cn } from "@/lib/utils";
import { TemplateTranslationsType } from "@/data/templates";
import { useLanguage } from "./language-provider";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import {  Roboto } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import BreathingText from "@/fancy/components/text/breathing-text";
import InviteTimer from "./invite-timer";

const roboto = Roboto({
    subsets: ["cyrillic", "latin"],
    weight: ["300", "400", "500", "700", "900"], // Ensure all needed weights are included
    style: ["italic", "normal"],
});



interface InviteTemplateProps {
    className?: string;
    template: {
        id: string;
        color: string; // e.g., "from-purple-600 to-indigo-700"
        imageCorner: string | null;
        cornerRitarion: boolean | null; // Assuming rotation needed if true
        image: string | null; // Main image if needed (not used in current design)
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

// Constants for styling placeholders
const PLACEHOLDER_CLASS = "opacity-60 italic";

export const InviteTemplate: FC<InviteTemplateProps> = ({
    className,
    template,
    formData,
}) => {
    const { t, language } = useLanguage() as {
        language: "kk" | "ru" | "en";
        t: (key: string) => string;
    };

    // Reverted formData Handling (like the first version)
    const derivedFormData = useMemo(() => {
        return {
            title: formData?.title || t("inviteEditor.event-title-placeholder"),
            date: formData?.date || t("inviteEditor.event-date-placeholder"),
            time: formData?.time || t("inviteEditor.event-time-placeholder"),
            location: formData?.location || t("inviteEditor.event-location-placeholder"),
            message: formData?.message || "", // Defaults to empty string if not provided
        };
    }, [formData, t]);

    // Memoized Corner Images Rendering
    const renderCornerImages = useMemo(() => {
        if (!template.imageCorner) return null;
        // Simplified rotation logic example - adjust as needed
        const rotationClasses = {
            topLeft: template.cornerRitarion ? "" : "-rotate-90",
            topRight: "",
            bottomRight: template.cornerRitarion ? "" : "rotate-90",
            bottomLeft: template.cornerRitarion ? "" : "rotate-180",
        };

        return (
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <img src={template.imageCorner} alt="" className={cn("absolute top-4 left-4 w-16 h-16 opacity-90", rotationClasses.topLeft)} />
                <img src={template.imageCorner} alt="" className={cn("absolute top-4 right-4 w-16 h-16 opacity-90", rotationClasses.topRight)} />
                <img src={template.imageCorner} alt="" className={cn("absolute bottom-4 right-4 w-16 h-16 opacity-90", rotationClasses.bottomRight)} />
                <img src={template.imageCorner} alt="" className={cn("absolute bottom-4 left-4 w-16 h-16 opacity-90", rotationClasses.bottomLeft)} />
            </div>
        );
    }, [template.imageCorner, template.cornerRitarion]);

    // Error handling if template data is missing
    if (!template) {
         return (
            <div className="flex items-center justify-center h-96 text-center text-red-500 p-8 border border-red-300 rounded-lg bg-red-50">
                <h1>Template data is missing!</h1>
            </div>
        );
    }

    // Flags and derived content
    const hasTimer = template.tags?.includes("timer") && formData?.date && formData?.time;
    const hasMiddleText = template.tags?.includes("middleText");
    const middleTextContent = template.translations[language]?.middleText || "";

    // --- Animation Variants (Complete Definitions) ---
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
                // Optional: stagger children animations if needed directly here
                // staggerChildren: 0.1
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" },
        },
    };
    // --- End Animation Variants ---

    return (
        // Main container with animation
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={cn(
                "relative rounded-xl shadow-2xl", // Styling
                "min-w-[320px] max-w-sm w-96", // Vertical dimensions
                "min-h-[550px]", // Minimum height for vertical feel
                "text-white overflow-hidden", // Ensure clipping
                "p-8 pt-14", // Padding
                "bg-gradient-to-bl",
                template.color, // Background gradient class
                roboto.className, // Base font
                className // Allow external classes
            )}
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.2)" }} // Readability enhancement
        >
            {/* Corner Images - Behind content */}
            {renderCornerImages}

            {/* Content Wrapper - Stacks children vertically */}
            <div className="relative z-10 flex flex-col h-full">

                {/* Header Section */}
                <motion.div variants={itemVariants} className="text-center mb-6">
                    {/* Optional decorative text */}
                    <p className="text-sm uppercase tracking-wider opacity-70 mb-2 font-light">
                        {t('invitePreview.youAreInvited') || "You are Invited"}
                    </p>
                    {/* Main Title */}
                    <h1
                        className={cn(
                            "text-4xl font-bold leading-tight break-words",
                            !formData?.title && PLACEHOLDER_CLASS, // Apply placeholder style if title missing
                        )}
                    >
                        {derivedFormData.title}
                    </h1>
                </motion.div>

                {/* Divider */}
                <motion.div
                    variants={itemVariants}
                    className="w-1/2 h-px bg-white/40 mx-auto my-3"
                ></motion.div>

                {/* Optional Middle/Breathing Text */}
                {hasMiddleText && middleTextContent && (
                     <motion.div variants={itemVariants} className="my-8 text-center">
                         <BreathingText
                            className="text-4xl font-semibold italic"
                            label={middleTextContent}
                            fromFontVariationSettings="'wght' 200, 'slnt' -5"
                            toFontVariationSettings="'wght' 800, 'slnt' 0"
                            staggerDuration={0.6}
                         />
                    </motion.div>
                 )}

                {/* Event Details Section (Vertical Stack) */}
                <motion.div
                    variants={itemVariants}
                    className={cn(
                        "flex flex-col items-center text-base mt-4 mb-8 gap-y-4", // Vertical stack with gap
                        "bg-black/10 backdrop-blur-sm p-4 rounded-lg" // Visual grouping
                    )}
                >
                     {/* Date */}
                     <div className="flex items-center gap-2.5 w-full justify-center">
                        <CalendarDays size={20} className="text-white/80 flex-shrink-0" />
                        <span className={cn(!formData?.date && PLACEHOLDER_CLASS)}>
                            {derivedFormData.date}
                        </span>
                    </div>
                     {/* Time */}
                     <div className="flex items-center gap-2.5 w-full justify-center">
                        <Clock size={20} className="text-white/80 flex-shrink-0" />
                        <span className={cn(!formData?.time && PLACEHOLDER_CLASS)}>
                            {derivedFormData.time}
                        </span>
                    </div>
                     {/* Location */}
                    <div className="flex items-center gap-2.5 w-full justify-center text-center">
                        <MapPin size={20} className="text-white/80 flex-shrink-0" />
                        <span className={cn("font-light", !formData?.location && PLACEHOLDER_CLASS)}>
                            {derivedFormData.location}
                        </span>
                    </div>
                </motion.div>

                {/* Timer Section (Animated presence) */}
                 <AnimatePresence>
                     {template.tags?.includes("timer") && (
                         <motion.div
                            key="timer"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-8 w-full flex flex-col items-center text-center overflow-hidden"
                         >
                            {/* Conditional rendering based on actual formData */}
                            {formData?.date && formData?.time ? (
                                <>
                                    <p className="text-sm opacity-80 mb-2">{t('invitePreview.timerStarts') || "Event starts in:"}</p>
                                    <InviteTimer time={formData.time} targetDate={formData.date} />
                                </>
                            ) : (
                                <div className={cn("text-sm text-amber-100/80", PLACEHOLDER_CLASS)}>
                                    {t("invitePreview.timerPlaceholder") || "Select Date & Time for timer"}
                                </div>
                             )}
                        </motion.div>
                    )}
                 </AnimatePresence>

                {/* Message Section (Animated presence, pushed to bottom) */}
                <AnimatePresence>
                    {/* Render only if message has content */}
                    {derivedFormData.message && (
                        <motion.div
                            key="message"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ delay: 0.2, duration: 0.4 }} // Slight delay after other items appear
                             className={cn(
                                "mt-auto pt-6 border-t border-white/20", // Push to bottom, add separator
                                "text-lg font-light text-center italic", // Styling
                            )}
                        >
                             <p>"{derivedFormData.message}"</p>
                         </motion.div>
                     )}
                </AnimatePresence>

             </div> {/* End Content Wrapper */}
        </motion.div> // End Main Container
    );
};