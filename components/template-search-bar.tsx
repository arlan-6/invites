"use client";

import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import usesTemaplteFilterstore from "@/store/templateFilters";
import { Button } from "./ui/button";
import { Paintbrush } from "lucide-react";
import { useLanguage } from "./language-provider";

interface TemplateSearchBarProps {
	className?: string;
}

export const TemplateSearchBar: FC<TemplateSearchBarProps> = ({
	className,
}) => {
	const {t} = useLanguage()
	const { search, setSearch } = usesTemaplteFilterstore();
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value.toLowerCase());
	};
    const handleClear=()=>{
        setSearch('')
    }
	return (
		<div className={cn(" p-6", className)}>
			<label className="">{t('templates.searchTemplates')}</label>
			<div className="mt-4 w-full gap-4 flex justify-around">
				<Input value={search} onChange={handleChange} />
				<Button onClick={handleClear} disabled={!search} variant={!!search?'default':'destructive'} className="transition-colors">
					{t('templates.clearFilters')}
					<Paintbrush size={16} strokeWidth={1.5} />
				</Button>
			</div>
		</div>
	);
};
