import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { TemplateType } from "@/data/templates";
import { useLanguage } from "./language-provider";
import { Calendar1, Clock, MapPin } from "lucide-react";
import { Lobster, Roboto } from "next/font/google";
import { motion } from "framer-motion";
import BreathingText from "@/fancy/components/text/breathing-text";

const lobster = Lobster({
  subsets: ["cyrillic", "latin"],
  weight: "400",
});
const roboto = Roboto({
  subsets: ["cyrillic", "latin"],
  weight: "variable",
  style: ["italic", "normal"],
});

interface InviteTemplateProps {
  className?: string;
  template: TemplateType;
  formData: {
    title?: string;
    date?: string;
    time?: string;
    location?: string;
    message?: string;
  };
}

export const InviteTemplate: FC<InviteTemplateProps> = ({
  template,
  formData,
}) => {
  const { t } = useLanguage() as {
    language: "kk" | "ru" | "en";
    t: any;
  };

  // Function to render corner images
  const renderCornerImages = () => {
    if (!template.imageCorner) return null;

    return (
      <>
        <img
          src={template.imageCorner}
          alt="Corner decoration"
          className="absolute top-3 left-3 w-12 h-12 -rotate-90"
        />
        <img
          src={template.imageCorner}
          alt="Corner decoration"
          className="absolute top-3 right-3 w-12 h-12"
        />
        <img
          src={template.imageCorner}
          alt="Corner decoration"
          className="absolute bottom-3 right-3 w-12 h-12 rotate-90"
        />
        <img
          src={template.imageCorner}
          alt="Corner decoration"
          className="absolute bottom-3 left-3 w-12 h-12 rotate-180"
        />
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className={cn(
        "relative bg-gradient-to-bl p-8 pb-12 rounded-lg w-96 text-white min-h-96 ",
        template.color
      )}
    >
      {/* Corner Images */}
      {renderCornerImages()}

      {/* Card Content */}
      <div className="relative z-10">
        {/* Title */}
        <div className="text-5xl font-semibold tracking-tight text-center mb-3">
          <BreathingText
            className={cn("", roboto.className)}
            label={
              formData.title || t("inviteEditor.event-title-placeholder")
            }
            fromFontVariationSettings="'wght' 100, 'slnt' 0"
            toFontVariationSettings="'wght' 900, 'slnt' -10"
          />
        </div>

        {/* Divider */}
        <div className="flex justify-center w-full m-1">
          <div className="w-3/4 h-1 bg-amber-50 rounded-full"></div>
        </div>

        {/* Date and Time */}
        <div className="flex justify-center gap-4 text-amber-50 text-sm mt-2">
          <div className="flex gap-2 items-center">
            <Calendar1 size={18} />
            {formData.date || t("inviteEditor.event-date-placeholder")}
          </div>
          <div className="flex gap-2 items-center">
            <Clock size={18} />
            {formData.time || t("inviteEditor.event-time-placeholder")}
          </div>
        </div>

        {/* Placeholder for Image */}
        <div className="w-full h-52 my-3 rounded-2xl"></div>

        {/* Location */}
        <div className="flex gap-2 items-center text-sm mt-2">
          <MapPin size={18} />
          {formData.location || t("inviteEditor.event-location-placeholder")}
        </div>

        {/* Message */}
        {formData.message && (
          <div
            className={cn(
              "border-l-4 border-accent mt-4 text-2xl text-center bg-accent/10 p-3 rounded-r-md",
              lobster.className
            )}
          >
            {formData.message || t("inviteEditor.event-message-placeholder")}
          </div>
        )}
      </div>
    </motion.div>
  );
};