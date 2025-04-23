"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
// Updated import path for types
import type {
	TemplateFormData,
	// DbTemplateTranslations,
} from "./template-types";
import type { CheckedState } from "@radix-ui/react-checkbox";

interface TemplateFormFieldsProps {
	formData: TemplateFormData;
	onFormDataChange: <K extends keyof TemplateFormData>(
		key: K,
		value: TemplateFormData[K],
	) => void;
	onTranslationChange: (
		lang: keyof TemplateFormData["translations"], // Use keyof FormData state type
		field: keyof TemplateFormData["translations"]["en"], // Use keyof FormData state type
		value: string,
	) => void;
	isSubmitting: boolean;
}

export function TemplateFormFields({
	formData,
	onFormDataChange,
	onTranslationChange,
	isSubmitting,
}: TemplateFormFieldsProps) {
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		onFormDataChange(name as keyof TemplateFormData, value);
	};

	const handleCheckboxChange = (checked: CheckedState) => {
		onFormDataChange(
			"cornerRotation", // Form state field name
			typeof checked === "boolean" ? checked : false,
		);
	};

	const getTranslationInputProps = (
		lang: keyof TemplateFormData["translations"],
		field: keyof TemplateFormData["translations"]["en"],
	) => ({
		id: `${lang}_${field}`,
		value: formData.translations[lang][field] ?? "",
		onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
			onTranslationChange(lang, field, e.target.value),
		disabled: isSubmitting,
		required: field === "name" || field === "description",
		"aria-required": field === "name" || field === "description",
	});

	return (
		<div className="space-y-6 px-6 py-4">
			{/* --- General Section --- */}
			<section>
				<h3 className="text-base font-semibold mb-4 text-muted-foreground">
					{" "}
					General{" "}
				</h3>
				<div className="space-y-4">
					{/* Color */}
					<div>
						<Label htmlFor="color" className="mb-1.5 block text-sm font-medium">
							{" "}
							Color<span className="text-red-500 ml-1">*</span>{" "}
						</Label>
						<Input
							id="color"
							name="color"
							value={formData.color}
							onChange={handleInputChange}
							required
							disabled={isSubmitting}
							aria-required="true"
							placeholder="#FF5733, primary, bg-blue-500, etc."
						/>
					</div>
					{/* Occasions (Top Level - Optional) */}
					<div>
						<Label
							htmlFor="occasions"
							className="mb-1.5 block text-sm font-medium"
						>
							{" "}
							Occasions{" "}
							<span className="text-muted-foreground text-xs">
								(Global - Optional)
							</span>{" "}
						</Label>
						<Input
							id="occasions"
							name="occasions"
							value={formData.occasions}
							onChange={handleInputChange}
							disabled={isSubmitting}
							placeholder="event, holiday (comma-separated)"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Global occasions, specific translations can override/add below.
						</p>
					</div>
					{/* Tags (Required) */}
					<div>
						<Label htmlFor="tags" className="mb-1.5 block text-sm font-medium">
							{" "}
							Tags<span className="text-red-500 ml-1">*</span>{" "}
						</Label>
						<Input
							id="tags"
							name="tags"
							value={formData.tags}
							onChange={handleInputChange}
							required
							disabled={isSubmitting}
							aria-required="true"
							placeholder="timer, middleText, flowers (comma-separated)"
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Keywords for filtering and functionality.
						</p>
					</div>
					{/* Image URLs */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label
								htmlFor="image"
								className="mb-1.5 block text-sm font-medium"
							>
								{" "}
								Main Image URL{" "}
							</Label>
							<Input
								id="image"
								name="image"
								value={formData.image}
								onChange={handleInputChange}
								disabled={isSubmitting}
								type="url"
								placeholder="https://..."
							/>
						</div>
						<div>
							<Label
								htmlFor="imageCorner"
								className="mb-1.5 block text-sm font-medium"
							>
								{" "}
								Corner Image URL{" "}
							</Label>
							<Input
								id="imageCorner"
								name="imageCorner"
								value={formData.imageCorner}
								onChange={handleInputChange}
								disabled={isSubmitting}
								type="url"
								placeholder="https://..."
							/>
						</div>
					</div>
					{/* Corner Rotation Checkbox */}
					<div className="flex items-center space-x-2 pt-2">
						<Checkbox
							id="cornerRotation"
							checked={formData.cornerRotation}
							onCheckedChange={handleCheckboxChange}
							disabled={isSubmitting}
							aria-labelledby="cornerRotation-label"
						/>
						<Label
							htmlFor="cornerRotation"
							id="cornerRotation-label"
							className="text-sm font-medium cursor-pointer select-none"
						>
							{" "}
							Rotate Corner Image (if present){" "}
						</Label>
					</div>
				</div>
			</section>

			{/* --- Translations Section --- */}
			<section>
				<h3 className="text-base font-semibold mb-4 text-muted-foreground border-t pt-6">
					{" "}
					Translations{" "}
				</h3>
				<div className="space-y-8">
					{(["kk", "ru", "en"] as const).map((lang) => (
						<div
							key={lang}
							className="space-y-4 p-4 border rounded-md shadow-sm bg-card"
						>
							<h4 className="font-medium text-sm capitalize text-foreground">
								{lang === "kk"
									? "Kazakh"
									: lang === "ru"
									? "Russian"
									: "English"}{" "}
								<span className="text-xs uppercase text-muted-foreground">
									({lang})
								</span>
							</h4>
							{/* Name */}
							<div>
								<Label
									htmlFor={`${lang}_name`}
									className="mb-1.5 block text-xs font-medium"
								>
									{" "}
									Name<span className="text-red-500 ml-1">*</span>{" "}
								</Label>
								<Input {...getTranslationInputProps(lang, "name")} />
							</div>
							{/* Description */}
							<div>
								<Label
									htmlFor={`${lang}_description`}
									className="mb-1.5 block text-xs font-medium"
								>
									{" "}
									Description<span className="text-red-500 ml-1">*</span>{" "}
								</Label>
								<Textarea
									className="min-h-[60px]"
									{...getTranslationInputProps(lang, "description")}
								/>
							</div>
							{/* Middle Text */}
							<div>
								<Label
									htmlFor={`${lang}_middleText`}
									className="mb-1.5 block text-xs font-medium"
								>
									{" "}
									Middle Text (Optional){" "}
								</Label>
								<Input
									placeholder="Optional content..."
									{...getTranslationInputProps(lang, "middleText")}
								/>
							</div>
							{/* Occasions (Translated) */}
							<div>
								<Label
									htmlFor={`${lang}_occasions`}
									className="mb-1.5 block text-xs font-medium"
								>
									{" "}
									Occasions{" "}
									<span className="text-muted-foreground text-xs">
										(Specific to {lang.toUpperCase()})
									</span>{" "}
								</Label>
								<Input
									placeholder={`${lang}_event, ${lang}_holiday (comma-separated)`}
									{...getTranslationInputProps(lang, "occasions")}
								/>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
