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

import React, { FC } from "react";
import { cn } from "@/lib/utils";

interface deleteComfirmProps {
	className?: string;
	children: React.ReactNode;
	onConfirm: (id: string) => void;
	id: string;
    title?:string;
    description?:string;
    cancelLabel?:string;
    confirmLabel?:string;
}

export const DeleteConfirm: FC<deleteComfirmProps> = ({
	className,
	children,
	onConfirm,
	id,
    title,
    description,
    cancelLabel,
    confirmLabel,
}) => {
	return (
		<div className={cn("", className)}>
            <AlertDialog>
                <AlertDialogTrigger>{children}</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title || 'Confirm Deletion'}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {description || 'Are you sure you want to delete this item? This action cannot be undone.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel aria-label="Cancel deletion">{cancelLabel || 'Cancel'}</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => onConfirm(id)} 
                            aria-label="Confirm deletion"
                            className="bg-red-700 text-destructive-foreground hover:bg-red-700/90 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:bg-destructive/90"
                        >
                            {confirmLabel || 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
		</div>
	);
};
