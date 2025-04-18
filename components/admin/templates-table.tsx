// src/components/templates/TemplatesTable.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { Template } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { toast } from "sonner";

import {
	getAllTemplates,
	createTemplate,
	updateTemplate,
	deleteTemplate,
} from "@/lib/inviteTemplateEdit"; // Adjust path if needed

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox"; // For Checkbox's onCheckedChange type

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/components/motion-primitives/dialog"; // Using standard shadcn/ui dialog
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	MoreHorizontal,
	PlusCircle,
	Edit,
	Trash2,
	Palette,
	Eye,
} from "lucide-react";

type Role = "admin" | "editor" | "moderator" | "user";

const arrayToString = (arr: string[] | undefined): string =>
	(arr || []).join(", ");
const stringToArray = (str: string | undefined): string[] =>
	str
		? str
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean)
		: [];

interface TemplatesTableProps {
	userRole: Role;
}

export default function TemplatesTable({ userRole }: TemplatesTableProps) {
	const [allTemplates, setAllTemplates] = useState<Template[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isActionLoading, setIsActionLoading] = useState(false); // For table-level actions like delete

	const [pageSize, setPageSize] = useState<number>(10);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageInput, setPageInput] = useState<string>("1");
	const [error, setError] = useState<string | null>(null);

	const [isCreateModifyDialogOpen, setIsCreateModifyDialogOpen] =
		useState(false);
	const [selectedTemplateForEdit, setSelectedTemplateForEdit] =
		useState<Template | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedTemplateForDelete, setSelectedTemplateForDelete] =
		useState<Template | null>(null);

	const totalTemplates = useMemo(() => allTemplates.length, [allTemplates]);
	const totalPages = useMemo(
		() => Math.max(1, Math.ceil(totalTemplates / pageSize)),
		[totalTemplates, pageSize],
	);

	const currentTemplatesOnPage = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		return allTemplates.slice(startIndex, endIndex);
	}, [allTemplates, currentPage, pageSize]);

	useEffect(() => {
		setPageInput(String(currentPage));
	}, [currentPage]);

	const fetchTemplates = useCallback(
		async (showLoadingSpinner = true) => {
			if (showLoadingSpinner) setIsLoading(true);
			else setIsActionLoading(true); // Use action loading for non-initial refresh
			setError(null);
			try {
				const templates = await getAllTemplates(userRole);
				if (templates) {
					setAllTemplates(templates);
					const newTotalPages = Math.max(
						1,
						Math.ceil(templates.length / pageSize),
					);
					if (currentPage > newTotalPages && newTotalPages > 0) {
						setCurrentPage(newTotalPages);
					} else if (templates.length === 0) {
						setCurrentPage(1); // Reset to page 1 if no templates
					}
				} else {
					if (userRole !== "admin" && userRole !== "moderator") {
						setError(
							"Access Denied: You do not have permission to view templates.",
						);
					} else {
						setError("Failed to fetch templates from the server.");
					}
					setAllTemplates([]);
				}
			} catch (err: any) {
				setError(
					err.message || "An unknown error occurred fetching templates.",
				);
				setAllTemplates([]);
			} finally {
				setIsLoading(false);
				setIsActionLoading(false);
			}
		},
		[userRole, currentPage, pageSize],
	); // pageSize and currentPage for pagination adjustments

	useEffect(() => {
		fetchTemplates(true);
	}, [userRole, fetchTemplates]);

	const handleOpenCreateDialog = () => {
		if (userRole !== "admin" && userRole !== "editor") {
			toast.error("Access Denied: You cannot create templates.");
			return;
		}
		// console.log('click');

		setSelectedTemplateForEdit(null);
		setIsCreateModifyDialogOpen(true);
	};

	const handleOpenEditDialog = (template: Template) => {
		if (userRole !== "admin" && userRole !== "editor") {
			toast.error("Access Denied: You cannot edit templates.");
			return;
		}
		setSelectedTemplateForEdit(template);
		setIsCreateModifyDialogOpen(true);
	};

	const handleOpenDeleteDialog = (template: Template) => {
		if (userRole !== "admin") {
			toast.error("Access Denied: Only Admins can delete templates.");
			return;
		}
		setSelectedTemplateForDelete(template);
		setIsDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!selectedTemplateForDelete || userRole !== "admin") return;
		setIsActionLoading(true);
		try {
			const result = await deleteTemplate(
				selectedTemplateForDelete.id,
				userRole,
			);
			if (result) {
				toast.success(
					`Template "${selectedTemplateForDelete.id.substring(
						0,
						8,
					)}..." deleted.`,
				);
				fetchTemplates(false); // Re-fetch to ensure correct state and pagination
			} else {
				// Server action should've shown a toast
				// toast.error(`Failed to delete template.`); // Fallback
			}
		} catch (err: any) {
			toast.error("An unexpected error occurred during deletion.");
		} finally {
			setIsDeleteDialogOpen(false);
			setSelectedTemplateForDelete(null);
			// fetchTemplates(false) is called above on success or here on explicit close
			if (!(await deleteTemplate(selectedTemplateForDelete.id, userRole))) {
				setIsActionLoading(false); // Ensure loading state reset if it wasn't success
			}
		}
	};

	const goToPage = (pageNumber: number) => {
		/* ... as before ... */
	};
	const handlePageInputChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		/* ... */
	};
	const handlePageInputKeyDown = (
		event: React.KeyboardEvent<HTMLInputElement>,
	) => {
		/* ... */
	};
	const handlePageSizeChange = (value: string) => {
		/* ... */
	};

	if (isLoading && allTemplates.length === 0 && !error) {
		return (
			<div className="flex justify-center items-center h-40">
				<span>Loading templates...</span>
			</div>
		);
	}
	if (error && allTemplates.length === 0) {
		return (
			<div className="flex justify-center p-4 text-red-500">
				<span>Error: {error}</span>
			</div>
		);
	}
	const canView = userRole === "admin" || userRole === "moderator";
	if (!canView && !isLoading) {
		return (
			<div className="flex justify-center p-4 text-orange-600">
				<span>You do not have permission to view templates.</span>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{error && !isLoading && allTemplates.length > 0 && (
				<div className="p-2 text-center text-yellow-600 bg-yellow-100 border border-yellow-300 rounded">
					Warning: {error}
				</div>
			)}
			<div className="flex justify-between items-center">
				<h2 className="text-xl font-semibold">Manage Templates</h2>
				{(userRole === "admin" || userRole === "editor") && (
					<Dialog
						open={isCreateModifyDialogOpen}
						onOpenChange={(isOpen: boolean) => {
							setIsCreateModifyDialogOpen(isOpen);
							if (!isOpen) setSelectedTemplateForEdit(null); // Reset on close
						}}
					>
						<DialogTrigger>
							<Button
								onClick={handleOpenCreateDialog}
								disabled={isActionLoading}
							>
								<PlusCircle className="mr-2 h-4 w-4" /> Create Template
							</Button>
						</DialogTrigger>
						{/* The DialogContent is rendered by CreateModifyTemplateDialog itself */}
						<CreateModifyTemplateDialog
							key={selectedTemplateForEdit?.id || "create-new"} // Key ensures re-mount & state reset
							userRole={userRole}
							template={selectedTemplateForEdit}
							onSuccess={() => {
								setIsCreateModifyDialogOpen(false);
								setSelectedTemplateForEdit(null);
								fetchTemplates(false); // Refresh list
							}}
							onClose={() => {
								setIsCreateModifyDialogOpen(false);
								setSelectedTemplateForEdit(null);
							}}
						/>
					</Dialog>
				)}
			</div>

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader> {/* ... TableHeader rows as before ... */}</TableHeader>
					<TableBody>
						{isActionLoading &&
							currentTemplatesOnPage.length > 0 && ( // For table-level action feedback
								<TableRow>
									<TableCell
										colSpan={7}
										className="h-24 text-center text-muted-foreground"
									>
										Processing...
									</TableCell>
								</TableRow>
							)}
						{(!isLoading || isActionLoading) &&
							currentTemplatesOnPage.map((template) => (
								<TableRow
									key={template.id}
									className={
										isActionLoading ? "opacity-50 pointer-events-none" : ""
									}
								>
									{/* TableCells as before, ensure action menu uses table's isActionLoading */}
									<TableCell>
										<div className="flex items-center gap-2">
											<span
												className={`inline-block h-4 w-4 rounded-full ${template.color}`}
												title={template.color}
											></span>
										</div>
									</TableCell>
									<TableCell
										className="max-w-[150px] truncate"
										title={template.occasions.join(", ")}
									>
										{template.occasions.join(", ")}
									</TableCell>
									<TableCell
										className="max-w-[150px] truncate"
										title={template.tags.join(", ")}
									>
										{template.tags.join(", ")}
									</TableCell>
									<TableCell className="text-xs">
										{template.image ? (
											<Eye className="h-4 w-4 inline mr-1" />
										) : (
											"No "
										)}
										Main
										<br />
										{template.imageCorner ? (
											<Eye className="h-4 w-4 inline mr-1" />
										) : (
											"No "
										)}
										Corner {template.cornerRitarion ? "(Rotated)" : ""}
									</TableCell>
									<TableCell className="text-xs max-w-[100px] truncate">
										{template.translations &&
										typeof template.translations === "object"
											? Object.keys(template.translations).join(", ")
											: "N/A"}
									</TableCell>
									<TableCell>
										{new Date(template.createdAt).toLocaleDateString("en-CA")}
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild disabled={isActionLoading}>
												<Button variant="ghost" size="icon" className="h-8 w-8">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>
													ID: {template.id.substring(0, 8)}...
												</DropdownMenuLabel>
												<DropdownMenuSeparator />
												{(userRole === "admin" || userRole === "editor") && (
													<DropdownMenuItem
														onSelect={() => handleOpenEditDialog(template)}
														disabled={isActionLoading}
													>
														<Edit className="mr-2 h-4 w-4" /> Edit
													</DropdownMenuItem>
												)}
												{userRole === "admin" && (
													<AlertDialog
														open={
															isDeleteDialogOpen &&
															selectedTemplateForDelete?.id === template.id
														}
														onOpenChange={(open) => {
															if (!open) setSelectedTemplateForDelete(null);
															setIsDeleteDialogOpen(open);
														}}
													>
														<AlertDialogTrigger asChild>
															<DropdownMenuItem
																className="text-red-600 focus:text-red-700 focus:bg-red-100"
																onSelect={(e) => {
																	e.preventDefault();
																	handleOpenDeleteDialog(template);
																}}
																disabled={isActionLoading}
															>
																{" "}
																<Trash2 className="mr-2 h-4 w-4" /> Delete
															</DropdownMenuItem>
														</AlertDialogTrigger>
														<AlertDialogContent>
															{/* ... AlertDialog content for delete ... */}
															<AlertDialogHeader>
																<AlertDialogTitle>
																	Confirm Deletion
																</AlertDialogTitle>
																<AlertDialogDescription>
																	Are you sure you want to delete template "
																	{template.id.substring(0, 8)}..."? This cannot
																	be undone.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel
																	onClick={() =>
																		setSelectedTemplateForDelete(null)
																	}
																	disabled={isActionLoading}
																>
																	Cancel
																</AlertDialogCancel>
																<AlertDialogAction
																	onClick={handleDeleteConfirm}
																	className="bg-red-600 hover:bg-red-700"
																	disabled={isActionLoading}
																>
																	{isActionLoading
																		? "Deleting..."
																		: "Confirm Delete"}
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
												)}
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						{/* Empty states ... */}
					</TableBody>
				</Table>
			</div>
			{/* Pagination Controls ... as before ... */}
		</div>
	);
}

// --- Create/Modify Dialog Component (Self-contained loading) ---
interface CreateModifyTemplateDialogProps {
	userRole: Role;
	template: Template | null;
	onSuccess: () => void;
	onClose: () => void;
}

function CreateModifyTemplateDialog({
	userRole,
	template,
	onSuccess,
	onClose,
}: CreateModifyTemplateDialogProps) {
	// console.log('dialog');

	const isEditMode = template !== null;
	const [isSubmitting, setIsSubmitting] = useState(false); // Dialog's own loading state
	const [formData, setFormData] = useState({
		color: template?.color || "",
		imageCorner: template?.imageCorner || "",
		cornerRitarion: template?.cornerRitarion ?? false,
		image: template?.image || "",
		occasions: arrayToString(template?.occasions),
		tags: arrayToString(template?.tags),
		translations: template?.translations
			? JSON.stringify(template.translations, null, 2)
			: "{}",
	});
	const [formError, setFormError] = useState<string | null>(null);

	useEffect(() => {
		// Reset form when template prop changes (e.g., opening for create then edit)
		setFormData({
			color: template?.color || "",
			imageCorner: template?.imageCorner || "",
			cornerRitarion: template?.cornerRitarion ?? false,
			image: template?.image || "",
			occasions: arrayToString(template?.occasions),
			tags: arrayToString(template?.tags),
			translations: template?.translations
				? JSON.stringify(template.translations, null, 2)
				: "{}",
		});
		setFormError(null);
		setIsSubmitting(false); // Reset submitting state
	}, [template]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "translations" ? JSON.parse( JSON.stringify(value)) : value,
        }));
	};

	const handleCheckboxChange =
		(name: keyof typeof formData) => (checked: CheckedState) => {
			if (typeof checked === "boolean") {
				setFormData((prev) => ({ ...prev, [name]: checked }));
			}
		};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormError(null);
		setIsSubmitting(true);
		console.log("Form data before parsing:", { ...formData });

		let parsedTranslations: Prisma.JsonValue;
		try {
			parsedTranslations = formData.translations
				? JSON.parse(formData.translations)
				: {};
		} catch (jsonError: any) {
			setFormError(`Invalid JSON in Translations: ${jsonError.message}`);
			setIsSubmitting(false);
			return;
		}

		const occasionsArray = stringToArray(formData.occasions);
		const tagsArray = stringToArray(formData.tags);

		if (
			!formData.color ||
			occasionsArray.length === 0 ||
			tagsArray.length === 0
		) {
			setFormError("Color, Occasions, and Tags are required.");
			setIsSubmitting(false);
			return;
		}

		const dataToSend = {
			color: formData.color,
			imageCorner: formData.imageCorner || null,
			cornerRitarion: formData.cornerRitarion,
			image: formData.image || null,
			occasions: occasionsArray,
			tags: tagsArray,
			translations: parsedTranslations,
		};
		console.log("Data to send:", dataToSend);

		try {
			let result;
			if (isEditMode && template) {
				result = await updateTemplate(template.id, dataToSend, userRole);
				if (result)
					toast.success(`Template "${result.id.substring(0, 8)}..." updated.`);
			} else {
				result = await createTemplate(dataToSend, userRole);
				if (result)
					toast.success(`Template "${result.id.substring(0, 8)}..." created.`);
			}

			if (result) {
				onSuccess(); // This will close the dialog and refresh parent table
			} else {
				// Server action should show toast on error, but add a fallback.
				if (!document.querySelector('[data-sonner-toast][data-type="error"]')) {
					setFormError(
						"Operation failed. Please try again or check server logs.",
					);
				}
			}
		} catch (err: any) {
			console.error("Dialog handleSubmit error:", err);
			setFormError(err.message || "An unexpected error occurred.");
			if (!document.querySelector('[data-sonner-toast][data-type="error"]')) {
				toast.error(
					err.message || "An unexpected error occurred saving the template.",
				);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	// This component IS the DialogContent
	return (
		<DialogContent className="sm:max-w-[600px] z-9 block">
			<form onSubmit={handleSubmit}>
				<DialogHeader>
					<DialogTitle>
						{isEditMode ? "Edit Template" : "Create New Template"}
					</DialogTitle>
					{isEditMode && template && (
						<DialogDescription>ID: {template.id}</DialogDescription>
					)}
				</DialogHeader>
				<div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2 sm:pr-6 pl-1 sm:pl-2">
					{/* Fields as defined in previous answer, but using `isSubmitting` for disabled state */}
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="color" className="text-right">
							Color<span className="text-red-500">*</span>
						</Label>
						<Input
							id="color"
							name="color"
							value={formData.color}
							onChange={handleChange}
							className="col-span-3"
							required
							disabled={isSubmitting}
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="occasions" className="text-right">
							Occasions<span className="text-red-500">*</span>
						</Label>
						<Input
							id="occasions"
							name="occasions"
							value={formData.occasions}
							onChange={handleChange}
							className="col-span-3"
							placeholder="event, holiday"
							required
							disabled={isSubmitting}
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="tags" className="text-right">
							Tags<span className="text-red-500">*</span>
						</Label>
						<Input
							id="tags"
							name="tags"
							value={formData.tags}
							onChange={handleChange}
							className="col-span-3"
							placeholder="timer, middleText"
							required
							disabled={isSubmitting}
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="image" className="text-right">
							Main Image
						</Label>
						<Input
							id="image"
							name="image"
							value={formData.image}
							onChange={handleChange}
							className="col-span-3"
							placeholder="Optional URL"
							disabled={isSubmitting}
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="imageCorner" className="text-right">
							Corner Image
						</Label>
						<Input
							id="imageCorner"
							name="imageCorner"
							value={formData.imageCorner}
							onChange={handleChange}
							className="col-span-3"
							placeholder="Optional URL"
							disabled={isSubmitting}
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="cornerRitarion" className="text-right">
							Rotate Corner
						</Label>
						<Checkbox
							id="cornerRitarion"
							checked={formData.cornerRitarion}
							onCheckedChange={handleCheckboxChange("cornerRitarion")}
							disabled={isSubmitting}
						/>
					</div>
					<div className="grid grid-cols-4 items-start gap-4">
						<Label htmlFor="translations" className="text-right pt-2">
							Translations (JSON)<span className="text-red-500">*</span>
						</Label>
						<Textarea
							id="translations"
							name="translations"
							value={formData.translations}
							onChange={handleChange}
							className="col-span-3 font-mono min-h-[100px]"
							placeholder='{ "en": { "greeting": "Hello" } }'
							required
							disabled={isSubmitting}
						/>
					</div>

					{formError && (
						<p className="col-span-4 text-red-500 text-sm text-center py-2">
							{formError}
						</p>
					)}
				</div>
				<div className="mt-2 pt-4 border-t">
					<DialogClose>
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
					</DialogClose>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting
							? "Saving..."
							: isEditMode
							? "Save Changes"
							: "Create Template"}
					</Button>
				</div>
			</form>
		</DialogContent>
	);
}
