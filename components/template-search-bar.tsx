"use client";

import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import usesTemaplteFilterstore from "@/store/templateFilters";
import { Button } from "./ui/button";
import { Paintbrush } from "lucide-react";

interface TemplateSearchBarProps {
	className?: string;
}

export const TemplateSearchBar: FC<TemplateSearchBarProps> = ({
	className,
}) => {
	const { search, setSearch } = usesTemaplteFilterstore();
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	};
    const handleClear=()=>{
        setSearch('')
    }
	return (
		<div className={cn(" p-6", className)}>
			<label className="">Search templates </label>
			<div className="mt-4 w-full gap-4 flex justify-around">
				<Input value={search} onChange={handleChange} />
				<Button onClick={handleClear} disabled={!search} variant={!!search?'default':'destructive'} className="transition-colors">
					Cleat filter
					<Paintbrush size={16} strokeWidth={1.5} />
				</Button>
			</div>
		</div>
	);
};
