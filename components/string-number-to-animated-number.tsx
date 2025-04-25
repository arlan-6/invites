"use client";
import React, { FC, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "./motion-primitives/animated-number";

interface AnimatedTimeProps {
    className?: string;
    timeString?: string; // Format: "10:00"
}

interface AnimatedDateProps {
    className?: string;
    dateString?: string; // Format: "2025-03-11"
}

const AnimatedValue: FC<{
    value: number;
    className?: string;
    springOptions?: { damping: number; stiffness: number };
}> = ({ value, className, springOptions }) => (
    <AnimatedNumber
        value={value}
        className={className}
        springOptions={springOptions || { damping: 10, stiffness: 100 }}
    />
);

export const AnimatedTime: FC<AnimatedTimeProps> = ({
    className,
    timeString = "",
}) => {
    const [time, setTime] = useState<number[]>([0, 0]);

    useEffect(() => {
        const [hours, minutes] = timeString.split(":").map(Number);
        // console.log(hours, minutes);
        
        setTime([hours || 0, minutes || 0]);
    }, [timeString]);

    if (!timeString) return null;

    return (
        <div className={cn("", className)}>
            <AnimatedValue value={time[0]} />
            :
            <AnimatedValue value={time[1]} />
        </div>
    );
};

export const AnimatedDate: FC<AnimatedDateProps> = ({
    className,
    dateString = "",
}) => {
    const [date, setDate] = useState<number[]>([0, 0, 0]);

    useEffect(() => {
        const [year, month, day] = dateString.split("-").map(Number);
        setDate([year || 0, month || 0, day || 0]);
    }, [dateString]);

    if (!dateString) return null;

    return (
        <div className={cn("", className)}>
            <AnimatedValue value={date[0]} />
            :
            <AnimatedValue value={date[1]} springOptions={{ damping: 100, stiffness: 100 }} />
            :
            <AnimatedValue value={date[2]} />
        </div>
    );
};
