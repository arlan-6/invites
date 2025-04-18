
import { auth } from "@/auth";
import TemplatesTable from "@/components/admin/templates-table";
import UsersTable from "@/components/admin/user-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { headers } from "next/headers";

type Role = 'admin' | 'editor' | 'moderator' | 'user';
export default async function AdminDashboard() {
    const session = await auth.api.getSession({
                headers: await headers(),
            });
    if(!session){return null}
	return (
		<main className="flex flex-col">
			<div className="flex flex-col gap-4 max-w-7xl mx-auto w-full">
				<div className="flex flex-col gap-2 mb-8">
					<h1 className="text-3xl font-bold">Admin Dashboard</h1>
					<p className="text-muted-foreground">
						Manage users and view system statistics
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Users</CardTitle>
					</CardHeader>
					<CardContent>
						<UsersTable />
					</CardContent>
				</Card>

                <Card>
					<CardHeader>
						<CardTitle>Templates</CardTitle>
					</CardHeader>
					<CardContent>
						<TemplatesTable userRole={session.user.role as Role}/>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}