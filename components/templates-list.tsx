"use client";

import React, { FC, useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { TemplateCard } from "./template-card";
import usesTemaplteFilterstore from "@/store/templateFilters";
import { useLanguage } from "./language-provider";

import { TemplateTranslationsType } from "@/data/templates";

import { getAllTemplates as fetchAllTemplatesServer } from "@/lib/templateUtils";
import { Accordion } from "./accordion";
import Loader from "./ui/loader";

type Template = {
	id: string;
	color: string;
	imageCorner: string | null;
	cornerRitarion: boolean | null;
	image: string | null;
	occasions: string[];
	tags: string[];
	translations: TemplateTranslationsType;
	createdAt: Date;
	updatedAt: Date;
};

interface TemplatesListProps {
	className?: string;
}

export const TemplatesList: FC<TemplatesListProps> = ({ className }) => {
	const [templates, setTemplates] = useState<Template[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const { t } = useLanguage();
	useEffect(() => {
		const loadTemplates = async () => {
			setLoading(true);
			setError(null);
			// console.log("Fetching templates...");

			try {
				const fetchedData = await fetchAllTemplatesServer();

				if (fetchedData === null) {
					console.error(
						"Failed to fetch templates: Server action returned null.",
					);
					setError(
						"Could not load templates. Permissions issue or server error.",
					);
					setTemplates([]);
				} else if (Array.isArray(fetchedData)) {
					// console.log(`Fetched ${fetchedData.length} templates.`);

					setTemplates(fetchedData as unknown as Template[]);
				} else {
					console.error("Unexpected data format received:", fetchedData);
					setError("Received invalid data format from server.");
					setTemplates([]);
				}
			} catch (err: any) {
				console.error("Error fetching templates in useEffect:", err);
				setError(
					err.message ||
						"An unexpected error occurred while loading templates.",
				);
				setTemplates([]);
			} finally {
				setLoading(false);
			}
		};

		loadTemplates();
	}, []);

	const { language } = useLanguage();
	const { search } = usesTemaplteFilterstore();

	const filteredTemplates = useMemo(() => {
		const sourceTemplates = templates;

		const normalizedSearch = search.toLowerCase().trim();

		if (!normalizedSearch) {
			return sourceTemplates;
		}

		return sourceTemplates.filter((temp) => {
			const trans = temp.translations?.[language];
			if (!trans) {
				return false;
			}

			const nameMatch =
				trans.name?.toLowerCase().includes(normalizedSearch) ?? false;
			const descMatch =
				trans.description?.toLowerCase().includes(normalizedSearch) ?? false;
			const middleTextMatch =
				trans.middleText?.toLowerCase().includes(normalizedSearch) ?? false;

			const occasionMatch = (trans.occasions ?? []).some((occasion) =>
				occasion?.toLowerCase().includes(normalizedSearch),
			);

			return nameMatch || descMatch || middleTextMatch || occasionMatch;
		});
	}, [templates, search, language]);

	return (
		<Accordion title={t("templates.cardInivteTempltes")}>
			<div className={cn("flex gap-4 flex-wrap p-4 md:p-6", className)}>
				{loading && (
					<div
						className={cn(
							"w-full flex justify-center items-center flex-col h-40",
							className,
						)}
					>
						<Loader />
						<br />
						<p className="text-gray-500 animate-pulse">
							{" "}
							{t("templates.loadingTemplates")}
						</p>
					</div>
				)}
				{error && !loading && (
					<div
						className={cn(
							"w-full flex justify-center items-center h-40 p-4 text-center",
							className,
						)}
					>
						<p className="text-red-600 font-semibold">
							{t("templates.errorLoadingTemplates")}
						</p>
						<p className="text-red-500 text-sm mt-1">{error}</p>
					</div>
				)}
				{!error &&
					!loading &&
					(!filteredTemplates ||
						(filteredTemplates.length === 0 && (
							<div
								className={cn(
									"container p-4 px-4 rounded-lg bg-gradient-to-tl min-w-64 max-w-full flex-1 select-none transition-all ",
									className,
								)}
							>
								<p className="text-gray-500"><span className="text-lg m-1">
									Ooops!</span>
									{search
										? t("templates.noTemplatesFound", { search })
										: t("templates.noTemplatesAvailable")}
								</p>
							</div>
						)))}

				{filteredTemplates.map((template, i) => (
					<TemplateCard key={template.id} template={template} i={i} />
				))}
			</div>
		</Accordion>
	);
};
