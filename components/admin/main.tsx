import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TemplatesTable from "@/components/admin/manage-templates/TemplatesTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersTable from "./user-table";

type Role = "admin" | "editor" | "moderator" | "user";
interface mainProps {
	className?: string;
	role: Role;
}

export const Main: FC<mainProps> = ({ className, role }) => {
	return (
		<div className={cn("", className)}>
			<div className="flex flex-col gap-4 max-w-7xl mx-auto w-full">
				<div className="flex flex-col gap-2 mb-8">
					<h1 className="text-3xl font-bold">Admin Dashboard</h1>
					<p className="text-muted-foreground">
						Manage users and view system statistics
					</p>
				</div>
				<div className="">
					<Tabs defaultValue="account" className="">
						<TabsList className="text-2xl m-4">
							<TabsTrigger defaultChecked value="Users">Users</TabsTrigger>
							<TabsTrigger value="templates">Card invites</TabsTrigger>
							{/* <TabsTrigger value="passwords">Password</TabsTrigger> */}
						</TabsList>
						<TabsContent defaultChecked value="Users">
							<Card>
								{/* <CardHeader>
									<CardTitle>Users</CardTitle>
								</CardHeader> */}
								<CardContent>
									<UsersTable />
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="templates">
							<Card>
								{/* <CardHeader>
									<CardTitle>Templates</CardTitle>
								</CardHeader> */}
								<CardContent>
									<TemplatesTable userRole={role} />
								</CardContent>
							</Card>
						</TabsContent>
						{/* <TabsContent value="passwords">
							Change your password here.
						</TabsContent> */}
					</Tabs>
				</div>

				{/* <Card>
					<CardHeader>
						<CardTitle>Users</CardTitle>
					</CardHeader>
					<CardContent>
						<UsersTable />
					</CardContent>
				</Card> */}
			</div>
		</div>
	);
};
