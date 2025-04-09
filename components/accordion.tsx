"use client";
import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { TemplatesList } from "./templates-list";
import { TemplateTranslationsType } from "@/data/templates";
import {
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { Button } from "./ui/button";

interface SimpleTemplatesProps {
    className?: string;
    children: React.ReactNode;
    title:string
}

export const Accordion: FC<SimpleTemplatesProps> = ({
    className,
    children,
    title
}) => {
    const [show, setshow] = React.useState(false);
    const handleshow = () => {
        setshow(!show);
    };
    return (
        <div className={cn("", className)}>
            <div className="w-full flex justify-between items-center"  onClick={handleshow}>
                <h1 className="text-2xl p-4 whitespace-nowrap">{title}</h1>
                <div className="w-full p-6 cursor-pointer" onClick={handleshow}>
                <div
                
                    className={cn(
                        "w-full h-1 rounded-2xl ",
                        show ? "bg-accent-foreground" : "bg-accent",
                    )}
                ></div></div>
                <Button variant={!show?"ghost":'outline'} onClick={handleshow} className="m-2">
                    {show ? (
                        <MdOutlineKeyboardArrowDown title="show" />
                    ) : (
                        <MdOutlineKeyboardArrowUp title="Hide templates" />
                    )}
                </Button>
            </div>
            <div className="mb-4">
                {!show && (
                    children
                )}
            </div>
        </div>
    );
};
