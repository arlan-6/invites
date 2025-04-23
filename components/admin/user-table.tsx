"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	// DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
    DialogClose, // Import DialogClose
} from "@/components/motion-primitives/dialog";
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
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label";
// Assuming your authClient setup can handle types from @supabase/supabase-js/dist/module/lib/types
// If not, you might need to define a simpler User type or adjust
// Use the AdminUser type if available from your authClient definition or Supabase types
// type AdminUser = NonNullable<Awaited<ReturnType<typeof authClient.admin.listUsers>>['data']>['users'][number];
// Using Prisma type for now, assuming it aligns closely enough. Adjust if needed.
import { User as PrismaUser, User } from "@prisma/client";
import { authClient } from "@/auth-client";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	MoreHorizontal, // Icon for action menu
	UserCheck,
	UserX, // Ban icon
    Trash2 // Optional: for Delete User if needed later
} from "lucide-react";


// More specific type reflecting Supabase Admin API User structure (adjust as needed)
// Based on common fields, verify against actual API response or Supabase types
interface AdminUser {
    id: string;
    email?: string;
    role?: string;
    created_at?: string;
    last_sign_in_at?: string;
    email_confirmed_at?: string;
    phone?: string;
    phone_confirmed_at?: string;
    confirmed_at?: string; // Older alias for email_confirmed_at
    user_metadata?: Record<string, any> & { name?: string };
    app_metadata?: Record<string, any> & { provider?: string; providers?: string[] };
    aud?: string;
    identities?: any[]; // Replace 'any' with more specific type if known
    updated_at?: string;
    banned_until?: string; // Crucial for ban status ('none' if not banned or date string)
    // PrismaUser might have fields like 'name', 'emailVerified' which might not directly map
    // Adapt the TableCell rendering below based on the actual AdminUser fields you receive
}


interface ListUsersResponse {
	users: User[];
	total: number;
}

// --- Dialog Components (Consider moving to separate files later) ---

interface BanUserDialogProps {
    user: AdminUser;
    onSuccess: () => void; // Callback after successful ban
    trigger: React.ReactNode;
}

function BanUserDialog({ user, onSuccess, trigger }: BanUserDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [durationHours, setDurationHours] = useState<number | "">(24 * 7); // Default: 1 week
    const [isBanning, setIsBanning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBan = async () => {
        setIsBanning(true);
        setError(null);
        try {
            let banExpiresIn: number | undefined = undefined;
            if (typeof durationHours === 'number' && durationHours > 0) {
                banExpiresIn = durationHours * 60 * 60; // Convert hours to seconds
            } // If durationHours is "" or 0, ban is permanent

            await authClient.admin.banUser({
                userId: user.id,
                banReason: reason || undefined, // Send undefined if empty for default
                banExpiresIn: banExpiresIn,
            });
            alert(`User ${user.email || user.id} banned successfully.`); // Replace with toast
            setIsOpen(false);
            onSuccess(); // Refresh the table data
        } catch (err: any) {
            console.error("Failed to ban user:", err);
            setError(err.message || "Failed to ban user. Check console for details.");
            // Keep dialog open on error
        } finally {
            setIsBanning(false);
        }
    };

     // Reset form when dialog closes
     useEffect(() => {
        if (!isOpen) {
            setReason("");
            setDurationHours(24 * 7);
            setError(null);
            setIsBanning(false);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger >{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ban User: {user.email || user.id}</DialogTitle>
                    <DialogDescription>
                        Prevent this user from signing in. Banned users remain in the user list.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ban-reason" className="text-right">
                            Reason <span className="text-xs text-muted-foreground">(Optional)</span>
                        </Label>
                        <Input
                            id="ban-reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="col-span-3"
                            disabled={isBanning}
                        />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ban-duration" className="text-right">
                            Duration (hours)
                        </Label>
                        <Input
                            id="ban-duration"
                            type="number"
                            min="0"
                            placeholder="Empty or 0 = Permanent"
                            value={durationHours}
                            onChange={(e) => setDurationHours(e.target.value === "" ? "" : parseInt(e.target.value, 10) || 0)}
                            className="col-span-3"
                             disabled={isBanning}
                        />
                     </div>
                     {error && <p className="text-red-500 text-sm col-span-4 text-center">{error}</p>}
                </div>
                {/* <DialogFooter> */}
                    <DialogClose >
                         <Button variant="outline" disabled={isBanning}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleBan} disabled={isBanning}>
                        {isBanning ? "Banning..." : "Confirm Ban"}
                    </Button>
                {/* </DialogFooter> */}
            </DialogContent>
        </Dialog>
    );
}

// --- Main UsersTable Component ---

export default function UsersTable() {
	const [pageSize, setPageSize] = useState<number>(10);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageInput, setPageInput] = useState<string>("1");
	const [users, setUsers] = useState<User[]>([]); // Use AdminUser type
	const [totalUsers, setTotalUsers] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false); // Loading state for specific actions
	const [error, setError] = useState<Error | null>(null);

	const totalPages = useMemo(() => Math.max(1, Math.ceil(totalUsers / pageSize)), [totalUsers, pageSize]);

	// Update page input when currentPage changes
	useEffect(() => {
		setPageInput(String(currentPage));
	}, [currentPage]);

    // Function to fetch users, wrapped in useCallback
	const fetchUsers = useCallback(async (page: number, size: number, showLoadingIndicator = true) => {
		// Decide whether to show full table loading or action loading
        const setLoading = showLoadingIndicator ? setIsLoading : setIsActionLoading;
		setLoading(true);
		setError(null);

		try {
			const response = await authClient.admin.listUsers({
				query: { limit: size, offset: (page - 1) * size, // You might add sortBy here if needed
                       // Example: sortBy: [{ field: 'created_at', order: 'desc' }]
                },
			});
			const data = response?.data as ListUsersResponse | undefined; // Cast response data

			if (data) {
				setUsers(data.users || []);
				setTotalUsers(data.total || 0);
				const newTotalPages = Math.max(1, Math.ceil((data.total || 0) / size));
				if (page > newTotalPages) {
					// If current page is now invalid (e.g., after deletion/filtering), go to last page
					setCurrentPage(newTotalPages);
                    // Fetch might be re-triggered by setCurrentPage, handle potential infinite loop if logic is complex
                    // Here it's likely fine as the dependency array change will cause one re-fetch
				}
			} else {
				console.warn("Received unexpected response structure or no data:", response);
				setUsers([]);
				setTotalUsers(0);
                setError(new Error("Failed to fetch users: Invalid response format."));
			}
		} catch (err) {
			console.error("Failed to fetch users:", err);
			setError(err instanceof Error ? err : new Error("An unknown error occurred while fetching users"));
			setUsers([]);
			setTotalUsers(0);
		} finally {
			// Ensure both loading states are reset
            setIsLoading(false);
            setIsActionLoading(false);
		}
	}, [ ]); // No dependencies needed here as args are passed

    // Trigger fetch on page/size change
	useEffect(() => {
        // Show full loading spinner only on initial load or explicit page/size change
        const showLoading = users.length === 0 || isLoading;
		fetchUsers(currentPage, pageSize, showLoading);
	}, [currentPage, pageSize, fetchUsers]); // fetchUsers is stable due to useCallback


    // --- Action Handlers ---

    const refreshCurrentUserList = () => {
        // Refetch the *current* page without the main loading spinner
        fetchUsers(currentPage, pageSize, false);
    };

    const handleSetRole = async (userId: string, newRole: string ) => {
        setIsActionLoading(true);
        try {
            await authClient.admin.setRole({ userId, role: newRole });
            alert(`Role updated successfully for user ${userId}.`); // Replace with toast
            refreshCurrentUserList(); // Refresh data
        } catch (err: any) {
            console.error("Failed to set role:", err);
            alert(`Error setting role: ${err.message}`); // Replace with toast
             setIsActionLoading(false); // Stop loading on error
        }
        // Loading state is reset in fetchUsers' finally block if refreshCurrentUserList is called
    };

    const handleUnban = async (userId: string) => {
         setIsActionLoading(true);
         try {
             await authClient.admin.unbanUser({ userId });
             alert(`User ${userId} unbanned successfully.`); // Replace with toast
             refreshCurrentUserList();
         } catch (err: any) {
             console.error("Failed to unban user:", err);
             alert(`Error unbanning user: ${err.message}`); // Replace with toast
             setIsActionLoading(false);
         }
     };

     // --- Pagination Handlers ---

    const goToPage = (pageNumber: number) => {
		const newPage = Math.max(1, Math.min(pageNumber, totalPages));
		if (newPage !== currentPage) {
		    setCurrentPage(newPage);
        } else {
            // If trying to go to the same page, maybe refresh? Or do nothing.
            // For now, do nothing if already on the target page.
             setPageInput(String(newPage)); // Ensure input is synced even if page doesn't change
        }
	};

	const handlePageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPageInput(event.target.value);
	};

	const handlePageInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
            event.preventDefault();
			const pageNum = parseInt(pageInput, 10);
			if (!isNaN(pageNum)) {
				goToPage(pageNum);
			} else {
                setPageInput(String(currentPage)); // Reset if invalid
            }
		}
	};

	const handlePageSizeChange = (value: string) => {
		const newSize = parseInt(value, 10);
		setPageSize(newSize);
		setCurrentPage(1); // Reset to first page
	};

	// --- Render Logic ---

	if (isLoading && users.length === 0) {
		return <div className="flex justify-center items-center h-40"><span>Loading users...</span></div>;
	}

	if (error && users.length === 0) { // Show error prominently if no users could be loaded
		return <div className="flex justify-center p-4 text-red-500"><span>Error: {error.message}</span></div>;
	}

	return (
		<div className="space-y-4">
             {error && !isLoading && <div className="p-2 text-center text-yellow-600 bg-yellow-100 border border-yellow-300 rounded">Non-critical Error: {error.message} (Displaying possibly stale data)</div>}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Verified</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead> {/* Action Column */}
						</TableRow>
					</TableHeader>
					<TableBody>
						{(isLoading || isActionLoading) && users.length > 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                   {isActionLoading ? "Applying changes..." : "Loading..."}
                                </TableCell>
                            </TableRow>
                        )}
                        {/* Render rows only if not in primary loading state or if action is loading (to show overlay) */}
                        {(!isLoading || isActionLoading) && users.map((user) => {
                             const isBanned = user.banned 
                             // Example available roles (customize or fetch these)
                             const availableRoles = ['admin', 'editor', 'moderator', 'user'];

                            return (
                                <TableRow key={user.id} className={isActionLoading ? 'opacity-50 pointer-events-none' : ''}>
                                    <TableCell>{user.name || "N/A"}</TableCell>
                                    <TableCell>{user.email || "N/A"}</TableCell>
                                    <TableCell>{user.role || "N/A"}</TableCell>
                                    <TableCell>{user.emailVerified ? "Yes" : "No"}</TableCell>
                                    <TableCell>
                                        {isBanned ? (
                                            <span className="text-red-500">Banned</span>
                                        ) : (
                                            <span className="text-green-500">Active</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : "N/A"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild disabled={isActionLoading}>
                                                {/* <div className="h-8 w-8"> */}
                                                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isActionLoading}>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">User Actions</span>
                                                </Button>
                                                {/* </div> */}
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuSub>
                                                     <DropdownMenuSubTrigger>
                                                        <span>Set Role</span>
                                                    </DropdownMenuSubTrigger>
                                                     <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuLabel>Assign Role</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                             {availableRoles.map(role => (
                                                                <DropdownMenuItem
                                                                    key={role}
                                                                    disabled={user.role === role || isActionLoading} // Disable current role
                                                                    onSelect={() => handleSetRole(user.id, role)}
                                                                >
                                                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                                                    {user.role === role && <UserCheck className="h-4 w-4 ml-auto" />}
                                                                </DropdownMenuItem>
                                                            ))}
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>

                                                <DropdownMenuSeparator />

                                                {isBanned ? (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                             <DropdownMenuItem
                                                                className="text-green-600 focus:text-green-700 focus:bg-green-100"
                                                                onSelect={(e) => e.preventDefault()} // Prevent auto close
                                                                disabled={isActionLoading}
                                                               >
                                                                 Unban User
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                         <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                            <AlertDialogTitle>Unban User: {user.email || user.id}?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will allow the user to sign in again.
                                                            </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel disabled={isActionLoading}>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleUnban(user.id)}
                                                                    className="bg-green-600 hover:bg-green-700"
                                                                    disabled={isActionLoading}
                                                                >
                                                                    {isActionLoading ? "Unbanning..." : "Confirm Unban"}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>

                                                ) : (
                                                    <BanUserDialog
                                                        user={user}
                                                        onSuccess={refreshCurrentUserList}
                                                        trigger={
                                                            <DropdownMenuItem
                                                                className="text-red-600 focus:text-red-700 focus:bg-red-100"
                                                                onSelect={(e) => e.preventDefault()} // Prevent auto close when triggering dialog
                                                                disabled={isActionLoading}
                                                            >
                                                               <UserX className="mr-2 h-4 w-4" /> Ban User
                                                            </DropdownMenuItem>
                                                        }
                                                    />
                                                )}
                                                {/* Example: Delete Item (use AlertDialog)
                                                <DropdownMenuSeparator />
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                          <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-700 focus:bg-red-100"
                                                            onSelect={(e) => e.preventDefault()}
                                                           disabled={isActionLoading}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                                         </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    // ... AlertDialogContent for Delete ...
                                                </AlertDialog>
                                                 */}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {/* Handle empty state after loading */}
                        {!isLoading && !isActionLoading && users.length === 0 && totalUsers > 0 && (
							<TableRow>
								<TableCell colSpan={7} className="h-24 text-center">
									No users found on this page.
								</TableCell>
							</TableRow>
						)}
                         {!isLoading && !isActionLoading && users.length === 0 && totalUsers === 0 && (
							<TableRow>
								<TableCell colSpan={7} className="h-24 text-center">
									No users found matching your criteria.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* --- Pagination Controls --- */}
			{(totalPages > 1 || users.length > 0) && ( // Show controls if multiple pages OR if there are users on a single page
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 text-sm text-muted-foreground">
                    {/* Left Side: Total Count */}
                    <div className="flex-1 text-center sm:text-left order-last sm:order-first mt-2 sm:mt-0">
                        {totalUsers > 0 ? `${totalUsers} user${totalUsers !== 1 ? 's' : ''} total` : "No users"}
                    </div>

					{/* Right Side: Controls */}
					<div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2">
						{/* Rows per page */}
						<div className="flex items-center space-x-2">
							<span>Rows:</span>
							<Select value={String(pageSize)} onValueChange={handlePageSizeChange} disabled={isLoading || isActionLoading}>
								<SelectTrigger className="h-8 w-[70px]">
									<SelectValue placeholder={pageSize} />
								</SelectTrigger>
								<SelectContent side="top">
									{[5, 10, 25, 50, 100].map((size) => (
										<SelectItem key={size} value={String(size)}>
											{size}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Page Indicator and Go To */}
                        { totalPages > 1 && (
                            <div className="flex items-center space-x-2">
                                <span>Page</span>
                                <Input
                                    type="number"
                                    min="1"
                                    max={totalPages}
                                    value={pageInput}
                                    onChange={handlePageInputChange}
                                    onKeyDown={handlePageInputKeyDown}
                                    onBlur={() => { // Reset if blurred with invalid input
                                        const pageNum = parseInt(pageInput, 10);
                                        if (isNaN(pageNum)) setPageInput(String(currentPage));
                                    }}
                                    className="h-8 w-16 px-1 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // Basic styling to hide number arrows
                                    aria-label={`Current Page, Page ${currentPage} of ${totalPages}`}
                                    disabled={isLoading || isActionLoading}
                                />
                                <span>of {totalPages}</span>
                            </div>
                        )}

						{/* Navigation Buttons */}
						{ totalPages > 1 && (
                            <div className="flex items-center space-x-1">
                                <Button
                                    variant="outline" size="icon" className="h-8 w-8"
                                    onClick={() => goToPage(1)}
                                    disabled={currentPage <= 1 || isLoading || isActionLoading}
                                    aria-label="Go to first page"
                                > <ChevronsLeft className="h-4 w-4" /> </Button>
                                <Button
                                    variant="outline" size="icon" className="h-8 w-8"
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage <= 1 || isLoading || isActionLoading}
                                     aria-label="Go to previous page"
                                > <ChevronLeft className="h-4 w-4" /> </Button>
                                <Button
                                    variant="outline" size="icon" className="h-8 w-8"
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage >= totalPages || isLoading || isActionLoading}
                                    aria-label="Go to next page"
                                > <ChevronRight className="h-4 w-4" /> </Button>
                                <Button
                                    variant="outline" size="icon" className="h-8 w-8"
                                    onClick={() => goToPage(totalPages)}
                                    disabled={currentPage >= totalPages || isLoading || isActionLoading}
                                     aria-label="Go to last page"
                                > <ChevronsRight className="h-4 w-4" /> </Button>
                            </div>
                        )}
					</div>
				</div>
			)}
		</div>
	);
}