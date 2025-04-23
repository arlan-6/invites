
import { auth } from "@/auth";
import { Main } from "@/components/admin/main";
import TemplatesTable from "@/components/admin/manage-templates/TemplatesTable";
// import TemplatesTable from "@/components/admin/templates-table";
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
			<Main role={session.user.role as Role}/>
		</main>
	);
}