'use client';
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
    const { t } = useLanguage();

    const logOutHandler = () => {
        authClient.signOut();
        redirect('/');
    };

    return (
        <div className="max-w-4xl mx-auto bg-background shadow-lg rounded-lg p-6 ">
            <div className="flex items-center space-x-4">
                {user.image ? (
                    <img
                        src={user.image}
                        alt={`${user.name}'s profile`}
                        className="w-16 h-16 rounded-full border-2 border-blue-500 dark:border-blue-400"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t("dashboard.welcome")}, {user.name}!
                    </h1>
                    <p className="text-gray-700 dark:text-gray-300">{user.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("dashboard.role")}:{" "}
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {user.role || t("dashboard.defaultRole")}
                        </span>
                    </p>
                </div>
            </div>
            <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {t("dashboard.overview")}
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{t("dashboard.overviewDescription")}</p>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg shadow border border-blue-200 dark:border-blue-700">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                        {t("dashboard.accountDetails")}
                    </h3>
                    <ul className="mt-2 text-gray-700 dark:text-gray-300">
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
                <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg shadow border border-green-200 dark:border-green-700">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                        {t("dashboard.quickActions")}
                    </h3>
                    <ul className="mt-2 text-gray-700 dark:text-gray-300">
                        <li>
                            <a className="text-green-600 dark:text-green-400 hover:underline">
                                {t("dashboard.editProfile")}
                            </a>
                        </li>
                        <li>
                            <a className="text-green-600 dark:text-green-400 hover:underline">
                                {t("dashboard.accountSettings")}
                            </a>
                        </li>
                        <li>
                            <Button
                                onClick={logOutHandler}
                                variant="link"
                                className="text-red-500 dark:text-red-400 group"
                            >
                                {t("dashboard.logout")}{" "}
                                <LogOut className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;