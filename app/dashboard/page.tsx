import { auth } from "@/auth";
import { headers } from "next/headers";
import React from "react";
import NotLoggedIn from "@/components/dashboard/not-loggedin";
import Banned from "@/components/dashboard/banned";
import UserInfo from "@/components/dashboard/user-info";

const DashboardPage: React.FC = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return (
            <NotLoggedIn/>
        );
    }

    const user = {
        ...session.user,
        role: session.user.role || "user", // Provide a default value for role
    };

    if (user.banned) {
        return (
            <Banned user={{banReason:user.banReason,banExpires:user.banExpires}}/>
        );
    }

    return (

        <div className="min-h-screen bg-gray-100 p-6">
            <UserInfo user={user} />
        </div>
    );
};

export default DashboardPage;