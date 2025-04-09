import { auth } from "@/auth";
import { headers } from "next/headers";
import React from "react";
import NotLoggedIn from "@/components/dashboard/not-loggedin";
import Banned from "@/components/dashboard/banned";
import UserInfo from "@/components/dashboard/user-info";
import UserInvitesList from "@/components/dashboard/user-invites-list";
import UseradvancedINivtesLIst from "@/components/dashboard/user-advanced-invites-list";

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

        <div className="min-h-screen bg-secondary p-6">
            <UserInfo user={user} />
            <br />
            <UserInvitesList userId={user.id}/>
            <UseradvancedINivtesLIst userId={user.id}/>
        </div>
    );
};

export default DashboardPage;