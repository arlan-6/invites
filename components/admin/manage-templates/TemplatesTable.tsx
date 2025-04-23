"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
// Import necessary icons for buttons and display
import { Eye, PlusCircle, AlertCircle, Edit, Trash2 } from "lucide-react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
// Import AlertDialog components for delete confirmation
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

// *** IMPORT YOUR ACTUAL API FUNCTIONS ***
// Ensure these paths are correct for your project structure
import { getAllTemplates, deleteTemplate } from "@/lib/inviteTemplateEdit";
// Import types and components from current directory
import type { Role, Template } from "./template-types";
import TemplatesPagination from "./TemplatesPagination";
// ** TemplateActionsDropdown import removed **
import CreateTemplateDialog from "./CreateTemplateDialog";
import EditTemplateDialog from "./EditTemplateDialog";
import { cn } from "@/lib/utils";

interface TemplatesTableProps {
	userRole: Role;
}

export default function TemplatesTable({ userRole }: TemplatesTableProps) {
	// --- State Variables ---
	const [allTemplates, setAllTemplates] = useState<Template[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isActionLoading, setIsActionLoading] = useState(false); // Global flag for Create/Update/Delete ops
	const [error, setError] = useState<string | null>(null);
	const [pageSize, setPageSize] = useState<number>(10);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Tracks if *any* delete confirmation is open
	const [selectedTemplateForEdit, setSelectedTemplateForEdit] =
		useState<Template | null>(null);
	const [selectedTemplateForDelete, setSelectedTemplateForDelete] =
		useState<Template | null>(null); // Which template is targeted

	// --- Data Fetching ---
	const fetchTemplates = useCallback(
		async (showLoadingSpinner = true) => {
			console.log("Fetching templates..."); // Debug log
			if (showLoadingSpinner) setIsLoading(true);
			else setIsActionLoading(true); // Show subtle loading for refetches
			setError(null);

			try {
				const fetchedTemplates = await getAllTemplates(userRole);

				if (fetchedTemplates === null) {
					// Handle permission denied or specific API errors returning null
					setError("Access Denied or failed to fetch templates.");
					setAllTemplates([]);
					setCurrentPage(1);
					// Assuming API function handles specific toasts (like permission denied)
				} else {
					setAllTemplates(fetchedTemplates);
					const newTotalPages = Math.max(
						1,
						Math.ceil(fetchedTemplates.length / pageSize),
					);

					// Adjust current page if it becomes invalid after data change
					if (currentPage > newTotalPages && newTotalPages > 0) {
						setCurrentPage(newTotalPages); // Go to last valid page
					} else if (fetchedTemplates.length === 0 || newTotalPages <= 0) {
						setCurrentPage(1); // Go to page 1 if no results
					}
					// Otherwise, currentPage remains valid
					console.log(
						`Fetch successful, ${fetchedTemplates.length} templates loaded.`,
					); // Debug log
				}
			} catch (err: any) {
				// Catch unexpected errors during the fetch call itself
				console.error("Error fetching templates in Table Component:", err);
				const message =
					err.message ||
					"An unexpected client-side error occurred during fetch.";
				setError(message);
				setAllTemplates([]); // Clear potentially stale data
				setCurrentPage(1); // Reset pagination
				toast.error(`Failed to load templates: ${message}`); // Notify user
			} finally {
				setIsLoading(false);
				setIsActionLoading(false); // Ensure loading state is reset
			}
		},
		[userRole, currentPage, pageSize],
	); // Include all state dependencies that influence the fetch

	// --- Initial Fetch ---
	useEffect(() => {
		fetchTemplates(true);
	}, [userRole]); // Refetch primarily if the user's role changes

	// --- Dialog Open/Close Handlers ---
	const handleOpenCreateDialog = () => {
		if (userRole !== "admin" && userRole !== "editor") {
			toast.error("Access Denied: Cannot create templates.");
			return;
		}
		// Ensure clean state for dialog opening
		setIsEditDialogOpen(false);
		setSelectedTemplateForEdit(null);
		setIsDeleteDialogOpen(false);
		setSelectedTemplateForDelete(null);
		setIsActionLoading(false); // Ensure buttons aren't blocked
		setIsCreateDialogOpen(true);
	};

	const handleOpenEditDialog = (template: Template) => {
		if (userRole !== "admin" && userRole !== "editor") {
			toast.error("Access Denied: Cannot edit templates.");
			return;
		}
		// Ensure clean state
		setIsCreateDialogOpen(false);
		setIsDeleteDialogOpen(false);
		setSelectedTemplateForDelete(null);
		setIsActionLoading(false);
		setSelectedTemplateForEdit(template); // Set the target for edit
		setIsEditDialogOpen(true);
	};

	// Sets state to trigger the confirmation dialog for a specific template
	const handleOpenDeleteDialog = (template: Template) => {
		if (userRole !== "admin") {
			toast.error("Access Denied: Only Admins can delete.");
			return;
		}
		// Ensure clean state
		setIsCreateDialogOpen(false);
		setIsEditDialogOpen(false);
		setSelectedTemplateForEdit(null);
		setIsActionLoading(false);
		setSelectedTemplateForDelete(template); // Set which template is being considered
		setIsDeleteDialogOpen(true); // Indicate *a* delete confirmation should be open
	};

	// Called by dialogs on successful save
	const handleSaveSuccess = () => {
		setIsCreateDialogOpen(false);
		setIsEditDialogOpen(false);
		setSelectedTemplateForEdit(null);
		// Success toast is likely handled by the API function; refetch handles loading state
		fetchTemplates(false); // Refetch data (sets isActionLoading: false)
	};

	// --- Dialog Close Handlers ---
	const handleCloseCreateDialog = () => {
		setIsCreateDialogOpen(false);
		// setIsActionLoading(false); // Optional: Reset loading just in case
	};

	// Close handler for Edit dialog (called on Cancel/X)
	const handleCloseEditDialog = () => {
		setIsEditDialogOpen(false);
		setSelectedTemplateForEdit(null); // Clear the selected template
		// ** Fix for button disabling: Ensure loading state is reset on cancel **
		setIsActionLoading(false);
	};

	// Handles closing the delete confirmation dialog (via Cancel/X/Outside click)
	const handleCloseDeleteDialog = (open: boolean) => {
		setIsDeleteDialogOpen(open); // Sync state with AlertDialog's request
		if (!open) {
			setSelectedTemplateForDelete(null); // Clear selection target
			// Ensure loading is reset if cancel was clicked during a delete action
			setIsActionLoading(false);
		}
	};

	// --- Delete Confirmation Handler ---
	const handleDeleteConfirm = async () => {
		if (!selectedTemplateForDelete || userRole !== "admin") return;

		// Set loading specifically for the delete action
		setIsActionLoading(true);
		const idToDelete = selectedTemplateForDelete.id;
		const displayName = idToDelete.substring(0, 8);

		try {
			const result = await deleteTemplate(idToDelete, userRole); // Call server action

			if (result) {
				// Check if delete was successful (API returns deleted object or null)
				// Success toast handled by server action assumed
				// ** Close dialog and clear state BEFORE refetching **
				handleCloseDeleteDialog(false); // This also clears selectedTemplateForDelete
				fetchTemplates(false); // Refetch data; this will reset isActionLoading
			} else {
				// Deletion failed (permission, not found, etc.) - Server toast handled assumed
				// Keep the confirmation dialog open? Or close it? Let's keep it open for now.
				// We must manually reset loading state if we don't refetch or close dialog
				setIsActionLoading(false);
				// Maybe add a formError-like state for the alert dialog if needed?
			}
		} catch (err: any) {
			// Handle unexpected client-side or network errors during the delete call
			console.error(
				`Error deleting template ${idToDelete} in Table Component:`,
				err,
			);
			toast.error(
				`Deletion Error: ${err.message || "Unexpected client error."}`,
			);
			// Keep dialog open? Reset loading state.
			setIsActionLoading(false);
		}
		// No `finally` needed if fetchTemplates/manual resets cover all paths
	};

	// --- Memoized Derived State ---
	const totalTemplates = useMemo(() => allTemplates.length, [allTemplates]);
	const totalPages = useMemo(
		() => Math.max(1, Math.ceil(totalTemplates / pageSize)),
		[totalTemplates, pageSize],
	);
	const currentTemplatesOnPage = useMemo(() => {
		const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages)); // Ensure page is valid
		const startIndex = (safeCurrentPage - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		return allTemplates.slice(startIndex, endIndex);
	}, [allTemplates, currentPage, pageSize, totalPages]);

	const canView = useMemo(
		() =>
			userRole === "admin" ||
			userRole === "editor" ||
			userRole === "moderator" ||
			userRole === "user",
		[userRole],
	);

	// --- Render Logic ---

	// Initial Loading State
	if (isLoading) {
		return (
			<div className="p-6 text-center text-muted-foreground">
				Loading templates...
			</div>
		);
	}

	// Error State (if initial load failed)
	if (error && allTemplates.length === 0) {
		return (
			<div className="p-6 text-center text-destructive space-y-2">
				<AlertCircle className="mx-auto h-8 w-8" />
				<p className="font-semibold">Error Loading Templates</p>
				<p className="text-sm">{error}</p>
				{/* Only show Retry if not a permission error */}
				{error !== "Access Denied or failed to fetch templates." && (
					<Button
						onClick={() => fetchTemplates(true)}
						variant="outline"
						size="sm"
					>
						{" "}
						Try Again{" "}
					</Button>
				)}
			</div>
		);
	}

	// Access Denied State (after loading check)
	if (!canView && !isLoading) {
		return (
			<div className="p-6 text-center text-orange-600">
				Access Denied: You do not have permission to view templates.
			</div>
		);
	}

	return (
		<div className="space-y-4 p-4 md:p-6">
			{/* Display Non-critical errors (e.g., during refetch) */}
			{error && allTemplates.length > 0 && (
				<div className="p-3 text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-md flex items-center gap-2">
					<AlertCircle className="h-4 w-4 flex-shrink-0" />
					<span>
						Warning during data refresh: {error}. Displaying last known data.
					</span>
				</div>
			)}

			{/* Header: Title + Create Button */}
			<div className="flex justify-between items-center mb-4">
				{" "}
				{/* Added margin-bottom */}
				<h2 className="text-xl md:text-2xl font-semibold tracking-tight">
					Manage Invite Templates
				</h2>
				{/* Create Button and Dialog */}
				{(userRole === "admin" || userRole === "editor") && (
					<Dialog
						open={isCreateDialogOpen}
						onOpenChange={(open) => {
							if (!open) handleCloseCreateDialog();
							else setIsCreateDialogOpen(true);
						}}
					>
						<DialogTrigger asChild>
							<Button
								onClick={handleOpenCreateDialog}
								disabled={isActionLoading}
							>
								<PlusCircle className="mr-2 h-4 w-4" /> Create Template
							</Button>
						</DialogTrigger>
						<CreateTemplateDialog
							userRole={userRole}
							isOpen={isCreateDialogOpen}
							onSuccess={handleSaveSuccess}
							onClose={handleCloseCreateDialog}
						/>
					</Dialog>
				)}
			</div>

			{/* Edit Dialog (controlled by state) */}
			<Dialog
				open={isEditDialogOpen}
				onOpenChange={(open) => {
					if (!open) handleCloseEditDialog();
					else setIsEditDialogOpen(true);
				}}
			>
				{/* Render content only when template is selected and dialog should be open */}
				{selectedTemplateForEdit && isEditDialogOpen && (
					<EditTemplateDialog
						key={selectedTemplateForEdit.id} // Ensure re-initialization if template changes
						userRole={userRole}
						template={selectedTemplateForEdit}
						onSuccess={handleSaveSuccess}
						onClose={handleCloseEditDialog} // Pass close handler
					/>
				)}
			</Dialog>

			{/* Table Section */}
			<div className="rounded-md border bg-card shadow-sm overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[80px]">Color</TableHead>
							<TableHead>Occasions</TableHead>
							<TableHead>Tags</TableHead>
							<TableHead className="w-[120px]">Images</TableHead>
							<TableHead>Translations</TableHead>
							<TableHead className="w-[120px]">Created</TableHead>
							{/* Actions Header */}
							<TableHead className="text-right min-w-[120px] pr-4">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{/* Empty State Message */}
						{!isLoading && currentTemplatesOnPage.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={7}
									className="h-32 text-center text-muted-foreground"
								>
									{totalTemplates === 0
										? "No templates found."
										: "No templates on this page."}
									{totalTemplates === 0 &&
										(userRole === "admin" || userRole === "editor") && (
											<Button
												variant="link"
												onClick={handleOpenCreateDialog}
												className="ml-1 p-0 h-auto"
											>
												Create one?
											</Button>
										)}
								</TableCell>
							</TableRow>
						)}

						{/* Template Rows */}
						{currentTemplatesOnPage.map((template) => {
							// Determine permissions for this row
							const canEdit = userRole === "admin" || userRole === "editor";
							const canDelete = userRole === "admin";

							// Determine if the delete confirmation for *this specific row* should be open
							const isThisTemplateDeleteDialogOpen =
								isDeleteDialogOpen &&
								selectedTemplateForDelete?.id === template.id;

							return (
								<TableRow
									key={template.id}
									className={
										isActionLoading ? "opacity-60 pointer-events-none" : ""
									}
								>
									{/* --- Data Cells --- */}
									{/* Color Cell */}
									<TableCell>
										<div className="flex items-center gap-2">
											<span
												className={cn("inline-block h-4 w-4 rounded-full border flex-shrink-0",template.color)}
												// style={{ backgroundColor: template.color || "#ccc" }}
												title={template.color ?? "No color"}
											/>
											<span className="text-xs truncate hidden sm:inline">
												{template.color}
											</span>
										</div>
									</TableCell>
									{/* Occasions Cell */}
									<TableCell
										className="max-w-[150px] truncate text-sm"
										title={template.occasions?.join(", ") ?? ""}
									>
										{template.occasions?.length ? (
											template.occasions.join(", ")
										) : (
											<span className="text-muted-foreground italic">None</span>
										)}
									</TableCell>
									{/* Tags Cell */}
									<TableCell
										className="max-w-[150px] truncate text-sm"
										title={template.tags?.join(", ") ?? ""}
									>
										{template.tags?.length ? (
											template.tags.join(", ")
										) : (
											<span className="text-destructive italic">Missing!</span>
										)}
									</TableCell>
									{/* Images Cell */}
									<TableCell className="text-xs">
										<div>
											{template.image ? (
												<Eye className="h-4 w-4 inline mr-1 text-blue-500" />
											) : (
												<span className="text-muted-foreground">No</span>
											)}{" "}
											Main
										</div>
										<div>
											{template.imageCorner ? (
												<Eye className="h-4 w-4 inline mr-1 text-blue-500" />
											) : (
												<span className="text-muted-foreground">No</span>
											)}{" "}
											Corner {template.cornerRitarion ? "(R)" : ""}
										</div>
									</TableCell>
									{/* Translations Cell */}
									<TableCell
										className="text-xs max-w-[100px] truncate"
										title={
											template.translations &&
											typeof template.translations === "object"
												? Object.keys(template.translations)
														.filter((k) => k !== "prisma__value")
														.join(", ")
														.toUpperCase()
												: "N/A"
										}
									>
										{template.translations &&
										typeof template.translations === "object" &&
										Object.keys(template.translations).length > 0 ? (
											Object.keys(template.translations)
												.filter((k) => k !== "prisma__value")
												.join(", ")
												.toUpperCase()
										) : (
											<span className="text-muted-foreground italic">N/A</span>
										)}
									</TableCell>
									{/* Created At Cell */}
									<TableCell className="text-sm whitespace-nowrap">
										{new Date(template.createdAt).toLocaleDateString("en-CA")}
									</TableCell>

									{/* --- ACTIONS CELL --- */}
									<TableCell className="text-right pr-4">
										<div className="flex justify-end items-center space-x-2">
											{/* Edit Button */}
											{canEdit && (
												<Button
													variant="ghost" // Use ghost for less emphasis maybe
													size="icon"
													className="h-8 w-8"
													onClick={() => handleOpenEditDialog(template)}
													disabled={isActionLoading}
													title="Edit Template"
												>
													<Edit className="h-4 w-4" />
													<span className="sr-only">Edit</span>
												</Button>
											)}

											{/* Delete Button & Confirmation */}
											{canDelete && (
												<AlertDialog
													open={isThisTemplateDeleteDialogOpen}
													onOpenChange={handleCloseDeleteDialog}
												>
													<AlertDialogTrigger asChild>
														<Button
															variant="ghost" // Use ghost
															size="icon"
															className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" // Destructive styling
															onClick={() => handleOpenDeleteDialog(template)} // Set target and open state
															disabled={isActionLoading}
															title="Delete Template"
														>
															<Trash2 className="h-4 w-4" />
															<span className="sr-only">Delete</span>
														</Button>
													</AlertDialogTrigger>
													{/* Confirmation Dialog Content */}
													{/* Render only if this row's delete dialog is open */}
													{isThisTemplateDeleteDialogOpen && (
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle>
																	Confirm Deletion
																</AlertDialogTitle>
																<AlertDialogDescription>
																	Are you sure you want to delete template ID "
																	{template.id.substring(0, 8)}..."? This action
																	cannot be undone.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel
																	onClick={() => handleCloseDeleteDialog(false)}
																	disabled={isActionLoading}
																>
																	{" "}
																	Cancel{" "}
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
													)}
												</AlertDialog>
											)}

											{/* Placeholder if no actions allowed */}
											{!canEdit && !canDelete && (
												<span className="text-xs text-muted-foreground italic pr-2">
													No Actions
												</span>
											)}
										</div>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Section */}
			{totalTemplates > 0 && (
				<TemplatesPagination
					currentPage={currentPage}
					totalPages={totalPages}
					pageSize={pageSize}
					totalItems={totalTemplates}
					onPageChange={(page) => {
						// Prevent going below 1 or above totalPages
						setCurrentPage(Math.max(1, Math.min(page, totalPages)));
					}}
					onPageSizeChange={(newPageSize) => {
						setPageSize(newPageSize);
						setCurrentPage(1); // Reset to page 1 on size change
					}}
				/>
			)}
		</div>
	);
}
