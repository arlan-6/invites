'use client'
import React from "react";
import { useLanguage } from "../language-provider";
import { authClient } from "@/auth-client";
import { redirect } from "next/navigation";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
    banned?: boolean | null | undefined;
    role: string | null | undefined;
    banReason?: string | null | undefined;
    banExpires?: Date | null | undefined;
}

interface UserInfoProps {
    user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
    const {t} = useLanguage()
      const logOutHandler = () =>{
        authClient.signOut()
        redirect('/')
      }
    return (
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center space-x-4">
                {user.image ? (
                    <img
                        src={user.image}
                        alt={`${user.name}'s profile`}
                        className="w-16 h-16 rounded-full"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {t("dashboard.welcome")}, {user.name}!
                    </h1>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">
                        {t("dashboard.role")}:{" "}
                        <span className="font-semibold">
                            {user.role || t("dashboard.defaultRole")}
                        </span>
                    </p>
                </div>
            </div>
            <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    {t("dashboard.overview")}
                </h2>
                <p className="mt-2 text-gray-600">{t("dashboard.overviewDescription")}</p>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-100 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-blue-800">
                        {t("dashboard.accountDetails")}
                    </h3>
                    <ul className="mt-2 text-gray-700">
                        <li>
                            <strong>{t("dashboard.accountCreated")}:</strong>{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                        </li>
                        <li>
                            <strong>{t("dashboard.lastUpdated")}:</strong>{" "}
                            {new Date(user.updatedAt).toLocaleDateString()}
                        </li>
                        <li>
                            <strong>{t("dashboard.emailVerified")}:</strong>{" "}
                            {user.emailVerified ? t("dashboard.yes") : t("dashboard.no")}
                        </li>
                    </ul>
                </div>
                <div className="p-4 bg-green-100 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-green-800">
                        {t("dashboard.quickActions")}
                    </h3>
                    <ul className="mt-2 text-gray-700">
                        <li>
                            <a  className="text-green-600 hover:underline">
                                {t("dashboard.editProfile")}
                            </a>
                        </li>
                        <li>
                            <a  className="text-green-600 hover:underline">
                                {t("dashboard.accountSettings")}
                            </a>
                        </li>
                        <li>
                            <Button onClick={logOutHandler} variant={'link'} className="text-red-500 group">
                                {t("dashboard.logout")} <LogOut className="group-hover:translate-x-1 transition-transform"/>
                            </Button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;