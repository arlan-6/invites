"use client";
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
		redirect("/");
	};

	return (
		<div className="max-w-4xl mx-auto bg-background shadow-lg rounded-lg p-6 ">
			<div className="flex justify-between flex-wrap gap-4">
				<div className="flex items-center space-x-4">
					{user.image ? (
						<img
							src={user.image}
							alt={`${user.name}'s profile`}
							className="w-16 h-16 rounded-full border-2 border-primary "
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
                        <div className="flex justify-between flex-wrap w-full">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{t("dashboard.role")}:{" "}
							<span className="font-semibold text-primary ">
								{user.role || t("dashboard.defaultRole")}
							</span>
						</p>
                        
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{t("dashboard.accountCreated")}:{" "}
                            <span className="font-semibold text-primary ">
							{new Date(user.createdAt).toLocaleDateString("en-GB")}</span>
						</p></div>
					</div>
				</div>
				<Button
					onClick={logOutHandler}
					variant="outline"
					className="text-red-500 dark:text-red-400 group"
				>
					{t("dashboard.logout")}{" "}
					<LogOut className="group-hover:translate-x-1 transition-transform" />
				</Button>
			</div>
		</div>
	);
};

export default UserInfo;
