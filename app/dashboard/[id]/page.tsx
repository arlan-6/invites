import React, { FC } from "react";
import { cn } from "@/lib/utils";
import {
    GetAdvancedInviteById,
    // Assuming GetAdvancedInviteRsvpTrackById is not needed if rsvpTrack is on invite
} from "@/lib/advancedInvitesUtils";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    CalendarDays,
    MapPin,
    Clock,
    Users,
    CheckCircle,
    XCircle,
    Info,
    Gift,
    Shirt,
    ClipboardList,
    Contact,
    Hourglass,
} from "lucide-react"; // Using lucide-react for icons

// Define a type for the RSVP entries for better type safety
interface RsvpEntry {
    name: string;
    attendance: "going" | "notGoing";
    answerDate: Date | string; // Allow string if it comes from DB that way
}

// Define a more specific type for the invite data based on the provided structure
// (Adjust nullability based on your actual data guarantees)
interface AdvancedInvite {
    id: string;
    name: string;
    age?: string; // Assuming age might be optional or not always relevant to display
    dateTime: Date | string;
    location: string;
    address: string;
    addressLink?: string; // Assuming it might be a single link, adjust if truly string[]
    themeOrMessage?: string | null;
    dressCode?: string | null;
    giftInfo?: string | null;
    rsvpDeadline?: Date | null | string;
    contactInfo?: string | null;
    path: string;
    rsvpTrack: RsvpEntry[]; // Use the defined RsvpEntry type
    userId: string;
    templateId: string;
    expiresAt: Date | string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

interface PageProps {
    // Page components in Next.js App Router receive params directly, not a promise
    params: Promise<{
        id: string;
    }>;
}

const formatDateTime = (date: Date | string | null | undefined): string => {
    if (!date) return "N/A";
    try {
        const d = new Date(date);
        return d.toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        });
    } catch (e) {
        return "Invalid Date";
    }
};

const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return "N/A";
    try {
        const d = new Date(date);
        return d.toLocaleDateString(undefined, {
            dateStyle: "medium",
        });
    } catch (e) {
        return "Invalid Date";
    }
};


const Page: FC<PageProps> = async ({ params }) => {
    const { id } = await params; // No await needed here for params

    if (!id) {
        // This case is unlikely with Next.js routing but good practice
        return (
            <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
                <p className="text-xl text-muted-foreground">Invalid Invite ID.</p>
            </div>
        );
    }

    // Fetch the invite data
    const invite = (await GetAdvancedInviteById(id)) as AdvancedInvite | null; // Cast to our defined type

    if (!invite) {
        return (
            <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
                 <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="text-destructive">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg">Invite with ID '{id}' not found.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Ensure rsvpTrack is an array, even if empty
    const rsvpTrack: RsvpEntry[] = Array.isArray(invite.rsvpTrack) ? invite.rsvpTrack : [];

    const goingCount = rsvpTrack.filter((r) => r.attendance === "going").length;
    const notGoingCount = rsvpTrack.filter((r) => r.attendance === "notGoing").length;
    const totalResponses = rsvpTrack.length;

    return (
        <div className="container mx-auto max-w-5xl space-y-8 p-4 py-8 md:p-8">
            {/* --- Invite Details Card --- */}
            <Card className="overflow-hidden shadow-lg">
                <CardHeader className="bg-muted/30">
                    <CardTitle className="text-3xl font-bold text-primary">
                        {invite.name || "Event Details"}
                    </CardTitle>
                    <CardDescription className="text-lg">
                        Invite ID: <code className="font-mono">{invite.id}</code>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Date & Time */}
                        <div className="flex items-start space-x-3">
                            <CalendarDays className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                            <div>
                                <p className="font-semibold">Date & Time</p>
                                <p className="text-muted-foreground">
                                    {formatDateTime(invite.dateTime)}
                                </p>
                            </div>
                        </div>

                        {/* Location & Address */}
                        <div className="flex items-start space-x-3">
                            <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                            <div>
                                <p className="font-semibold">Location</p>
                                <p className="text-muted-foreground">{invite.location}</p>
                                <p className="text-sm text-muted-foreground">{invite.address}</p>
                                {invite.addressLink && (
                                    <a
                                        href={invite.addressLink} // Assuming single link
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        View Map / Directions
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Optional Fields Section */}
                         { (invite.themeOrMessage || invite.dressCode || invite.giftInfo || invite.rsvpDeadline || invite.contactInfo) && (
                           <div className="col-span-1 space-y-4 md:col-span-2">
                             <div className="border-t border-muted my-4"></div>
                             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {invite.themeOrMessage && (
                                    <div className="flex items-start space-x-3">
                                        <Info className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                        <div>
                                            <p className="font-semibold">Theme / Message</p>
                                            <p className="text-muted-foreground">{invite.themeOrMessage}</p>
                                        </div>
                                    </div>
                                )}
                                {invite.dressCode && (
                                    <div className="flex items-start space-x-3">
                                        <Shirt className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                        <div>
                                            <p className="font-semibold">Dress Code</p>
                                            <p className="text-muted-foreground">{invite.dressCode}</p>
                                        </div>
                                    </div>
                                )}
                                {invite.giftInfo && (
                                    <div className="flex items-start space-x-3">
                                        <Gift className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                        <div>
                                            <p className="font-semibold">Gift Information</p>
                                            <p className="text-muted-foreground">{invite.giftInfo}</p>
                                        </div>
                                    </div>
                                )}
                                {invite.rsvpDeadline && (
                                    <div className="flex items-start space-x-3">
                                        <Hourglass className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                        <div>
                                            <p className="font-semibold">RSVP Deadline</p>
                                            <p className="text-muted-foreground">
                                                {formatDate(invite.rsvpDeadline)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                 {invite.contactInfo && (
                                    <div className="flex items-start space-x-3">
                                        <Contact className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                        <div>
                                            <p className="font-semibold">Contact</p>
                                            <p className="text-muted-foreground">{invite.contactInfo}</p>
                                        </div>
                                    </div>
                                )}
                             </div>
                           </div>
                         )}
                    </div>
                </CardContent>
            </Card>

            {/* --- RSVP List Card --- */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <ClipboardList className="h-6 w-6" />
                        RSVP Responses
                    </CardTitle>
                    <CardDescription>
                        Summary of guest responses received so far.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-wrap items-center gap-4 text-lg font-medium">
                        <Badge variant="secondary" className="px-3 py-1 text-base">
                            <Users className="mr-2 h-4 w-4" />
                            Total Responses: {totalResponses}
                        </Badge>
                        <Badge variant="outline" className="border-green-500 bg-green-50 px-3 py-1 text-base text-green-700">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Going: {goingCount}
                        </Badge>
                        <Badge variant="outline" className="border-red-500 bg-red-50 px-3 py-1 text-base text-red-700">
                            <XCircle className="mr-2 h-4 w-4" />
                            Not Going: {notGoingCount}
                        </Badge>
                    </div>

                    {rsvpTrack.length > 0 ? (
                         <div className="overflow-hidden rounded-md border">
                             <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-[40%] px-4 py-3 text-left font-semibold">Name</TableHead>
                                        <TableHead className="w-[30%] px-4 py-3 text-left font-semibold">Answer Date</TableHead>
                                        <TableHead className="w-[30%] px-4 py-3 text-center font-semibold">Attendance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rsvpTrack.map((r, i) => (
                                        <TableRow key={i} className="hover:bg-muted/30">
                                            <TableCell className="px-4 py-3 font-medium">{r.name}</TableCell>
                                            <TableCell className="px-4 py-3 text-muted-foreground">
                                                {formatDate(r.answerDate)}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <Badge
                                                    variant={r.attendance === "going" ? "default" : "destructive"}
                                                    className={cn(
                                                        "w-24 justify-center capitalize",
                                                        r.attendance === "going"
                                                            ? "bg-green-600 hover:bg-green-700"
                                                            : "bg-red-600 hover:bg-red-700",
                                                    )}
                                                >
                                                    {r.attendance === "going" ? (
                                                        <CheckCircle className="mr-1 h-4 w-4" />
                                                    ) : (
                                                        <XCircle className="mr-1 h-4 w-4" />
                                                    )}
                                                    {r.attendance === "going" ? "Going" : "Not Going"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         </div>
                    ) : (
                        <p className="py-4 text-center text-muted-foreground">No RSVP responses recorded yet.</p>
                    )}
                </CardContent>
                 {rsvpTrack.length > 0 && (
                    <TableCaption className="pb-4">Detailed list of RSVP responses.</TableCaption>
                 )}
            </Card>
        </div>
    );
};

export default Page;