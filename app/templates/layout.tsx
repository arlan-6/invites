import React, { FC } from 'react';
import { cn } from '@/lib/utils';
import type { Metadata } from "next";

export const metadata: Metadata = {
	title:(process.env.NODE_ENV === "development" ? " (dev) " : "") + "Templates | beta"  ,
	description: "Invites",
};

interface layoutProps {
    children: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children  }) => {
  return (
    <div className={cn('')}>
     {children}
    </div>
  )
}

export default layout