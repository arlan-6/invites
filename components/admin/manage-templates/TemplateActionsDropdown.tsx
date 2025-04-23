"use client";

import React from "react";
import type { Template, Role } from "./template-types";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";

import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TemplateActionsDropdownProps {
  template: Template;
  userRole: Role;
  isActionLoading: boolean;
  onEdit: (template: Template) => void;
  onDelete: (template: Template) => void;
  isDeleteDialogOpen: boolean;
  onDeleteConfirm: () => void;
  onDeleteOpenChange: (open: boolean) => void;
}

export default function TemplateActionsDropdown({
  template,
  userRole,
  isActionLoading,
  onEdit,
  onDelete,
  isDeleteDialogOpen,
  onDeleteConfirm,
  onDeleteOpenChange,
}: TemplateActionsDropdownProps) {

  const canEdit = userRole === "admin" || userRole === "editor";
  const canDelete = userRole === "admin";

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={onDeleteOpenChange}>
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isActionLoading}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
                 <DropdownMenuSeparator />
                {canEdit && (
                    <DropdownMenuItem onSelect={() => onEdit(template)} disabled={isActionLoading} >
                         <Edit className="mr-2 h-4 w-4" /> Edit
                     </DropdownMenuItem>
                 )}
                 {canDelete && (
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-700 focus:bg-red-100"
                            onSelect={(e) => { e.preventDefault(); onDelete(template); }}
                            disabled={isActionLoading}
                         >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                )}
                 {!canEdit && !canDelete && ( <DropdownMenuItem disabled>No actions available</DropdownMenuItem> )}
             </DropdownMenuContent>
         </DropdownMenu>

         <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                 <AlertDialogDescription> Are you sure you want to delete template ID "{template.id.substring(0, 8)}..."? This action cannot be undone. </AlertDialogDescription>
             </AlertDialogHeader>
            <AlertDialogFooter>
                 <AlertDialogCancel onClick={() => onDeleteOpenChange(false)} disabled={isActionLoading}> Cancel </AlertDialogCancel>
                 <AlertDialogAction onClick={onDeleteConfirm} className="bg-red-600 hover:bg-red-700" disabled={isActionLoading} >
                    {isActionLoading ? "Deleting..." : "Confirm Delete"}
                 </AlertDialogAction>
             </AlertDialogFooter>
        </AlertDialogContent>
     </AlertDialog>
  );
}