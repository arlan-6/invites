'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils'; // Assuming you have cn utility

interface InviteTimerProps {
    /** The target date and time string or Date object */
    // Combine the two props into one for simplicity, matching the previous InviteTemplate usage
    targetDate: string; // e.g., "2024-12-25"
    time: string;       // e.g., "10:30"
}

// Helper function to format numbers with leading zeros
const formatNumber = (num: number): string => String(num).padStart(2, '0');

const InviteTimer: React.FC<InviteTimerProps> = ({ targetDate, time }) => {

    // Use useMemo to parse the combined target date and time
    const targetTime = useMemo(() => {
        // Basic check for date and time format validity before creating Date object
        if (!targetDate || !time || !/^\d{4}-\d{2}-\d{2}$/.test(targetDate) || !/^\d{2}:\d{2}$/.test(time)) {
            console.error("Invalid date or time format provided to InviteTimer. Use YYYY-MM-DD for date and HH:MM for time.");
            return null; // Indicate invalid input
        }

        // Combine date and time string. Assume local timezone unless specified otherwise.
        // For better accuracy across timezones, consider passing a full ISO string or using a date library.
        const dateTimeString = `${targetDate}T${time}:00`;
        const date = new Date(dateTimeString);

        // Check if the resulting date is valid
        return isNaN(date.getTime()) ? null : date.getTime();
    }, [targetDate, time]);

    // State for time components and status
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isValidInput, setIsValidInput] = useState(true); // Combined validity check

    useEffect(() => {
        // Handle invalid combined date/time from useMemo
        if (targetTime === null) {
            setIsValidInput(false);
            // Reset timer values if input becomes invalid
            setDays(0); setHours(0); setMinutes(0); setSeconds(0); setIsTimeUp(false);
            return; // Stop effect
        }

        setIsValidInput(true); // Reset validity if it was previously invalid

        let timerId: NodeJS.Timeout | undefined;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = targetTime - now;

            if (difference <= 0) {
                setIsTimeUp(true);
                setDays(0); setHours(0); setMinutes(0); setSeconds(0);
                if (timerId) clearInterval(timerId);
                return;
            }

            // Ensure time isn't marked as up if difference becomes positive again
            if (isTimeUp) setIsTimeUp(false);

            // Calculate remaining time components
            const d = Math.floor(difference / (1000 * 60 * 60 * 24));
            const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((difference % (1000 * 60)) / 1000);

            // Update state
            setDays(d); setHours(h); setMinutes(m); setSeconds(s);
        };

        // Calculate immediately
        calculateTimeLeft();

        // Set up interval only if time is not up
        // Re-check difference here as state update might not be immediate
        const currentDifference = targetTime - new Date().getTime();
        if (currentDifference > 0) {
            timerId = setInterval(calculateTimeLeft, 1000);
        } else {
            // If time is already up on mount/change, ensure state reflects it
            setIsTimeUp(true);
            setDays(0); setHours(0); setMinutes(0); setSeconds(0);
        }

        // Cleanup function
        return () => {
            if (timerId) clearInterval(timerId);
        };

    // Rerun effect if targetTime calculation changes
    }, [targetTime]); // Removed isTimeUp dependency - calculation logic handles this

    // --- Render Logic ---

    if (!isValidInput) {
        // Keep this subtle for the invite context, maybe log error instead?
        // Or render nothing, assuming parent handles missing date/time display
         return <div className="text-red-200/80 italic text-sm text-center p-2">Invalid date/time.</div>;
    }

    if (isTimeUp) {
        // Style this to fit the invite - maybe celebratory text
        return <div className="text-white/90 font-semibold text-lg sm:text-xl text-center p-2 animate-pulse">The event has begun!</div>;
    }

    // --- Redesigned Timer Display ---
    return (
        // Container adapts to parent width. Uses white text suitable for gradient backgrounds.
        <div className="flex w-full items-center justify-center gap-2 sm:gap-3 font-sans text-white">
            {/* Time Unit Block Structure (Repeated) */}
            <div className="flex flex-col items-center text-center min-w-[40px] sm:min-w-[50px]">
                {/* Number */}
                <span className="text-3xl sm:text-4xl font-bold leading-none tabular-nums">
                    {/* Display days only if > 0 for cleaner look? Optional. */}
                    {/* {days > 0 ? days : formatNumber(hours)} */}
                     {days}
                </span>
                {/* Label */}
                <span className="text-xs sm:text-sm font-light uppercase tracking-wider text-white/70 mt-1">
                    {/* {days > 0 ? 'Days' : 'Hours'} */}
                    Days
                </span>
            </div>

            {/* Separator */}
            <span className="text-2xl sm:text-3xl font-light text-white/50 pb-4 sm:pb-5 select-none">:</span>

             {/* Hours Block */}
             <div className="flex flex-col items-center text-center min-w-[40px] sm:min-w-[50px]">
                <span className="text-3xl sm:text-4xl font-bold leading-none tabular-nums">
                    {formatNumber(hours)}
                </span>
                <span className="text-xs sm:text-sm font-light uppercase tracking-wider text-white/70 mt-1">
                    Hours
                </span>
            </div>

            {/* Separator */}
            <span className="text-2xl sm:text-3xl font-light text-white/50 pb-4 sm:pb-5 select-none">:</span>

            {/* Minutes Block */}
             <div className="flex flex-col items-center text-center min-w-[40px] sm:min-w-[50px]">
                 <span className="text-3xl sm:text-4xl font-bold leading-none tabular-nums">
                    {formatNumber(minutes)}
                 </span>
                 <span className="text-xs sm:text-sm font-light uppercase tracking-wider text-white/70 mt-1">
                    Mins
                 </span>
            </div>

             {/* Separator */}
             <span className="text-2xl sm:text-3xl font-light text-white/50 pb-4 sm:pb-5 select-none">:</span>

            {/* Seconds Block */}
             <div className="flex flex-col items-center text-center min-w-[40px] sm:min-w-[50px]">
                 <span className="text-3xl sm:text-4xl font-bold leading-none tabular-nums">
                    {formatNumber(seconds)}
                 </span>
                 <span className="text-xs sm:text-sm font-light uppercase tracking-wider text-white/70 mt-1">
                    Secs
                 </span>
            </div>
        </div>
    );
};

export default InviteTimer;