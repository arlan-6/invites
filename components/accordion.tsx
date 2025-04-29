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
    title:string;
    titleClassName?: string;
    isClosed?: boolean;
}

export const Accordion: FC<SimpleTemplatesProps> = ({
    className,
    children,
    title,
    titleClassName,
    isClosed = false,
}) => {
    const [show, setshow] = React.useState(isClosed);
    const handleshow = () => {
        setshow(!show);
    };
    return (
        <div className={cn("", className)}>
            <div className="w-full flex justify-between items-center"  onClick={handleshow}>
                <h1 className={"text-lg lg:text-2xl p-4 whitespace-nowrap " + titleClassName}>{title}</h1>
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
