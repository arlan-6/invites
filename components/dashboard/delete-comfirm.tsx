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
	deleteHandler: (id: string) => void;
	id: string;
}

export const DeleteConfirm: FC<deleteComfirmProps> = ({
	className,
	children,
	deleteHandler,
	id,
}) => {
	return (
		<div className={cn("", className)}>
            <AlertDialog>
                <AlertDialogTrigger>{children}</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this item? This action is
                            irreversible and all associated data will be permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel aria-label="Cancel deletion">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => deleteHandler(id)} 
                            aria-label="Confirm deletion"
                            className="bg-red-700 text-destructive-foreground hover:bg-red-700/90 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
		</div>
	);
};
