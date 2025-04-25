import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Fugaz_One } from "next/font/google";
import { Badge } from "./ui/badge";

const fugaz_one = Fugaz_One({
	weight: "400",
	subsets: ["latin"],
});
interface logoProps {
	className?: string;
}

export const Logo: FC<logoProps> = ({ className }) => {
	return (
		<div className={cn("", className, fugaz_one.className)}>
			Shaqr
			{/* Baramyz */}
			<Badge className=" bg-gradient-to-bl from-chart-5 to-chart-4 text-white tracking-wider absolute top-0 right-0 translate-x-1/2 -translate-y-1/2  px-2 py-0.5 rounded-full text-[10px] font-light shadow-sm">
				βeta
			</Badge>
		</div>
	);
};
