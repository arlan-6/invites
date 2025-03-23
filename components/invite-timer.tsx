'use client'
import React, { useEffect, useState } from 'react';

interface InviteTimerProps {
    targetDate: string; // ISO string format
    time: string;
}
const InviteTimer: React.FC<InviteTimerProps> = ({ targetDate,time }) => {
    
    
    
    const [timeLeft, setTimeLeft] = useState<string>('');
    const timeParts = time.split(":").map(Number);
        
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const difference = target - now;

            if (difference <= 0) {
                setTimeLeft('Time is up!');
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + (timeParts? timeParts[0]:0);
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)) + (timeParts? timeParts[1]:0);
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        };

        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate, timeParts]);

    return <div>{timeLeft}</div>;
};

export default InviteTimer;